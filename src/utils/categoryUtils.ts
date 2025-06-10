
export const getCategoryTitle = (cat: string): string => {
  const titles: { [key: string]: string } = {
    'ancient': 'Ancient Coins',
    'modern': 'Modern Coins', 
    'error_coin': 'Error Coins',
    'greek': 'Greek Coins',
    'trending': 'Trending Coins',
    'european': 'European Coins',
    'american': 'American Coins',
    'british': 'British Coins',
    'asian': 'Asian Coins',
    'gold': 'Gold Coins',
    'silver': 'Silver Coins',
    'commemorative': 'Commemorative Coins',
    'rare': 'Rare Coins'
  };
  return titles[cat] || 'Category';
};

export const getCategoryDescription = (cat: string): string => {
  const descriptions: { [key: string]: string } = {
    'ancient': 'Discover magnificent coins from ancient civilizations, empires and historic periods. Each piece tells a story from bygone eras and ancient craftsmanship.',
    'modern': 'Explore modern coins from the contemporary era (1900 onwards), featuring updated designs, advanced minting techniques and modern themes.',
    'error_coin': 'Find rare error coins and minting mistakes that are highly valued by collectors. These unique pieces represent fascinating production anomalies.',
    'greek': 'Greek coins from various periods, showcasing the rich numismatic heritage of Greece and its historical significance.',
    'trending': 'Popular coins currently trending with collectors worldwide. Stay ahead of market movements and collector preferences.',
    'european': 'European coins from various countries and time periods, showcasing the rich numismatic heritage of the European continent.',
    'american': 'Coins from the United States, Canada and Mexico, representing the diverse numismatic traditions of North America.',
    'british': 'British coins from the United Kingdom, featuring royal portraits, historic designs and colonial period pieces.',
    'asian': 'Asian coins from China, Japan, India, Korea and other countries, featuring unique designs and cultural significance.',
    'gold': 'Precious metal coins containing gold in various purities. These pieces combine numismatic value with precious metal content.',
    'silver': 'Silver coins and precious metal collectibles with inherent value and numismatic appeal from various mints worldwide.',
    'commemorative': 'Special commemorative coins issued to celebrate events, anniversaries, or honor important figures and achievements.',
    'rare': 'Extremely rare and valuable coins for serious collectors, with low mintages, historical significance or unique characteristics.'
  };
  return descriptions[cat] || 'Browse this specialized category of coins.';
};
