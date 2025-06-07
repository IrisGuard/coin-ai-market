
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Coins, DollarSign } from 'lucide-react';

interface MarketplaceStatsRowProps {
  stats: {
    total: number;
    auctions: number;
    featured: number;
    totalValue: number;
  };
}

const MarketplaceStatsRow: React.FC<MarketplaceStatsRowProps> = ({ stats }) => {
  const statItems = [
    {
      icon: Coins,
      value: stats.total.toLocaleString(),
      label: 'Ενεργά Νομίσματα',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: TrendingUp,
      value: stats.auctions.toLocaleString(),
      label: 'Ζωντανές Δημοπρασίες',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Users,
      value: stats.featured.toLocaleString(),
      label: 'Προτεινόμενα',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: DollarSign,
      value: `€${(stats.totalValue / 1000).toFixed(0)}K`,
      label: 'Συνολική Αξία',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
    >
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
          className={`${stat.bgColor} rounded-2xl p-6 text-center border border-white/50 shadow-lg`}
        >
          <div className={`inline-flex items-center justify-center w-12 h-12 ${stat.bgColor} rounded-full mb-4`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div className={`text-3xl font-bold ${stat.color} mb-2`}>
            {stat.value}
          </div>
          <div className="text-gray-600 text-sm font-medium">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MarketplaceStatsRow;
