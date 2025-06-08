
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useCachedMarketplaceData } from '@/hooks/useCachedMarketplaceData';
import OptimizedCoinCard from '@/components/OptimizedCoinCard';
import { Loader2 } from 'lucide-react';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const { coins, isLoading } = useCachedMarketplaceData();

  // Enhanced filtering for all categories
  const filteredCoins = React.useMemo(() => {
    if (!coins || !category) return [];
    
    return coins.filter(coin => {
      switch (category) {
        case 'ancient':
          return coin.year < 1000;
        case 'modern':
          return coin.year >= 1900;
        case 'error':
          return coin.category === 'error_coin' || coin.rarity === 'extremely_rare' || 
                 coin.description?.toLowerCase().includes('error') ||
                 coin.description?.toLowerCase().includes('doubled') ||
                 coin.name?.toLowerCase().includes('error') ||
                 coin.name?.toLowerCase().includes('doubled');
        case 'graded':
          return coin.pcgs_grade || coin.ngc_grade;
        case 'trending':
          return coin.views && coin.views > 50 || coin.featured;
        case 'european':
          return ['Germany', 'France', 'Italy', 'Spain', 'Greece', 'United Kingdom', 
                  'Netherlands', 'Austria', 'Switzerland', 'Belgium', 'Portugal',
                  'Roman Empire', 'Ancient Greece'].includes(coin.country || '');
        case 'american':
          return ['United States', 'Canada', 'Mexico'].includes(coin.country || '');
        case 'asian':
          return ['China', 'Japan', 'India', 'Korea', 'Thailand', 'Singapore', 
                  'Vietnam', 'Philippines', 'Malaysia', 'Indonesia'].includes(coin.country || '');
        case 'gold':
          return coin.composition?.toLowerCase().includes('gold') ||
                 coin.name?.toLowerCase().includes('gold') ||
                 coin.description?.toLowerCase().includes('gold');
        case 'silver':
          return coin.composition?.toLowerCase().includes('silver') ||
                 coin.name?.toLowerCase().includes('silver') ||
                 coin.description?.toLowerCase().includes('silver');
        case 'rare':
          return coin.rarity === 'extremely_rare' || coin.rarity === 'rare' || coin.price > 1000;
        case 'auctions':
          return coin.is_auction;
        default:
          return true;
      }
    });
  }, [coins, category]);

  const getCategoryTitle = (cat: string) => {
    const titles: { [key: string]: string } = {
      'ancient': 'Ancient Coins',
      'modern': 'Modern Coins', 
      'error': 'Error Coins',
      'graded': 'Graded Coins',
      'trending': 'Trending Coins',
      'european': 'European Coins',
      'american': 'American Coins',
      'asian': 'Asian Coins',
      'gold': 'Gold Coins',
      'silver': 'Silver Coins',
      'rare': 'Rare Coins',
      'auctions': 'Live Auctions'
    };
    return titles[cat] || 'Category';
  };

  const getCategoryDescription = (cat: string) => {
    const descriptions: { [key: string]: string } = {
      'ancient': 'Discover coins from ancient civilizations and historical empires.',
      'modern': 'Explore coins from the modern era (1900 onwards).',
      'error': 'Find rare error coins and minting mistakes that are highly valuable.',
      'graded': 'Browse professionally graded coins by PCGS, NGC and other services.',
      'trending': 'Popular coins that are currently trending with collectors.',
      'european': 'European coins from various countries and time periods.',
      'american': 'Coins from the United States, Canada, and Mexico.',
      'asian': 'Asian coins from China, Japan, India, Korea and other countries.',
      'gold': 'Precious metal coins containing gold.',
      'silver': 'Silver coins and precious metal collectibles.',
      'rare': 'Exceptionally rare and valuable coins for serious collectors.',
      'auctions': 'Live auction coins with bidding ending soon.'
    };
    return descriptions[cat] || 'Browse this category of coins.';
  };

  const categoryTitle = getCategoryTitle(category || '');
  const categoryDescription = getCategoryDescription(category || '');

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent mb-4">
              {categoryTitle}
            </h1>
            <p className="text-gray-600 mb-2">
              {categoryDescription}
            </p>
            <p className="text-sm text-gray-500">
              {isLoading ? 'Loading...' : `${filteredCoins.length} coins found`}
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
              <div className="bg-gray-50 rounded-lg p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No coins found in this category</h3>
                <p className="text-gray-500 text-sm mb-4">
                  This category is available but doesn't have any coins yet.
                </p>
                <p className="text-gray-400 text-xs">
                  Tip: Try the Admin Panel to add sample data for all categories.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
