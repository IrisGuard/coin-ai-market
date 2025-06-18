
// Category mapping utility to convert UI categories to database enum values
type CoinCategory = 'american' | 'european' | 'ancient' | 'silver' | 'gold' | 'modern' | 'asian' | 'error_coin' | 'greek' | 'british' | 'commemorative' | 'unclassified';

export const mapUIToDatabaseCategory = (uiCategory: string): CoinCategory => {
  const categoryMap: Record<string, CoinCategory> = {
    // UI Categories -> Database enum values
    'USA COINS': 'american',
    'EUROPEAN COINS': 'european', 
    'ANCIENT COINS': 'ancient',
    'ERROR COINS': 'error_coin',
    'SILVER COINS': 'silver',
    'GOLD COINS': 'gold',
    'COMMEMORATIVE COINS': 'commemorative',
    'WORLD COINS': 'modern',
    'RUSSIA COINS': 'european',
    'CHINESE COINS': 'asian',
    'BRITISH COINS': 'british',
    'CANADIAN COINS': 'american',
    'Double Die': 'error_coin',
    'Off-Center': 'error_coin',
    'Ancient': 'ancient',
    'Modern': 'modern',
    'Error': 'error_coin',
    'Graded': 'modern',
    'European': 'european',
    'American': 'american',
    'Asian': 'asian',
    'Gold': 'gold',
    'Silver': 'silver',
    'Rare': 'modern'
  };

  return categoryMap[uiCategory] || 'unclassified'; // Default fallback
};

export const getValidDatabaseCategories = (): CoinCategory[] => {
  return ['ancient', 'modern', 'error_coin', 'european', 'american', 'asian', 'gold', 'silver', 'british', 'commemorative', 'greek', 'unclassified'];
};
