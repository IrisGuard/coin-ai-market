
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useCachedMarketplaceData } from '@/hooks/useCachedMarketplaceData';
import OptimizedCoinCard from '@/components/OptimizedCoinCard';
import { Loader2 } from 'lucide-react';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const { coins, isLoading } = useCachedMarketplaceData();

  // Filter coins based on category
  const filteredCoins = React.useMemo(() => {
    if (!coins || !category) return [];
    
    return coins.filter(coin => {
      switch (category) {
        case 'ancient':
          return coin.year < 1000;
        case 'modern':
          return coin.year >= 1900;
        case 'error':
          return coin.rarity === 'Ultra Rare' || coin.description?.toLowerCase().includes('error');
        case 'graded':
          return coin.pcgs_grade || coin.ngc_grade;
        case 'trending':
          return coin.views && coin.views > 100;
        case 'european':
          return ['Germany', 'France', 'Italy', 'Spain', 'Greece', 'United Kingdom'].includes(coin.country || '');
        case 'american':
          return coin.country === 'United States';
        case 'asian':
          return ['China', 'Japan', 'India', 'Korea'].includes(coin.country || '');
        case 'gold':
          return coin.composition?.toLowerCase().includes('gold');
        case 'silver':
          return coin.composition?.toLowerCase().includes('silver');
        case 'rare':
          return coin.rarity === 'Ultra Rare' || coin.rarity === 'Rare';
        default:
          return true;
      }
    });
  }, [coins, category]);

  const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) + ' Coins' : 'Category';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent mb-4">
              {categoryTitle}
            </h1>
            <p className="text-gray-600">
              Discover {filteredCoins.length} coins in this category
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-electric-orange" />
                <span className="text-electric-blue">Loading coins...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredCoins.map((coin, index) => (
                <div key={coin.id} className="w-full">
                  <OptimizedCoinCard coin={coin} index={index} priority={index < 12} />
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredCoins.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No coins found in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
