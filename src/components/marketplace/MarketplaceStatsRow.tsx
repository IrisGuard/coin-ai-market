
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, Star, DollarSign } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface MarketplaceStatsRowProps {
  stats: {
    total: number;
    auctions: number;
    featured: number;
    totalValue: number;
  };
}

const MarketplaceStatsRow: React.FC<MarketplaceStatsRowProps> = ({ stats }) => {
  const { t } = useI18n();

  const statItems = [
    { 
      icon: <Target className="w-8 h-8" />, 
      value: stats.total, 
      label: t('marketplace.stats.total'), 
      color: "text-brand-primary"
    },
    { 
      icon: <Clock className="w-8 h-8" />, 
      value: stats.auctions, 
      label: t('marketplace.stats.auctions'), 
      color: "text-brand-secondary"
    },
    { 
      icon: <Star className="w-8 h-8" />, 
      value: stats.featured, 
      label: t('marketplace.stats.featured'), 
      color: "text-coin-gold"
    },
    { 
      icon: <DollarSign className="w-8 h-8" />, 
      value: `€${Math.round(stats.totalValue / 1000)}K`, 
      label: t('marketplace.stats.totalValue'), 
      color: "text-electric-orange"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
    >
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
          className="glass-card p-6 rounded-3xl border border-white/20 text-center group hover:shadow-2xl transition-all duration-300"
        >
          <div className={`w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 ${stat.color}`}>
            {stat.icon}
          </div>
          <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
            {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MarketplaceStatsRow;
