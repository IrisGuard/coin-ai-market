
import React from 'react';
import { useCoins } from '@/hooks/useCoins';
import EnhancedCoinCard from '@/components/EnhancedCoinCard';
import { Loader2 } from 'lucide-react';

const FeaturedCoinsGrid = () => {
  const { data: coins, isLoading } = useCoins();

  // Get all verified coins, featured first
  const displayCoins = React.useMemo(() => {
    if (!coins) return [];
    
    return coins
      .filter(coin => coin.authentication_status === 'verified')
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.views || 0) - (a.views || 0);
      })
      .slice(0, 20); // Show more coins like Etsy
  }, [coins]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!displayCoins.length) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No coins available</h3>
        <p className="text-gray-600">Be the first to list a coin!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {displayCoins.map((coin, index) => (
        <div key={coin.id} className="w-full">
          <EnhancedCoinCard coin={coin} index={index} />
        </div>
      ))}
    </div>
  );
};

export default FeaturedCoinsGrid;
