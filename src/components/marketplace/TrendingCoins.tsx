
import React from 'react';
import { motion } from 'framer-motion';
import { useCoins } from '@/hooks/useCoins';
import EnhancedCoinCard from '@/components/EnhancedCoinCard';
import { TrendingUp, Eye } from 'lucide-react';

const TrendingCoins = () => {
  const { data: coins } = useCoins();

  // Get trending coins (highest views, recent activity)
  const trendingCoins = React.useMemo(() => {
    if (!coins) return [];
    
    return coins
      .filter(coin => coin.authentication_status === 'verified')
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 8);
  }, [coins]);

  if (!trendingCoins.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900">
            Trending Now
          </h2>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Eye className="w-4 h-4" />
          <span>Most viewed this week</span>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {trendingCoins.map((coin, index) => (
          <EnhancedCoinCard key={coin.id} coin={coin} index={index} />
        ))}
      </motion.div>
    </div>
  );
};

export default TrendingCoins;
