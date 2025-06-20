
import React from 'react';
import { useCachedMarketplaceData } from '@/hooks/useCachedMarketplaceData';
import OptimizedCoinCard from '@/components/OptimizedCoinCard';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TrendingCoins = () => {
  const { coins, isLoading, error } = useCachedMarketplaceData();

  const trendingCoins = React.useMemo(() => {
    if (!coins || coins.length === 0) return [];
    
    return coins
      .filter(coin => coin.authentication_status === 'verified')
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 6);
  }, [coins]);

  if (isLoading) {
    return null;
  }

  if (error) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-electric-orange" />
          <h2 className="text-xl font-medium bg-gradient-to-r from-electric-red to-electric-orange bg-clip-text text-transparent">
            Trending right now
          </h2>
        </div>
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to load trending coins. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!trendingCoins.length) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-electric-orange" />
        <h2 className="text-xl font-medium bg-gradient-to-r from-electric-red to-electric-orange bg-clip-text text-transparent">
          Trending right now
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {trendingCoins.map((coin, index) => (
          <div key={coin.id} className="w-full">
            <OptimizedCoinCard coin={coin} index={index} priority={index < 3} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingCoins;
