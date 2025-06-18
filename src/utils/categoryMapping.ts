
// Enhanced category mapping for AI-powered error coins and all categories
type CoinCategory = 'american' | 'european' | 'ancient' | 'silver' | 'gold' | 'modern' | 'asian' | 'error_coin' | 'greek' | 'british' | 'commemorative' | 'unclassified';

export const mapUIToDatabaseCategory = (uiCategory: string): CoinCategory => {
  const categoryMap: Record<string, CoinCategory> = {
    // Enhanced UI Categories -> Database enum values
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
    'GREECE COINS': 'european',
    
    // AI-Enhanced ERROR COIN DETECTION PATTERNS
    'error_coin': 'error_coin',
    'Error Coin': 'error_coin',
    'ERROR COIN': 'error_coin',
    'Double Die': 'error_coin',
    'Doubled Die': 'error_coin',
    'Off-Center': 'error_coin',
    'Off Center': 'error_coin',
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
    
    // Country-based categories
    'american': 'american',
    'usa': 'american',
    'united states': 'american',
    'european': 'european',
    'ancient': 'ancient',
    'modern': 'modern',
    'asian': 'asian',
    'chinese': 'asian',
    'china': 'asian',
    'british': 'british',
    'england': 'british',
    'uk': 'british',
    'gold': 'gold',
    'silver': 'silver',
    'commemorative': 'commemorative'
  };

  // ENHANCED AI-POWERED ERROR COIN DETECTION
  const lowerCategory = uiCategory.toLowerCase();
  
  // Comprehensive error detection patterns
  const errorPatterns = [
    'double', 'die', 'error', 'strike', 'planchet', 'clip', 'broad',
    'cud', 'crack', 'break', 'mint error', 'doubled', 'off center',
    'off-center', 'rotated', 'filled', 'struck through', 'wrong'
  ];
  
  const hasErrorPattern = errorPatterns.some(pattern => 
    lowerCategory.includes(pattern)
  );
  
  if (hasErrorPattern) {
    console.log('🚨 AI-ENHANCED ERROR COIN DETECTED in category mapping:', uiCategory);
    return 'error_coin';
  }

  // Standard mapping with fallback
  const result = categoryMap[uiCategory] || categoryMap[lowerCategory] || 'modern';
  console.log('📋 AI-Enhanced Category mapping:', uiCategory, '->', result);
  return result;
};

export const getValidDatabaseCategories = (): CoinCategory[] => {
  return ['ancient', 'modern', 'error_coin', 'european', 'american', 'asian', 'gold', 'silver', 'british', 'commemorative', 'greek', 'unclassified'];
};

// Enhanced category detection for AI analysis
export const detectCategoryFromAIData = (aiData: any): CoinCategory => {
  if (!aiData) return 'modern';
  
  const name = (aiData.name || '').toLowerCase();
  const description = (aiData.description || '').toLowerCase();
  const country = (aiData.country || '').toLowerCase();
  const composition = (aiData.composition || '').toLowerCase();
  const errors = aiData.errors || [];
  
  // Priority 1: Error coins (highest priority)
  if (errors.length > 0 || 
      name.includes('error') || 
      name.includes('double') || 
      name.includes('die') ||
      description.includes('error')) {
    console.log('🚨 AI DETECTED ERROR COIN with high confidence');
    return 'error_coin';
  }
  
  // Priority 2: Composition-based (gold/silver)
  if (composition.includes('gold') || name.includes('gold')) return 'gold';
  if (composition.includes('silver') || name.includes('silver')) return 'silver';
  
  // Priority 3: Country-based
  if (country.includes('usa') || country.includes('united states') || 
      country.includes('america') || country.includes('american')) return 'american';
  if (country.includes('china') || country.includes('chinese')) return 'asian';
  if (country.includes('britain') || country.includes('england') || 
      country.includes('uk') || country.includes('british')) return 'british';
  if (country.includes('europe') || country.includes('germany') || 
      country.includes('france') || country.includes('european')) return 'european';
  
  // Priority 4: Time-based
  const year = aiData.year || 0;
  if (year > 0 && year < 1500) return 'ancient';
  
  // Default: modern
  return 'modern';
};

// Multi-category support for error coins
export const getMultiCategories = (primaryCategory: CoinCategory, aiData?: any): CoinCategory[] => {
  const categories = [primaryCategory];
  
  // Error coins can also be displayed in their country category
  if (primaryCategory === 'error_coin' && aiData?.country) {
    const countryCategory = detectCategoryFromAIData({ country: aiData.country });
    if (countryCategory !== 'error_coin' && countryCategory !== 'modern') {
      categories.push(countryCategory);
    }
  }
  
  return categories;
};
