
import { useMemo } from 'react';
import { Coin } from '@/types/coin';

export const useCategoryLogic = (allCoins: Coin[], category: string) => {
  // Filter coins by category with enhanced country-based filtering
  const categoryCoins = useMemo(() => {
    if (!allCoins || allCoins.length === 0) return [];

    console.log(`Filtering ${allCoins.length} coins for category: ${category}`);

    return allCoins.filter(coin => {
      // Ensure coin has required properties before filtering
      if (!coin.id || !coin.name || typeof coin.price !== 'number') return false;

      switch (category) {
        case 'us':
          // Only show coins from United States
          return coin.country === 'United States' || coin.country === 'USA';
        case 'ancient':
          return coin.year < 1000;
        case 'modern':
          return coin.year >= 1900;
        case 'error':
          return coin.description?.toLowerCase().includes('error') ||
                 coin.description?.toLowerCase().includes('λάθος') ||
                 coin.name.toLowerCase().includes('error');
        case 'graded':
          return coin.pcgs_grade || coin.ngc_grade;
        case 'trending':
          return (coin.views || 0) > 50;
        case 'european':
          return ['Germany', 'France', 'Italy', 'Spain', 'United Kingdom'].includes(coin.country || '');
        case 'american':
          return ['United States', 'Canada', 'Mexico'].includes(coin.country || '');
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
        default:
          return true;
      }
    });
  }, [allCoins, category]);

  return { categoryCoins };
};
