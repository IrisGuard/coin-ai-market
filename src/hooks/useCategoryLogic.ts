
import { useMemo } from 'react';
import { Coin } from '@/types/coin';

export const useCategoryLogic = (allCoins: Coin[], category: string) => {
  // Filter coins by category with enhanced logic
  const categoryCoins = useMemo(() => {
    if (!allCoins || allCoins.length === 0) return [];

    console.log(`Filtering ${allCoins.length} coins for category: ${category}`);

    return allCoins.filter(coin => {
      // Ensure coin has required properties before filtering
      if (!coin.id || !coin.name || typeof coin.price !== 'number') return false;

      switch (category) {
        case 'us':
        case 'american':
          // US/American coins - properly categorized
          return coin.country === 'United States' || coin.country === 'USA';
        
        case 'european':
          // European coins including Greece (FIXED!)
          return ['Germany', 'France', 'Italy', 'Spain', 'United Kingdom', 'Greece'].includes(coin.country || '');
        
        case 'ancient':
          return coin.year < 1000;
        
        case 'modern':
          return coin.year >= 1900;
        
        case 'error':
        case 'error_coin':
          return coin.description?.toLowerCase().includes('error') ||
                 coin.description?.toLowerCase().includes('λάθος') ||
                 coin.name.toLowerCase().includes('error') ||
                 coin.name.toLowerCase().includes('doubled') ||
                 coin.name.toLowerCase().includes('double') ||
                 coin.category === 'error_coin';
        
        case 'graded':
          return coin.pcgs_grade || coin.ngc_grade;
        
        case 'trending':
          return (coin.views || 0) > 50;
        
        case 'asian':
          return ['China', 'Japan', 'India', 'Korea', 'Thailand'].includes(coin.country || '');
        
        case 'gold':
          return coin.composition?.toLowerCase().includes('gold') ||
                 coin.composition?.toLowerCase().includes('χρυσό');
        
        case 'silver':
          return coin.composition?.toLowerCase().includes('silver') ||
                 coin.composition?.toLowerCase().includes('ασήμι');
        
        case 'rare':
          return coin.rarity === 'Rare' || coin.rarity === 'Ultra Rare';
        
        case 'commemorative':
          return coin.category === 'commemorative' ||
                 coin.name.toLowerCase().includes('commemorative') ||
                 coin.description?.toLowerCase().includes('commemorative');
        
        default:
          return true;
      }
    });
  }, [allCoins, category]);

  return { categoryCoins };
};
