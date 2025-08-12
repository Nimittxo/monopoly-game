// backend/src/game/game.service.ts

// Add NotFoundException and UnauthorizedException to this import line
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { GameState, Player } from './game.models';
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

    const currentPlayerIndex = this.gameState.players.findIndex((p) => p.id === playerId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % this.gameState.players.length;
    this.gameState.currentPlayerTurnId = this.gameState.players[nextPlayerIndex].id;
    
    return { die1, die2 };
  }
}