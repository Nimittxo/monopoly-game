// backend/src/game/board.data.ts

import { AnyBoardSquare } from './game.models';

// Data for our custom Monopoly: International Edition board
export const INITIAL_BOARD: AnyBoardSquare[] = [
  // Section 1
  { id: 'go', name: 'Go', type: 'special' },
  { id: 'mumbai', name: 'Mumbai', type: 'property', price: 60, rent: [2, 10, 30, 90, 160, 250], houseCost: 50, color: '#A36A4F', ownerId: null, houses: 0 },
  { id: 'community-chest-1', name: 'Community Chest', type: 'card', cardType: 'community-chest' },
  { id: 'delhi', name: 'Delhi', type: 'property', price: 60, rent: [4, 20, 60, 180, 320, 450], houseCost: 50, color: '#A36A4F', ownerId: null, houses: 0 },
  { id: 'income-tax', name: 'Income Tax', type: 'tax', amount: 200 },
  { id: 'heathrow-airport', name: 'Heathrow Airport', type: 'railroad', price: 200, ownerId: null },
  { id: 'cairo', name: 'Cairo', type: 'property', price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50, color: '#AADEF8', ownerId: null, houses: 0 },
  { id: 'chance-1', name: 'Chance', type: 'card', cardType: 'chance' },
  { id: 'giza', name: 'Giza', type: 'property', price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50, color: '#AADEF8', ownerId: null, houses: 0 },
  { id: 'alexandria', name: 'Alexandria', type: 'property', price: 120, rent: [8, 40, 100, 300, 450, 600], houseCost: 50, color: '#AADEF8', ownerId: null, houses: 0 },
  
  // Section 2
  { id: 'jail', name: 'Jail / Just Visiting', type: 'special' },
  { id: 'tokyo', name: 'Tokyo', type: 'property', price: 140, rent: [10, 50, 150, 450, 625, 750], houseCost: 100, color: '#D8398C', ownerId: null, houses: 0 },
  { id: 'power-grid', name: 'Global Power Grid', type: 'utility', price: 150, ownerId: null },
  { id: 'kyoto', name: 'Kyoto', type: 'property', price: 140, rent: [10, 50, 150, 450, 625, 750], houseCost: 100, color: '#D8398C', ownerId: null, houses: 0 },
  { id: 'osaka', name: 'Osaka', type: 'property', price: 160, rent: [12, 60, 180, 500, 700, 900], houseCost: 100, color: '#D8398C', ownerId: null, houses: 0 },
  { id: 'dubai-airport', name: 'Dubai Int. Airport', type: 'railroad', price: 200, ownerId: null },
  { id: 'rome', name: 'Rome', type: 'property', price: 180, rent: [14, 70, 200, 550, 750, 950], houseCost: 100, color: '#F8982C', ownerId: null, houses: 0 },
  { id: 'community-chest-2', name: 'Community Chest', type: 'card', cardType: 'community-chest' },
  { id: 'venice', name: 'Venice', type: 'property', price: 180, rent: [14, 70, 200, 550, 750, 950], houseCost: 100, color: '#F8982C', ownerId: null, houses: 0 },
  { id: 'milan', name: 'Milan', type: 'property', price: 200, rent: [16, 80, 220, 600, 800, 1000], houseCost: 100, color: '#F8982C', ownerId: null, houses: 0 },
  
  // Section 3
  { id: 'free-parking', name: 'Free Parking', type: 'special' },
  { id: 'new-york', name: 'New York', type: 'property', price: 220, rent: [18, 90, 250, 700, 875, 1050], houseCost: 150, color: '#ED303C', ownerId: null, houses: 0 },
  { id: 'chance-2', name: 'Chance', type: 'card', cardType: 'chance' },
  { id: 'los-angeles', name: 'Los Angeles', type: 'property', price: 220, rent: [18, 90, 250, 700, 875, 1050], houseCost: 150, color: '#ED303C', ownerId: null, houses: 0 },
  { id: 'chicago', name: 'Chicago', type: 'property', price: 240, rent: [20, 100, 300, 750, 925, 1100], houseCost: 150, color: '#ED303C', ownerId: null, houses: 0 },
  { id: 'haneda-airport', name: 'Tokyo Haneda Airport', type: 'railroad', price: 200, ownerId: null },
  { id: 'rio-de-janeiro', name: 'Rio de Janeiro', type: 'property', price: 260, rent: [22, 110, 330, 800, 975, 1150], houseCost: 150, color: '#FFEF3A', ownerId: null, houses: 0 },
  { id: 'sao-paulo', name: 'São Paulo', type: 'property', price: 260, rent: [22, 110, 330, 800, 975, 1150], houseCost: 150, color: '#FFEF3A', ownerId: null, houses: 0 },
  { id: 'internet-provider', name: 'Global Internet Provider', type: 'utility', price: 150, ownerId: null },
  { id: 'salvador', name: 'Salvador', type: 'property', price: 280, rent: [24, 120, 360, 850, 1025, 1200], houseCost: 150, color: '#FFEF3A', ownerId: null, houses: 0 },
  
  // Section 4
  { id: 'go-to-jail', name: 'Go To Jail', type: 'special' },
  { id: 'sydney', name: 'Sydney', type: 'property', price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200, color: '#4CAF50', ownerId: null, houses: 0 },
  { id: 'melbourne', name: 'Melbourne', type: 'property', price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200, color: '#4CAF50', ownerId: null, houses: 0 },
  { id: 'community-chest-3', name: 'Community Chest', type: 'card', cardType: 'community-chest' },
  { id: 'canberra', name: 'Canberra', type: 'property', price: 320, rent: [28, 150, 450, 1000, 1200, 1400], houseCost: 200, color: '#4CAF50', ownerId: null, houses: 0 },
  { id: 'lax-airport', name: 'Los Angeles (LAX) Airport', type: 'railroad', price: 200, ownerId: null },
  { id: 'chance-3', name: 'Chance', type: 'card', cardType: 'chance' },
  { id: 'paris', name: 'Paris', type: 'property', price: 350, rent: [35, 175, 500, 1100, 1300, 1500], houseCost: 200, color: '#4285F4', ownerId: null, houses: 0 },
  { id: 'super-tax', name: 'Super Tax', type: 'tax', amount: 100 },
  { id: 'marseille', name: 'Marseille', type: 'property', price: 400, rent: [50, 200, 600, 1400, 1700, 2000], houseCost: 200, color: '#4285F4', ownerId: null, houses: 0 },
];