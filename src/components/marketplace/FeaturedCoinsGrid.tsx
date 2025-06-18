
import React from 'react';
import { useCachedMarketplaceData } from '@/hooks/useCachedMarketplaceData';
import OptimizedCoinCard from '@/components/OptimizedCoinCard';
import { Loader2, AlertCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const FeaturedCoinsGrid = () => {
  const { coins, isLoading, error } = useCachedMarketplaceData();

  const displayCoins = React.useMemo(() => {
    if (!coins || coins.length === 0) return [];
    
    return coins
      .filter(coin => 
        coin.authentication_status === 'verified' || 
        coin.category === 'error_coin' // ALWAYS show error coins
      )
      .sort((a, b) => {
        // ERROR COINS ALWAYS FIRST
        if (a.category === 'error_coin' && b.category !== 'error_coin') return -1;
        if (a.category !== 'error_coin' && b.category === 'error_coin') return 1;
        
        // Then featured
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
        // Then by views
        return (b.views || 0) - (a.views || 0);
      })
      .slice(0, 24); // Show more coins including error coins
  }, [coins]);

  const errorCoinsCount = displayCoins.filter(coin => coin.category === 'error_coin').length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-primary">Loading ERROR COINS and featured coins...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Unable to load coins. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!displayCoins.length) {
    return (
      <div className="text-center py-16 bg-muted/20 rounded-lg">
        <h3 className="text-xl font-semibold text-foreground mb-2">No coins available for sale</h3>
        <p className="text-muted-foreground">Check back later for new listings including ERROR COINS!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ERROR COINS Counter */}
      {errorCoinsCount > 0 && (
        <div className="flex justify-center">
          <Badge className="bg-red-500 text-white px-4 py-2 text-lg font-bold">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {errorCoinsCount} ERROR COIN{errorCoinsCount > 1 ? 'S' : ''} AVAILABLE
          </Badge>
        </div>
      )}

      {/* Coins Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {displayCoins.map((coin, index) => (
          <div key={coin.id} className="w-full">
            <OptimizedCoinCard 
              coin={coin} 
              index={index} 
              priority={index < 6 || coin.category === 'error_coin'} 
            />
          </div>
        ))}
      </div>

      {/* Footer message */}
      <div className="text-center text-sm text-gray-600 mt-8">
        <p>
          Showing {displayCoins.length} coins including <span className="font-bold text-red-600">{errorCoinsCount} ERROR COINS</span>
        </p>
      </div>
    </div>
  );
};

export default FeaturedCoinsGrid;
