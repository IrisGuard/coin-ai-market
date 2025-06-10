import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Eye, Clock, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface CoinCardProps {
  coin: {
    id: string;
    name: string;
    price: number;
    views?: number;
    trend?: string;
    addedHours?: number;
    rarity?: string;
    featured?: boolean;
  };
  onClick?: () => void;
}

const CoinCard: React.FC<CoinCardProps> = ({ coin, onClick }) => {
  return (
    <motion.div
      key={coin.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm text-gray-900 truncate flex-1 mr-2">
              {coin.name}
            </h4>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-green-600">
                ${coin.price.toLocaleString()}
              </span>
              
              {coin.trend && (
                <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                  {coin.trend}
                </Badge>
              )}
              
              {coin.rarity && (
                <Badge className="text-xs bg-purple-600 text-white">
                  {coin.rarity}
                </Badge>
              )}
              
              {coin.featured && (
                <Badge className="text-xs bg-yellow-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {coin.views && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {coin.views} views
                </div>
              )}
              
              {coin.addedHours && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {coin.addedHours}h ago
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {Math.floor(Math.random() * 50 + 10)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CoinCard;
