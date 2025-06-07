
import React from 'react';
import { useCoins } from '@/hooks/useCoins';
import EnhancedCoinCard from '@/components/EnhancedCoinCard';
import { TrendingUp } from 'lucide-react';

const TrendingCoins = () => {
  const { data: coins } = useCoins();

  // Get trending coins (highest views, recent activity)
  const trendingCoins = React.useMemo(() => {
    if (!coins) return [];
    
    return coins
      .filter(coin => coin.authentication_status === 'verified')
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 6); // Fewer coins for trending section
  }, [coins]);

  if (!trendingCoins.length) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-orange-600" />
        <h2 className="text-xl font-medium text-gray-900">
          Trending right now
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {trendingCoins.map((coin, index) => (
          <div key={coin.id} className="w-full">
            <EnhancedCoinCard coin={coin} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingCoins;
