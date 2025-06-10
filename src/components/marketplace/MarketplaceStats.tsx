
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, Star, DollarSign, Users } from 'lucide-react';

interface MarketplaceStatsType {
  total: number;
  auctions: number;
  featured: number;
  totalValue: number;
  activeUsers: number;
}

interface MarketplaceStatsProps {
  stats: MarketplaceStatsType;
  loading: boolean;
}

const MarketplaceStats: React.FC<MarketplaceStatsProps> = ({ stats, loading }) => {
  const statsConfig = [
    { 
      icon: <Target className="w-8 h-8" />, 
      value: stats.total, 
      label: "Total Coins", 
      color: "from-brand-primary to-electric-blue",
      bgColor: "from-brand-primary/10 to-electric-blue/10"
    },
    { 
      icon: <Clock className="w-8 h-8" />, 
      value: stats.auctions, 
      label: "Live Auctions", 
      color: "from-brand-accent to-electric-pink",
      bgColor: "from-brand-accent/10 to-electric-pink/10"
    },
    { 
      icon: <Star className="w-8 h-8" />, 
      value: stats.featured, 
      label: "Featured", 
      color: "from-coin-gold to-electric-orange",
      bgColor: "from-coin-gold/10 to-electric-orange/10"
    },
    { 
      icon: <DollarSign className="w-8 h-8" />, 
      value: `$${Math.round(stats.totalValue / 1000)}K`, 
      label: "Total Value", 
      color: "from-electric-emerald to-electric-teal",
      bgColor: "from-electric-emerald/10 to-electric-teal/10"
    },
    { 
      icon: <Users className="w-8 h-8" />, 
      value: stats.activeUsers, 
      label: "Active Users", 
      color: "from-electric-purple to-brand-primary",
      bgColor: "from-electric-purple/10 to-brand-primary/10"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-12"
    >
      {statsConfig.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
          className="stats-card text-center group hover:shadow-2xl transition-all duration-500"
        >
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.bgColor} border border-white/20 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
            <div className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.icon}
            </div>
          </div>
          <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
            {loading ? (
              <div className="w-12 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mx-auto"></div>
            ) : (
              typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()
            )}
          </div>
          <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MarketplaceStats;
