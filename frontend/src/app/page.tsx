// frontend/src/app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import type { GameState } from '../types/game';

const SOCKET_URL = 'http://localhost:3001';
const MY_PLAYER_NAME = 'Alice';

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [diceResult, setDiceResult] = useState<{ d1: number, d2: number } | null>(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL);
    setSocket(socketInstance);
    socketInstance.on('connect', () => console.log('Connected to WebSocket server!'));
    socketInstance.on('gameStateUpdate', (newGameState: GameState) => {
      setGameState(newGameState);
      setTimeout(() => setDiceResult(null), 2000); 
    });
    socketInstance.on('diceRolled', (result: { playerId: string, die1: number, die2: number }) => {
      setDiceResult({ d1: result.die1, d2: result.die2 });
    });
    socketInstance.on('error', (error: { message: string }) => {
      alert(`An error occurred: ${error.message}`);
    });
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const me = gameState?.players.find(p => p.name === MY_PLAYER_NAME);
  const isMyTurn = me?.id === gameState?.currentPlayerTurnId;

  const createGameHandler = () => {
    if (socket) socket.emit('createGame', { playerNames: ['Alice', 'Bob'] });
  };
  
  const rollDiceHandler = () => {
    if (socket && me?.id) {
      // This will now send the message to the backend
      socket.emit('rollDice', { playerId: me.id });
    }
  };
  
  return (
    <main style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>Monopoly: International Edition</h1>
      <hr />

      {!gameState ? (
        <button onClick={createGameHandler} style={{ fontSize: '1.2rem', padding: '10px', cursor: 'pointer' }}>
          Create New Game
        </button>
      ) : (
        <div>
          <h2>Game In Progress! (You are {MY_PLAYER_NAME})</h2>

          <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button 
              onClick={rollDiceHandler} 
              disabled={!isMyTurn}
              style={{ 
                fontSize: '1.2rem', 
                padding: '10px', 
                cursor: 'pointer',
                border: '1px solid #ccc',
                backgroundColor: isMyTurn ? '#90EE90' : '#f0f0f0',
                borderRadius: '5px'
              }}
            >
              Roll Dice
            </button>
            {diceResult && (
              <div style={{ fontSize: '2rem' }}>
                🎲 Rolled a {diceResult.d1} and {diceResult.d2}!
              </div>
            )}
          </div>
          
          <p>Game ID: {gameState.id}</p>
          <p>Current Turn: <strong>{gameState.players.find(p => p.id === gameState.currentPlayerTurnId)?.name}</strong></p>
          
          {/* THE FIX: By adding a max-height and overflow-y, we constrain the <pre>
              tag and prevent it from interfering with the button above it. */}
          <pre style={{ 
            backgroundColor: '#f4f4f4', 
            border: '1px solid #ddd', 
            padding: '10px', 
            whiteSpace: 'pre-wrap', 
            wordWrap: 'break-word',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {JSON.stringify(gameState, null, 2)}
          </pre> 

        </div>
      )}
    </main>
  );
}