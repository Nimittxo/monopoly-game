// backend/src/game/game.gateway.ts

import { 
  SubscribeMessage, 
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
 } from '@nestjs/websockets';
import { 
  Server,
  Socket
} from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000', // Your frontend URL
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
    console.log(`🔌 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`🔌 Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('createGame')
  handleCreateGame(client: Socket, payload: { playerNames: string[] }): void {
    console.log('Received createGame request with payload:', payload);
    const newGameState = this.gameService.createGame(payload.playerNames);
    this.server.emit('gameStateUpdate', newGameState);
  }

  @SubscribeMessage('rollDice')
  handleRollDice(client: Socket, payload: { playerId: string }): void {
    try {
      const diceResult = this.gameService.rollDice(payload.playerId);
      const updatedGameState = this.gameService.getGameState();
      this.server.emit('diceRolled', { playerId: payload.playerId, ...diceResult });
      this.server.emit('gameStateUpdate', updatedGameState);
    } catch (error) {
      client.emit('error', { message: error.message });
      console.error(error);
    }
  }

  @SubscribeMessage('buyProperty')
  handleBuyProperty(client: Socket, payload: { playerId: string }): void {
    try {
      this.gameService.buyProperty(payload.playerId);
      const updatedGameState = this.gameService.getGameState();
      this.server.emit('gameStateUpdate', updatedGameState);
    } catch (error) {
      client.emit('error', { message: error.message });
      console.error(error);
    }
  }

  @SubscribeMessage('declineToBuy')
  handleDeclineToBuy(client: Socket, payload: { playerId: string }): void {
    try {
      this.gameService.declineToBuy(payload.playerId);
      const updatedGameState = this.gameService.getGameState();
      this.server.emit('gameStateUpdate', updatedGameState);
    } catch (error) { // FIX: Add curly braces here
      client.emit('error', { message: error.message });
      console.error(error);
    }
  }
}