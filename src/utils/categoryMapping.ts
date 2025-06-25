
export const mapUIToDatabaseCategory = (uiCategory: string): string => {
  const mapping: Record<string, string> = {
    // Core categories
    'modern': 'modern',
    'classic': 'classic',
    'ancient': 'ancient',
    'commemorative': 'commemorative',
    'world': 'world',
    'us': 'us',
    'error_coin': 'error_coin', // Critical category
    
    // Enhanced error coin detection
    'error': 'error_coin',
    'errors': 'error_coin',
    'double_die': 'error_coin',
    'doubled_die': 'error_coin',
    'off_center': 'error_coin',
    'planchet_error': 'error_coin',
    'strike_error': 'error_coin',
    'die_crack': 'error_coin',
    'filled_die': 'error_coin',
    'broad_strike': 'error_coin',
    'wrong_planchet': 'error_coin',
    'clip_error': 'error_coin',
    'cuds': 'error_coin',
    
    // Fallback mappings
    'foreign': 'world',
    'international': 'world',
    'vintage': 'classic',
    'old': 'classic',
    'collector': 'commemorative',
    'special': 'commemorative',
    'medal': 'commemorative',
    'token': 'commemorative'
  };

  const mapped = mapping[uiCategory.toLowerCase()] || 'modern';
  
  // Enhanced error coin detection based on category name
  if (uiCategory.toLowerCase().includes('error') || 
      uiCategory.toLowerCase().includes('double') ||
      uiCategory.toLowerCase().includes('die') ||
      uiCategory.toLowerCase().includes('strike') ||
      uiCategory.toLowerCase().includes('planchet')) {
    return 'error_coin';
  }
  
  return mapped;
};

// Added missing export
export const getValidDatabaseCategories = (): string[] => {
  return [
    'modern',
    'ancient',
    'commemorative',
    'error_coin',
    'greek',
    'american',
    'british',
    'asian',
    'european',
    'silver',
    'gold',
    'unclassified'
  ];
};

// Enhanced error detection patterns for AI analysis
export const detectErrorCoinPatterns = (coinName: string, description: string = ''): boolean => {
  const combinedText = `${coinName} ${description}`.toLowerCase();
  
  const errorPatterns = [
    // Die errors
    'doubled die', 'double die', 'ddo', 'ddr', 'die doubling',
    'filled die', 'cracked die', 'broken die', 'die break',
    'die clash', 'die crack', 'die chip', 'die gouge',
    
    // Strike errors
    'off center', 'off-center', 'broadstrike', 'broad strike',
    'weak strike', 'double strike', 'multiple strike',
    'rotated die', 'medal turn', 'medal alignment',
    
    // Planchet errors
    'wrong planchet', 'planchet error', 'clipped planchet',
    'incomplete planchet', 'split planchet', 'lamination',
    'wrong metal', 'wrong size', 'wrong thickness',
    
    // Miscellaneous errors
    'cud', 'cuds', 'rim cud', 'retained cud',
    'mule', 'wrong design', 'overstrike',
    'brockage', 'cap die', 'uniface',
    'blank', 'unstruck', 'partial collar'
  ];
  
  const hasErrorPattern = errorPatterns.some(pattern => 
    combinedText.includes(pattern)
  );
  
  if (hasErrorPattern) {
    }
  
  return hasErrorPattern;
};

// Auto-rarity assignment for error coins
export const assignErrorCoinRarity = (errorType: string): string => {
  const errorType_lower = errorType.toLowerCase();
  
  // Ultra rare errors
  if (errorType_lower.includes('mule') || 
      errorType_lower.includes('wrong planchet') ||
      errorType_lower.includes('major') ||
      errorType_lower.includes('dramatic')) {
    return 'Ultra Rare';
  }
  
  // Very rare errors
  if (errorType_lower.includes('doubled die') ||
      errorType_lower.includes('broad strike') ||
      errorType_lower.includes('major die') ||
      errorType_lower.includes('significant')) {
    return 'Very Rare';
  }
  
  // Rare errors
  if (errorType_lower.includes('off center') ||
      errorType_lower.includes('die crack') ||
      errorType_lower.includes('clip') ||
      errorType_lower.includes('minor')) {
    return 'Rare';
  }
  
  // Default for any error
  return 'Scarce';
};
