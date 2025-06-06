
import { Coin } from '@/types/coin';
import CoinCard from './CoinCard';
import { motion } from 'framer-motion';

interface CoinGridProps {
  coins: Coin[];
  loading?: boolean;
  viewMode?: 'grid' | 'list';
}

const CoinGrid = ({ coins, loading, viewMode = 'grid' }: CoinGridProps) => {
  if (loading) {
    return (
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass-card rounded-3xl animate-pulse">
            <div className="h-64 bg-gradient-to-r from-brand-primary/20 via-electric-blue/20 to-brand-accent/20 rounded-t-3xl"></div>
            <div className="p-6 space-y-3">
              <div className="h-6 bg-gradient-to-r from-brand-primary/20 via-electric-blue/20 to-brand-accent/20 rounded-xl"></div>
              <div className="h-4 bg-gradient-to-r from-brand-primary/20 via-electric-blue/20 to-brand-accent/20 rounded-lg w-3/4"></div>
              <div className="h-4 bg-gradient-to-r from-brand-primary/20 via-electric-blue/20 to-brand-accent/20 rounded-lg w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!coins || coins.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="glass-card p-12 rounded-3xl max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-r from-brand-primary to-electric-blue rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="text-xl font-bold gradient-text mb-2">No Coins Found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}
    >
      {coins.map((coin) => (
        <motion.div key={coin.id} variants={itemVariants}>
          <CoinCard coin={coin} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CoinGrid;
