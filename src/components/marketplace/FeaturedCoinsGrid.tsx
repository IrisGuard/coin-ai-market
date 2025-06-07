
import React from 'react';
import { motion } from 'framer-motion';
import { useCoins } from '@/hooks/useCoins';
import EnhancedCoinCard from '@/components/EnhancedCoinCard';
import { Loader2 } from 'lucide-react';

const FeaturedCoinsGrid = () => {
  const { data: coins, isLoading } = useCoins();

  // Filter and sort coins: featured first, then by views, limit to 12
  const featuredCoins = React.useMemo(() => {
    if (!coins) return [];
    
    return coins
      .filter(coin => coin.authentication_status === 'verified')
      .sort((a, b) => {
        // Featured coins first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        // Then by views
        return (b.views || 0) - (a.views || 0);
      })
      .slice(0, 12);
  }, [coins]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!featuredCoins.length) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-2xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No coins available</h3>
        <p className="text-gray-600">Be the first to list a coin!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Featured Coins
        </h2>
        <p className="text-gray-600">
          {featuredCoins.length} coins available
        </p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {featuredCoins.map((coin, index) => (
          <EnhancedCoinCard key={coin.id} coin={coin} index={index} />
        ))}
      </motion.div>
    </div>
  );
};

export default FeaturedCoinsGrid;
