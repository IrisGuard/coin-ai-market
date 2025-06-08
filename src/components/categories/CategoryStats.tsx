
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, DollarSign, Clock, Star, Gavel, Award } from 'lucide-react';

interface CategoryStatsProps {
  category: string;
  totalCoins: number;
  averagePrice: number;
  priceRange: { min: number; max: number };
  mostExpensive: { name: string; price: number } | null;
  oldestCoin: { name: string; year: number } | null;
  newestCoin: { name: string; year: number } | null;
  totalAuctions: number;
  featuredCount: number;
}

const CategoryStats: React.FC<CategoryStatsProps> = ({
  category,
  totalCoins,
  averagePrice,
  priceRange,
  mostExpensive,
  oldestCoin,
  newestCoin,
  totalAuctions,
  featuredCount
}) => {
  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `$${(price / 1000).toFixed(1)}K`;
    return `$${price.toFixed(0)}`;
  };

  const stats = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Total Coins',
      value: totalCoins.toLocaleString(),
      color: 'text-electric-blue'
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Average Price',
      value: formatPrice(averagePrice),
      color: 'text-electric-green'
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: 'Price Range',
      value: `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}`,
      color: 'text-electric-orange'
    },
    {
      icon: <Gavel className="w-5 h-5" />,
      label: 'Live Auctions',
      value: totalAuctions.toString(),
      color: 'text-electric-red'
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: 'Featured',
      value: featuredCount.toString(),
      color: 'text-electric-purple'
    }
  ];

  return (
    <div className="mb-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Notable Coins */}
      {(mostExpensive || oldestCoin || newestCoin) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {mostExpensive && (
            <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Most Expensive</span>
                </div>
                <p className="text-sm text-gray-700 truncate">{mostExpensive.name}</p>
                <p className="text-lg font-bold text-yellow-700">{formatPrice(mostExpensive.price)}</p>
              </CardContent>
            </Card>
          )}

          {oldestCoin && (
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Oldest Coin</span>
                </div>
                <p className="text-sm text-gray-700 truncate">{oldestCoin.name}</p>
                <p className="text-lg font-bold text-amber-700">{oldestCoin.year} AD</p>
              </CardContent>
            </Card>
          )}

          {newestCoin && (
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Newest Coin</span>
                </div>
                <p className="text-sm text-gray-700 truncate">{newestCoin.name}</p>
                <p className="text-lg font-bold text-blue-700">{newestCoin.year}</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CategoryStats;
