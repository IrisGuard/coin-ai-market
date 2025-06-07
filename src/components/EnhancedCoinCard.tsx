
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, Clock, Star, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coin } from '@/types/coin';
import { useEnhancedFavorites } from '@/hooks/useEnhancedFavorites';

interface EnhancedCoinCardProps {
  coin: Coin;
  index?: number;
}

const EnhancedCoinCard: React.FC<EnhancedCoinCardProps> = ({ coin, index = 0 }) => {
  const { toggleFavorite, isFavorite } = useEnhancedFavorites();
  const isUserFavorite = isFavorite(coin.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(coin.id);
  };

  const formatTimeRemaining = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl border-0 bg-white">
        <div className="relative">
          <Link to={`/coin/${coin.id}`}>
            <div className="aspect-square overflow-hidden bg-gray-50">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          </Link>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
              isUserFavorite 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isUserFavorite ? 'fill-current' : ''}`} />
          </Button>

          {/* Status Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {coin.featured && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black border-0">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            
            {coin.is_auction && (
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                <Clock className="w-3 h-3 mr-1" />
                Auction
              </Badge>
            )}
          </div>

          {/* Auction Timer */}
          {coin.is_auction && coin.auction_end && (
            <div className="absolute bottom-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
              {formatTimeRemaining(coin.auction_end)}
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Title and Info */}
            <div>
              <Link to={`/coin/${coin.id}`}>
                <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-brand-primary transition-colors">
                  {coin.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <span>{coin.year}</span>
                {coin.country && (
                  <>
                    <span>•</span>
                    <span>{coin.country}</span>
                  </>
                )}
              </div>
            </div>

            {/* Condition and Rarity */}
            <div className="flex items-center gap-2">
              {coin.condition && (
                <Badge variant="outline" className="text-xs">
                  {coin.condition}
                </Badge>
              )}
              {coin.rarity && (
                <Badge variant="outline" className="text-xs">
                  {coin.rarity}
                </Badge>
              )}
            </div>

            {/* Price - CHANGED TO EURO */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  €{coin.price?.toLocaleString()}
                </div>
                {coin.is_auction && (
                  <div className="text-sm text-gray-600">
                    Starting at €{coin.price?.toLocaleString()}
                  </div>
                )}
              </div>
              
              {!coin.is_auction && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <DollarSign className="w-3 h-3 mr-1" />
                  Buy Now
                </Badge>
              )}
            </div>

            {/* Views and Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{coin.views || 0} views</span>
              </div>
              
              {coin.profiles && (
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium">
                    {coin.profiles.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-xs">{coin.profiles.name}</span>
                  {coin.profiles.verified_dealer && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Button - CORRECTED LINK */}
            <Link to={`/coin/${coin.id}`} className="block">
              <Button className="w-full mt-3 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 transition-all duration-200">
                {coin.is_auction ? 'View Auction' : 'View Details'}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnhancedCoinCard;
