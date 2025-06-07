
import React from 'react';
import { useCoins } from '@/hooks/useCoins';
import EnhancedCoinCard from '@/components/EnhancedCoinCard';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TrendingCoins = () => {
  const { data: coins, isLoading, error } = useCoins();

  // Don't render anything while loading
  if (isLoading) {
    return null;
  }

  // Show error state
  if (error) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-brand-primary" />
          <h2 className="text-xl font-medium text-text-primary">
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

  // Get trending coins (highest views, recent activity)
  const trendingCoins = React.useMemo(() => {
    if (!coins || coins.length === 0) return [];
    
    return coins
      .filter(coin => coin.authentication_status === 'verified')
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 6); // Fewer coins for trending section
  }, [coins]);

  // Don't render if no trending coins
  if (!trendingCoins.length) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-brand-primary" />
        <h2 className="text-xl font-medium text-text-primary">
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
