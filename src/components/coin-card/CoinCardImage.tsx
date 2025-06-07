
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Clock } from 'lucide-react';

interface CoinCardImageProps {
  coin: {
    id: string;
    name: string;
    image: string;
    featured?: boolean;
    is_auction?: boolean;
    auction_end?: string;
  };
  imageLoaded: boolean;
  isUserFavorite: boolean;
  onFavoriteClick: (e: React.MouseEvent) => void;
  formatTimeRemaining: (endTime: string) => string;
  priority?: boolean;
}

const CoinCardImage: React.FC<CoinCardImageProps> = ({
  coin,
  imageLoaded,
  isUserFavorite,
  onFavoriteClick,
  formatTimeRemaining,
  priority = false
}) => {
  return (
    <div className="relative">
      <Link to={`/coin/${coin.id}`}>
        <div className="aspect-square overflow-hidden bg-gray-100">
          {imageLoaded || priority ? (
            <img
              src={coin.image}
              alt={coin.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading={priority ? 'eager' : 'lazy'}
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
          )}
        </div>
      </Link>

      {/* Favorite Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onFavoriteClick}
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
          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 border-0">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
        
        {coin.is_auction && (
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
            <Clock className="w-3 h-3 mr-1" />
            Auction
          </Badge>
        )}
      </div>

      {/* Auction Timer */}
      {coin.is_auction && coin.auction_end && (
        <div className="absolute bottom-2 left-2 bg-gray-900/80 text-white px-2 py-1 rounded text-xs font-medium">
          {formatTimeRemaining(coin.auction_end)}
        </div>
      )}
    </div>
  );
};

export default CoinCardImage;
