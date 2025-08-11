export interface BoardSquare {
    id: string;
    name: string;
    type: 'property' | 'railroad' | 'utility' | 'special' | 'tax' | 'card';
}

export interface PropertySquare extends BoardSquare {
    type: 'property';
    price: number;
    rent: number[]; //Array of values from different properties and Houses
    houseCost: number;
    auctionBid: number[]; //Array of bids
    mortgage: number[]; //Array of properties on Mortgage
    color: string;
    ownerId: string | null;
    houses: number;

}