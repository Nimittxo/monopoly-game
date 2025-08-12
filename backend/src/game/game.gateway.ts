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
  // @WebSocketServer() gives us access to the underlying Socket.IO server instance.
  @WebSocketServer()
  server: Server;

  // We inject the GameService to use its logic.
  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
    console.log(`🔌 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`🔌 Client disconnected: ${client.id}`);
  }

  // @SubscribeMessage tells the gateway to handle a specific incoming message.
  // In this case, the message name is 'createGame'.
  @SubscribeMessage('createGame')
  handleCreateGame(client: Socket, payload: { playerNames: string[] }): void {
    console.log('Received createGame request with payload:', payload);

    // Use our service to create a new game state.
    const newGameState = this.gameService.createGame(payload.playerNames);

    // 'emit' sends a message to ALL connected clients.
    // We send a 'gameStateUpdate' message with the new state as the data.
    this.server.emit('gameStateUpdate', newGameState);
  }

  // We can add more @SubscribeMessage handlers here for other actions like 'rollDice'.
  @SubscribeMessage('rollDice')
  handleRollDice(client: Socket, payload: { playerId: string }): void {
    try {
      // 1. Call the service to perform the logic
      const diceResult = this.gameService.rollDice(payload.playerId);

      // 2. Get the updated game state
      const updatedGameState = this.gameService.getGameState();

      // 3. Emit the dice roll result for animations
      this.server.emit('diceRolled', {
        playerId: payload.playerId,
        ...diceResult,
      });

      // 4. Emit the full updated state
      this.server.emit('gameStateUpdate', updatedGameState);
      
    } catch (error) {
      // It's good practice to emit errors back to the client
      // so they can be handled in the UI.
      client.emit('error', { message: error.message });
      console.error(error);
    }
  }
}