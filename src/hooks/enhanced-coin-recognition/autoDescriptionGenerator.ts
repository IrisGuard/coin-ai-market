
export const generateStructuredDescription = (analysisData: any, webResults: any[] = []): string => {
  const {
    name,
    year,
    country,
    composition,
    mint,
    weight,
    diameter,
    grade,
    errors = [],
    estimated_value,
    denomination,
    rarity
  } = analysisData;

  let description = `${year || ''} ${name || 'Coin'}`.trim();
  
  const details = [];
  
  if (country) details.push(`• Country: ${country}`);
  if (composition && composition !== 'Unknown') details.push(`• Metal: ${composition}`);
  if (mint && mint !== 'Unknown') details.push(`• Mint: ${mint}`);
  if (weight) details.push(`• Weight: ${weight}g`);
  if (diameter) details.push(`• Diameter: ${diameter}mm`);
  if (grade && grade !== 'Unknown') details.push(`• Grade: ${grade}`);
  if (denomination && denomination !== 'Unknown') details.push(`• Denomination: ${denomination}`);
  if (rarity && rarity !== 'Unknown') details.push(`• Rarity: ${rarity}`);
  
  // Add errors if detected
  if (errors.length > 0) {
    details.push(`• Errors: ${errors.join(', ')}`);
  }
  
  // Add market data from web discovery
  if (webResults.length > 0) {
    const marketData = webResults.find(r => r.price_data?.current_price);
    if (marketData) {
      details.push(`• Market Value: $${marketData.price_data.current_price}`);
    }
  }
  
  // Add estimated value
  if (estimated_value && estimated_value > 0) {
    const valueRange = {
      low: Math.round(estimated_value * 0.8),
      high: Math.round(estimated_value * 1.2)
    };
    details.push(`• Estimated Value: $${valueRange.low} - $${valueRange.high}`);
  }
  
  // Additional insights from web discovery
  const insights = [];
  if (webResults.some(r => r.source_type === 'pcgs' || r.source_type === 'ngc')) {
    insights.push('Professional grading services referenced');
  }
  if (webResults.some(r => r.extracted_data?.population_higher !== undefined)) {
    insights.push('Population data available');
  }
  if (webResults.some(r => r.price_data?.realized_price)) {
    insights.push('Recent auction data included');
  }
  
  let finalDescription = description;
  if (details.length > 0) {
    finalDescription += '\n' + details.join('\n');
  }
  if (insights.length > 0) {
    finalDescription += '\n\nAnalysis based on: ' + insights.join(', ');
  }
  
  return finalDescription;
};

export const extractCategoriesFromAnalysis = (analysisData: any, webResults: any[] = []): string[] => {
  const categories = [];
  const { country, year, denomination, errors = [], composition } = analysisData;
  
  // Country-based categories
  if (country) {
    if (country.toLowerCase().includes('united states') || country.toLowerCase() === 'usa') {
      categories.push('USA COINS');
      
      // Specific US subcategories
      if (denomination?.toLowerCase().includes('cent') || denomination?.toLowerCase().includes('penny')) {
        categories.push('USA CENTS');
      }
      if (denomination?.toLowerCase().includes('quarter')) {
        categories.push('USA QUARTERS');
      }
      if (denomination?.toLowerCase().includes('dime')) {
        categories.push('USA DIMES');
      }
      if (denomination?.toLowerCase().includes('dollar')) {
        categories.push('USA DOLLARS');
      }
    } else if (country.toLowerCase().includes('canada')) {
      categories.push('CANADIAN COINS');
    } else if (country.toLowerCase().includes('britain') || country.toLowerCase().includes('england') || country.toLowerCase().includes('uk')) {
      categories.push('BRITISH COINS');
    } else if (country.toLowerCase().includes('china')) {
      categories.push('CHINESE COINS');
    } else if (country.toLowerCase().includes('russia')) {
      categories.push('RUSSIA COINS');
    } else {
      categories.push('WORLD COINS');
    }
  }
  
  // Composition-based categories
  if (composition) {
    if (composition.toLowerCase().includes('silver')) {
      categories.push('SILVER COINS');
    }
    if (composition.toLowerCase().includes('gold')) {
      categories.push('GOLD COINS');
    }
  }
  
  // Error categories
  if (errors.length > 0) {
    categories.push('ERROR COINS');
  }
  
  // Time period categories
  if (year) {
    const yearNum = parseInt(year);
    if (yearNum < 500) {
      categories.push('ANCIENT COINS');
    } else if (yearNum >= 1850 && yearNum <= 1950) {
      categories.push('VINTAGE COINS');
    }
  }
  
  // Commemorative detection from web results
  const isCommemorative = webResults.some(r => 
    r.extracted_data?.title?.toLowerCase().includes('commemorative') ||
    r.extracted_data?.description?.toLowerCase().includes('commemorative')
  );
  if (isCommemorative) {
    categories.push('COMMEMORATIVE COINS');
  }
  
  return [...new Set(categories)]; // Remove duplicates
};

export const generateAutoFillData = (enhancedResult: any) => {
  const { claude_analysis, web_discovery_results, merged_data } = enhancedResult;
  
  const autoFillData = {
    // Basic info
    title: merged_data.name || claude_analysis.name || '',
    year: merged_data.year?.toString() || claude_analysis.year?.toString() || '',
    country: merged_data.country || claude_analysis.country || '',
    denomination: merged_data.denomination || claude_analysis.denomination || '',
    
    // Technical specs
    composition: merged_data.composition || claude_analysis.composition || '',
    diameter: merged_data.diameter?.toString() || claude_analysis.diameter?.toString() || '',
    weight: merged_data.weight?.toString() || claude_analysis.weight?.toString() || '',
    mint: merged_data.mint || claude_analysis.mint || '',
    
    // Condition and grading
    grade: merged_data.grade || claude_analysis.grade || '',
    condition: merged_data.grade || claude_analysis.grade || '',
    rarity: merged_data.rarity || claude_analysis.rarity || 'Common',
    
    // Pricing
    price: merged_data.market_value?.toString() || merged_data.estimated_value?.toString() || claude_analysis.estimatedValue?.toString() || '',
    startingBid: (merged_data.market_value * 0.7)?.toString() || (merged_data.estimated_value * 0.7)?.toString() || '',
    
    // Auto-generated description
    description: generateStructuredDescription(merged_data, web_discovery_results),
    
    // Categories
    category: extractCategoriesFromAnalysis(merged_data, web_discovery_results)[0] || 'USA COINS',
    categories: extractCategoriesFromAnalysis(merged_data, web_discovery_results),
    
    // Error detection
    errors: merged_data.errors || claude_analysis.errors || [],
    
    // Additional fields
    featured: merged_data.confidence > 0.8, // Feature high-confidence items
    tags: [
      merged_data.name?.split(' ')[0],
      merged_data.year?.toString(),
      merged_data.grade,
      ...(merged_data.errors || [])
    ].filter(Boolean).join(', ')
  };
  
  return autoFillData;
};
