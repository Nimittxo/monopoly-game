// backend/src/game/game.service.ts

// Add NotFoundException and UnauthorizedException to this import line
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
    }));

    this.gameState = {
      id: randomUUID(),
      players: players,
      board: _.cloneDeep(INITIAL_BOARD),
      currentPlayerTurnId: players[0]?.id,
      gameStatus: 'in-progress',
    };

    console.log('New Game Created with Full Board');
    return this.gameState;
  }

  getGameState(): GameState | null {
    return this.gameState;
  }
  
  rollDice(playerId: string): { die1: number; die2: number } {
    if (!this.gameState) {
      throw new NotFoundException('Game not found.');
    }
    if (this.gameState.currentPlayerTurnId !== playerId) {
      throw new UnauthorizedException('It is not your turn!');
    }

    const player = this.gameState.players.find((p) => p.id === playerId);
    if (!player) {
      throw new NotFoundException('Player not found.');
    }

    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const totalRoll = die1 + die2;
    console.log(`${player.name} rolled a ${totalRoll} (${die1} + ${die2})`);

    const oldPosition = player.position;
    player.position = (oldPosition + totalRoll) % 40; 

    if (player.position < oldPosition) {
      console.log(`${player.name} passed GO and collected $200.`);
      player.money += 200;
    }
    this._handleLandingOnSquare(player);

    const currentPlayerIndex = this.gameState.players.findIndex((p) => p.id === playerId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % this.gameState.players.length;
    this.gameState.currentPlayerTurnId = this.gameState.players[nextPlayerIndex].id;
    
    return { die1, die2 };
  }

  private _handleLandingOnSquare(player: Player) {
    if (!this.gameState) return;

    const square = this.gameState.board[player.position];
    console.log(`${player.name} landed on ${square.name}`);

    switch (square.type) {
      case 'property':
        if (square.ownerId && square.ownerId !== player.id) {
          // If the property is owned by another player, pay rent
          this._payRent(player, square);
        } else if (!square.ownerId) {
          // If unowned, for now we just log a message. Later, we'll give the player a choice.
          console.log(`Property ${square.name} is unowned. Player has the option to buy.`);
        }
        break;
      
      case 'tax':
        console.log(`${player.name} pays $${square.amount} in tax.`);
        player.money -= square.amount;
        break;

      // We will add more cases for railroad, utility, card, etc. later
      default:
        console.log(`Landed on a ${square.type} square. No action yet.`);
        break;
    }
  }


  private _payRent(player: Player, square: PropertySquare) {
    if (!this.gameState) return;

    const owner = this.gameState.players.find(p => p.id === square.ownerId);
    if (!owner) return;

    // For now, we'll use the base rent (rent for 0 houses)
    const rentAmount = square.rent[0]; 
    
    player.money -= rentAmount;
    owner.money += rentAmount;

    console.log(`${player.name} paid $${rentAmount} rent to ${owner.name}.`);
  }
}