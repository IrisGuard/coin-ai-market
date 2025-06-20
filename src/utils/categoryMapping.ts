
export const mapUIToDatabaseCategory = (uiCategory: string): string => {
  const mapping: { [key: string]: string } = {
    'morgan_dollar': 'american',
    'walking_liberty': 'american', 
    'mercury_dime': 'american',
    'indian_head': 'american',
    'barber_quarter': 'american',
    'error_coin': 'error_coin',
    'silver_coin': 'silver',
    'gold_coin': 'gold',
    'ancient_coin': 'ancient',
    'modern_coin': 'modern',
    'commemorative_coin': 'commemorative',
    'world_coin': 'unclassified',
    'WORLD COINS': 'unclassified'
  };

  return mapping[uiCategory] || 'unclassified';
};

export const mapDatabaseToUICategory = (dbCategory: string): string => {
  const mapping: { [key: string]: string } = {
    'american': 'American Coins',
    'british': 'British Coins',
    'european': 'European Coins',
    'asian': 'Asian Coins',
    'greek': 'Greek Coins',
    'error_coin': 'Error Coins',
    'ancient': 'Ancient Coins',
    'modern': 'Modern Coins',
    'silver': 'Silver Coins',
    'gold': 'Gold Coins',
    'commemorative': 'Commemorative Coins',
    'unclassified': 'World Coins'
  };

  return mapping[dbCategory] || 'World Coins';
};
