
export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare';

export interface Coin {
  id: string;
  name: string;
  year: number;
  grade: string;
  price: number;
  rarity: Rarity;
  image: string;
  isAuction?: boolean;
  timeLeft?: string;
}
