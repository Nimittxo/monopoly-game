// backend/src/game/game.models.ts

export interface BoardSquare {
  id: string;
  name: string;
  type: 'property' | 'railroad' | 'utility' | 'special' | 'tax' | 'card';
}

export interface PropertySquare extends BoardSquare {
  type: 'property';
  price: number;
  rent: number[];
  houseCost: number;
  // FIX: These are runtime properties, so we make them optional with `?`
  auctionBid?: number[]; 
  mortgage?: number; // A single mortgage value is more common than an array
  color: string;
  ownerId: string | null;
  houses: number;
}

export interface RailroadSquare extends BoardSquare {
  type: 'railroad';
  price: number;
  ownerId: string | null;
}

export interface UtilitySquare extends BoardSquare {
  type: 'utility';
  price: number;
  // FIX: These are runtime properties, so we make them optional with `?`
  upgrade?: number;
  upgradeUtility?: number[];
  ownerId: string | null;
}

export interface TaxSquare extends BoardSquare { 
  type: 'tax';
  amount: number;
}

export interface CardSquare extends BoardSquare {
  type: 'card';
  cardType: 'chance' | 'community-chest';
}

export interface SpecialSquare extends BoardSquare {
  type: 'special';
  // FIX: These are runtime properties, so we make them optional with `?`
  OnStart?: boolean;
  InJail?: boolean;
  FreeParking?: boolean;
  OnVacation?: boolean;
}

// Union representing any Possible square on the board
export type AnyBoardSquare =
  | PropertySquare
  | RailroadSquare
  | UtilitySquare
  | TaxSquare
  | CardSquare
  | SpecialSquare;

export interface Player {
  id: string;
  name: string;
  money: number;
  position: number;
}

export interface GameState {
  id: string;
  players: Player[]; 
  board: AnyBoardSquare[];
  currentPlayerTurnId: string;
  gameStatus: 'waiting' | 'in-progress' | 'finished';
}