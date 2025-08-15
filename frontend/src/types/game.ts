// frontend/src/types/game.ts
// NOTE: This should mirror the interfaces in `backend/src/game/game.models.ts`

export interface Player {
  id: string;
  name: string;
  money: number;
  position: number;
}

export interface GameState {
  id: string;
  players: Player[];
  board: any[]; // Using `any` for now, can be replaced with detailed types later
  currentPlayerTurnId: string;
  gameStatus: 'waiting' | 'in-progress' | 'finished';
  isBot?: boolean;
}