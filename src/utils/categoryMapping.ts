
// Enhanced category mapping for error coins and all categories
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
    
    // Enhanced error coin detection
    'Double Die': 'error_coin',
    'Off-Center': 'error_coin',
    'Doubled Die': 'error_coin',
    'Double Strike': 'error_coin',
    'Clipped Planchet': 'error_coin',
    'Wrong Planchet': 'error_coin',
    'Broad Strike': 'error_coin',
    'Missing Edge Lettering': 'error_coin',
    'Rotated Die': 'error_coin',
    'Cud Error': 'error_coin',
    'Die Break': 'error_coin',
    'Die Crack': 'error_coin',
    'Filled Die': 'error_coin',
    'Struck Through': 'error_coin',
    'Mint Error': 'error_coin',
    'Planchet Error': 'error_coin',
    'Die Error': 'error_coin',
    
    // General categories
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

  // Enhanced detection for error coins
  const lowerCategory = uiCategory.toLowerCase();
  if (lowerCategory.includes('double') || 
      lowerCategory.includes('die') ||
      lowerCategory.includes('error') ||
      lowerCategory.includes('strike') ||
      lowerCategory.includes('planchet') ||
      lowerCategory.includes('clip') ||
      lowerCategory.includes('broad') ||
      lowerCategory.includes('cud') ||
      lowerCategory.includes('crack')) {
    return 'error_coin';
  }

  return categoryMap[uiCategory] || 'modern'; // Default to modern instead of unclassified
};

export const getValidDatabaseCategories = (): CoinCategory[] => {
  return ['ancient', 'modern', 'error_coin', 'european', 'american', 'asian', 'gold', 'silver', 'british', 'commemorative', 'greek', 'unclassified'];
};
