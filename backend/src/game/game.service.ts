// backend/src/game/game.service.ts

import { Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { GameState, Player, PropertySquare } from './game.models';
import { INITIAL_BOARD } from './board.data';
import { randomUUID } from 'crypto';
import * as _ from 'lodash';

@Injectable()
export class GameService {
  private gameState: GameState | null = null;

  createGame(playerNames: string[]): GameState {
    const players: Player[] = playerNames.map((name) => ({
      id: randomUUID(),
      name: name,
      money: 1500,
      position: 0,
      isBot: name === 'Bob',
    }));
    this.gameState = {
      id: randomUUID(),
      players: players,
      board: _.cloneDeep(INITIAL_BOARD),
      currentPlayerTurnId: players[0]?.id,
      gameStatus: 'in-progress',
      actionRequired: null,
    };
    console.log('New Game Created with Full Board');
    return this.gameState;
  }

  getGameState(): GameState | null {
    return this.gameState;
  }
  
  // MODIFIED: Removed the duplicate turn-passing logic from the end of this method.
  rollDice(playerId: string): { die1: number; die2: number } {
    if (!this.gameState) throw new NotFoundException('Game not found.');
    if (this.gameState.currentPlayerTurnId !== playerId) throw new UnauthorizedException('It is not your turn!');
    if (this.gameState.actionRequired) throw new UnprocessableEntityException('Cannot roll dice, an action is required.');

    const player = this.gameState.players.find((p) => p.id === playerId);
    if (!player) throw new NotFoundException('Player not found.');

    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const totalRoll = die1 + die2;
    console.log(`${player.name} rolled a ${totalRoll} (${die1} + ${die2})`);

    const oldPosition = player.position;
    player.position = (oldPosition + totalRoll) % 40; 
    console.log(`${player.name} moved from ${oldPosition} to ${player.position}`);

    if (player.position < oldPosition) {
      console.log(`${player.name} passed GO and collected $200.`);
      player.money += 200;
    }
    
    this._handleLandingOnSquare(player);

    return { die1, die2 };
  }
  
  // MODIFIED: Added a check to ensure the player exists.
  buyProperty(playerId: string): void {
    if (!this.gameState || !this.gameState.actionRequired) throw new UnprocessableEntityException('No property to buy.');
    if (this.gameState.actionRequired.playerId !== playerId) throw new UnauthorizedException('Not your turn to buy');

    const player = this.gameState.players.find(p => p.id === playerId);
    // FIX: Add this check for the player
    if (!player) {
      throw new NotFoundException('Player in action not found.');
    }

    const square = this.gameState.board[player.position] as PropertySquare;

    if (player.money < square.price) throw new UnprocessableEntityException('Not enough money!');

    player.money -= square.price;
    square.ownerId = player.id;
    console.log(`${player.name} bought ${square.name} for $${square.price}.`);

    this.gameState.actionRequired = null;
    this._passTurn();
  }

  declineToBuy(playerId: string): void {
    if (!this.gameState || !this.gameState.actionRequired) throw new UnprocessableEntityException('No action to decline');
    if (this.gameState.actionRequired.playerId !== playerId) throw new UnauthorizedException('Not your action to decline');

    console.log(`${playerId} declined to buy the property.`);
    this.gameState.actionRequired = null;
    this._passTurn();
  }

  private _handleLandingOnSquare(player: Player) {
    if (!this.gameState) return;
    const square = this.gameState.board[player.position];
    console.log(`${player.name} landed on ${square.name}`);

    let turnShouldPass = true;

    switch (square.type) {
      case 'property':
        if (square.ownerId && square.ownerId !== player.id) {
          this._payRent(player, square as PropertySquare);
        } else if (!square.ownerId) {
          this.gameState.actionRequired = {
            playerId: player.id,
            type: 'buy-property',
            squareId: square.id,
          };
          turnShouldPass = false; 
          console.log(`Game is awaiting purchase decision for ${square.name}.`);
        }
        break;
      case 'tax':
        console.log(`${player.name} pays $${square.amount} in tax.`);
        player.money -= square.amount;
        break;
      default:
        console.log(`Landed on a ${square.type} square. No action yet.`);
        break;
    }
    
    if (turnShouldPass) {
      this._passTurn();
    }
  }

  private _payRent(player: Player, square: PropertySquare) {
    if (!this.gameState) return;
    const owner = this.gameState.players.find(p => p.id === square.ownerId);
    if (!owner) return;
    const rentAmount = square.rent[0]; 
    player.money -= rentAmount;
    owner.money += rentAmount;
    console.log(`${player.name} paid $${rentAmount} rent to ${owner.name}.`);
  }
  
  private _passTurn() {
    if (!this.gameState) return;
    const currentPlayerId = this.gameState.currentPlayerTurnId;
    const currentPlayerIndex = this.gameState.players.findIndex((p) => p.id === currentPlayerId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % this.gameState.players.length;
    const nextPlayer = this.gameState.players[nextPlayerIndex];
    this.gameState.currentPlayerTurnId = nextPlayer.id;
    console.log(`Turn passed to ${nextPlayer.name}.`);
  }
}