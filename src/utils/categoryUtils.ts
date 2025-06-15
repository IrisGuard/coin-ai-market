
export const getCategoryTitle = (cat: string): string => {
  const titles: { [key: string]: string } = {
    // Main categories
    'us': 'US Coins',
    'world': 'World Coins',
    'ancient': 'Ancient Coins',
    'modern': 'Modern Coins',
    'gold': 'Gold Coins',
    'silver': 'Silver Coins',
    'platinum': 'Platinum Coins',
    'paper': 'Paper Money',
    'graded': 'Graded Coins',
    'commemorative': 'Commemorative Coins',
    'proof': 'Proof Coins',
    'uncirculated': 'Uncirculated Coins',
    'tokens': 'Tokens & Medals',
    'bullion': 'Bullion Bars',
    
    // Regional categories
    'american': 'American Coins',
    'european': 'European Coins',
    'asian': 'Asian Coins',
    'african': 'African Coins',
    'australian': 'Australian Coins',
    'south-american': 'South American Coins',
    
    // Error categories
    'error': 'Error Coins',
    'double-die': 'Double Die Errors',
    'off-center': 'Off-Center Strike',
    'clipped': 'Clipped Planchet',
    'broadstrike': 'Broadstrike Errors',
    'die-crack': 'Die Crack Errors',
    'lamination': 'Lamination Errors',
    'wrong-planchet': 'Wrong Planchet',
    'rotated-die': 'Rotated Die',
    'cud-error': 'Cud Errors',
    
    // Legacy mappings
    'error_coin': 'Error Coins',
    'greek': 'Greek Coins',
    'trending': 'Trending Coins',
    'british': 'British Coins',
    'rare': 'Rare Coins'
  };
  return titles[cat] || cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ');
};

export const getCategoryDescription = (cat: string): string => {
  const descriptions: { [key: string]: string } = {
    // Main categories
    'us': 'United States coins from colonial times to present, including cents, nickels, dimes, quarters, half dollars, and dollars.',
    'world': 'International coins from countries around the globe, spanning different eras and denominations.',
    'ancient': 'Discover magnificent coins from ancient civilizations, empires and historic periods. Each piece tells a story from bygone eras.',
    'modern': 'Contemporary coins from 1900 onwards, featuring updated designs, advanced minting techniques and modern themes.',
    'gold': 'Precious metal coins containing gold in various purities, combining numismatic value with precious metal content.',
    'silver': 'Silver coins and precious metal collectibles with inherent value and numismatic appeal from various mints worldwide.',
    'platinum': 'Rare platinum coins and collectibles, representing the pinnacle of precious metal numismatics.',
    'paper': 'Currency notes, bills, and paper money from various countries and time periods.',
    'graded': 'Professionally graded coins certified by PCGS, NGC, and other reputable grading services.',
    'commemorative': 'Special commemorative coins issued to celebrate events, anniversaries, or honor important figures and achievements.',
    'proof': 'Special proof coins with mirror-like finishes, struck with extra care for collectors.',
    'uncirculated': 'Mint state coins that have never been in circulation, maintaining their original luster.',
    'tokens': 'Non-currency items including tokens, medals, and commemorative pieces.',
    'bullion': 'Precious metal bars and rounds valued primarily for their metal content.',
    
    // Regional categories
    'american': 'Coins from the United States, Canada and Mexico, representing the diverse numismatic traditions of North America.',
    'european': 'European coins from various countries and time periods, showcasing the rich numismatic heritage of the continent.',
    'asian': 'Asian coins from China, Japan, India, Korea and other countries, featuring unique designs and cultural significance.',
    'african': 'Coins from African nations, representing the diverse monetary history of the continent.',
    'australian': 'Coins from Australia, New Zealand and Oceania, including unique designs and wildlife themes.',
    'south-american': 'Coins from South American countries, featuring diverse cultural and historical themes.',
    
    // Error categories
    'error': 'Rare error coins and minting mistakes that are highly valued by collectors. These unique pieces represent fascinating production anomalies.',
    'double-die': 'Coins with doubled images caused by die misalignment during the hubbing process.',
    'off-center': 'Coins struck off-center due to improper planchet feeding, creating distinctive partial designs.',
    'clipped': 'Coins with missing portions due to improperly cut planchets.',
    'broadstrike': 'Coins struck without a collar, resulting in expanded diameter and thin edges.',
    'die-crack': 'Coins showing raised lines from cracked dies during the striking process.',
    'lamination': 'Coins with metal separation or peeling due to impurities in the planchet.',
    'wrong-planchet': 'Coins struck on planchets intended for different denominations or countries.',
    'rotated-die': 'Coins with misaligned obverse and reverse due to rotated dies.',
    'cud-error': 'Coins with blob-like raised areas from major die breaks.',
    
    // Legacy mappings
    'error_coin': 'Find rare error coins and minting mistakes that are highly valued by collectors.',
    'greek': 'Greek coins from various periods, showcasing the rich numismatic heritage of Greece.',
    'trending': 'Popular coins currently trending with collectors worldwide. Stay ahead of market movements.',
    'british': 'British coins from the United Kingdom, featuring royal portraits and historic designs.',
    'rare': 'Extremely rare and valuable coins for serious collectors, with low mintages and historical significance.'
  };
  return descriptions[cat] || `Browse this specialized category of ${cat.replace('-', ' ')} coins.`;
};
