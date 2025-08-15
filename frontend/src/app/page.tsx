// frontend/src/app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import type { GameState, Player, AnyBoardSquare } from '../types/game';

const SOCKET_URL = 'http://localhost:3001';
const MY_PLAYER_NAME = 'Alice';

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [diceResult, setDiceResult] = useState<{ d1: number, d2: number } | null>(null);

  // --- SMARTER BOT LOGIC ---
  useEffect(() => {
    if (!socket || !gameState) return;

    const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayerTurnId);

    // Only proceed if the current player is a bot
    if (!currentPlayer?.isBot) return;

    // Wait a moment to make the bot's actions feel natural
    const actionTimeout = setTimeout(() => {
      // Case 1: The bot needs to make a purchase decision
      if (gameState.actionRequired?.type === 'buy-property' && gameState.actionRequired.playerId === currentPlayer.id) {
        console.log(`Bot ${currentPlayer.name} is deciding whether to buy...`);
        const property = gameState.board.find(s => s.id === gameState.actionRequired?.squareId) as any;
        
        // Simple AI: Buy if the bot can afford it.
        if (property && currentPlayer.money >= property.price) {
          socket.emit('buyProperty', { playerId: currentPlayer.id });
        } else {
          socket.emit('declineToBuy', { playerId: currentPlayer.id });
        }
      } 
      // Case 2: It's the bot's turn and there are no other pending actions, so roll the dice.
      else if (!gameState.actionRequired) {
        console.log(`Bot ${currentPlayer.name} is rolling the dice...`);
        socket.emit('rollDice', { playerId: currentPlayer.id });
      }
    }, 1500);

    // Cleanup the timeout if the component re-renders before it fires
    return () => clearTimeout(actionTimeout);

  }, [gameState, socket]);

  // Main useEffect for setting up socket listeners
  useEffect(() => {
    const socketInstance = io(SOCKET_URL);
    setSocket(socketInstance);
    
    socketInstance.on('connect', () => console.log('Connected to WebSocket server!'));
    socketInstance.on('gameStateUpdate', (newGameState: GameState) => setGameState(newGameState));
    socketInstance.on('diceRolled', (result: { die1: number, die2: number }) => setDiceResult(result));
    socketInstance.on('error', (error: { message: string }) => alert(`An error occurred: ${error.message}`));

    return () => socketInstance.disconnect();
  }, []);

  // --- UI Logic and Event Handlers ---
  const me = gameState?.players.find(p => p.name === MY_PLAYER_NAME);
  const isMyTurn = me?.id === gameState?.currentPlayerTurnId;
  const myActionRequired = gameState?.actionRequired?.playerId === me?.id;
  const canRollDice = isMyTurn && !gameState?.actionRequired;
  const propertyToBuy = myActionRequired && gameState?.actionRequired?.type === 'buy-property'
    ? gameState.board.find(s => s.id === gameState.actionRequired?.squareId)
    : null;

  const createGameHandler = () => { if (socket) socket.emit('createGame', { playerNames: ['Alice', 'Bob'] }); };
  const rollDiceHandler = () => { if (socket && canRollDice && me) socket.emit('rollDice', { playerId: me.id }); };
  const buyPropertyHandler = () => { if (socket && myActionRequired && me) socket.emit('buyProperty', { playerId: me.id }); };
  const declineToBuyHandler = () => { if (socket && myActionRequired && me) socket.emit('declineToBuy', { playerId: me.id }); };

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>Monopoly: International Edition</h1>
      <hr />
      {!gameState ? (
        <button onClick={createGameHandler}>Create New Game</button>
      ) : (
        <div>
          <h2>Game In Progress! (You are {MY_PLAYER_NAME})</h2>
          
          <div style={{ margin: '20px 0', minHeight: '50px' }}>
            {propertyToBuy ? (
              <div>
                <h4>Buy {propertyToBuy.name}?</h4>
                <button onClick={buyPropertyHandler}>Buy</button>
                <button onClick={declineToBuyHandler} style={{marginLeft: '10px'}}>Decline</button>
              </div>
            ) : (
              <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                 <button onClick={rollDiceHandler} disabled={!canRollDice}>Roll Dice</button>
                 {diceResult && <div>🎲 Rolled a {diceResult.d1} and {diceResult.d2}!</div>}
              </div>
            )}
          </div>
          
          <p>Current Turn: <strong>{gameState.players.find(p => p.id === gameState.currentPlayerTurnId)?.name}</strong></p>
          <pre style={{ maxHeight: '400px', overflowY: 'auto', backgroundColor: '#f4f4f4', border: '1px solid #ddd', padding: '10px' }}>
            {JSON.stringify(gameState, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}