
// Category mapping utility to convert UI categories to database enum values
export const mapUIToDatabaseCategory = (uiCategory: string): string => {
  const categoryMap: Record<string, string> = {
    // UI Categories -> Database enum values
    'USA COINS': 'american',
    'EUROPEAN COINS': 'european', 
    'ANCIENT COINS': 'ancient',
    'ERROR COINS': 'error',
    'SILVER COINS': 'silver',
    'GOLD COINS': 'gold',
    'COMMEMORATIVE COINS': 'modern',
    'WORLD COINS': 'modern',
    'RUSSIA COINS': 'european',
    'CHINESE COINS': 'asian',
    'BRITISH COINS': 'european',
    'CANADIAN COINS': 'american',
    'Double Die': 'error',
    'Off-Center': 'error',
    'Ancient': 'ancient',
    'Modern': 'modern',
    'Error': 'error',
    'Graded': 'graded',
    'European': 'european',
    'American': 'american',
    'Asian': 'asian',
    'Gold': 'gold',
    'Silver': 'silver',
    'Rare': 'rare'
  };

  return categoryMap[uiCategory] || 'modern'; // Default fallback
};

export const getValidDatabaseCategories = (): string[] => {
  return ['ancient', 'modern', 'error', 'graded', 'european', 'american', 'asian', 'gold', 'silver', 'rare'];
};
