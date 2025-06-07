
export type CoinCategory = 
  | 'error_coin'
  | 'greek'
  | 'american'
  | 'british'
  | 'asian'
  | 'european'
  | 'ancient'
  | 'modern'
  | 'silver'
  | 'gold'
  | 'commemorative'
  | 'unclassified';

export interface CategoryInfo {
  id: CoinCategory;
  name: string;
  description: string;
  icon: string;
}

export const COIN_CATEGORIES: CategoryInfo[] = [
  {
    id: 'error_coin',
    name: 'Error Coins',
    description: 'Coins with minting errors',
    icon: '⚠️'
  },
  {
    id: 'greek',
    name: 'Greek Coins',
    description: 'Ancient and modern Greek coins',
    icon: '🏛️'
  },
  {
    id: 'american',
    name: 'American Coins',
    description: 'US coins and currency',
    icon: '🇺🇸'
  },
  {
    id: 'british',
    name: 'British Coins',
    description: 'UK coins and currency',
    icon: '🇬🇧'
  },
  {
    id: 'asian',
    name: 'Asian Coins',
    description: 'Asian coins and currency',
    icon: '🏮'
  },
  {
    id: 'european',
    name: 'European Coins',
    description: 'European coins and currency',
    icon: '🇪🇺'
  },
  {
    id: 'ancient',
    name: 'Ancient Coins',
    description: 'Historical ancient coins',
    icon: '🏺'
  },
  {
    id: 'modern',
    name: 'Modern Coins',
    description: 'Contemporary coins',
    icon: '💎'
  },
  {
    id: 'silver',
    name: 'Silver Coins',
    description: 'Silver bullion and coins',
    icon: '🥈'
  },
  {
    id: 'gold',
    name: 'Gold Coins',
    description: 'Gold bullion and coins',
    icon: '🥇'
  },
  {
    id: 'commemorative',
    name: 'Commemorative',
    description: 'Special edition commemorative coins',
    icon: '🏆'
  },
  {
    id: 'unclassified',
    name: 'Unclassified',
    description: 'Uncategorized coins',
    icon: '📦'
  }
];
