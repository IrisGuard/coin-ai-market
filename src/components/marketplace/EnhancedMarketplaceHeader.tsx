
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import MarketplaceStatsRow from './MarketplaceStatsRow';

interface EnhancedMarketplaceHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  stats: {
    total: number;
    auctions: number;
    featured: number;
    totalValue: number;
  };
}

const EnhancedMarketplaceHeader: React.FC<EnhancedMarketplaceHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  stats
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="mb-8">
      {/* Theme Controls */}
      <div className="flex justify-end gap-2 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="flex items-center gap-2"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </Button>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center px-6 py-3 glass-card rounded-full border border-brand-primary/20 mb-6">
          <Sparkles className="w-5 h-5 mr-3 text-brand-primary animate-pulse" />
          <span className="text-sm font-semibold text-brand-primary">AI-Verified Marketplace</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Global Coin Marketplace
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Discover, buy and sell authenticated coins from collectors worldwide
        </p>
      </motion.div>

      {/* Stats Banner */}
      <MarketplaceStatsRow stats={stats} />
    </div>
  );
};

export default EnhancedMarketplaceHeader;
