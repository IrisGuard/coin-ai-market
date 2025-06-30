import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye, Calendar, Star, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CoinCardProps {
  coin: {
    id: string;
    name: string;
    year: number;
    price: number;
    image: string;
    rarity: string;
    grade: string;
    views?: number;
    favorites?: number;
    is_auction?: boolean;
    authentication_status?: string;
    featured?: boolean;
    seller?: {
      verified_dealer?: boolean;
      rating?: number;
    };
    profiles?: {
      verified_dealer?: boolean;
      rating?: number;
    };
  };
  onFavorite?: () => void;
  isFavorited?: boolean;
}

const CoinCard: React.FC<CoinCardProps> = ({ coin, onFavorite, isFavorited }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/coin/${coin.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.();
  };

  const seller = coin.seller || coin.profiles;

  return (
    <Card 
      className="glass-card hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative overflow-hidden rounded-t-lg aspect-square">
          <img 
            src={coin.image || '/placeholder-coin.svg'}
            alt={coin.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-coin.svg';
            }}
          />
          
          {/* Overlay Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {coin.featured && (
              <Badge className="bg-yellow-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {coin.is_auction && (
              <Badge className="bg-blue-600 text-white">
                Live Auction
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white"
            onClick={handleFavoriteClick}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Title and Year */}
          <div>
            <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">{coin.name}</h3>
            <p className="text-gray-600">{coin.year}</p>
          </div>

          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">{coin.rarity}</Badge>
            <Badge variant="outline">{coin.grade}</Badge>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-green-600">
              ${Number(coin.price).toLocaleString()}
            </div>
            {coin.is_auction && (
              <span className="text-sm text-gray-500">Current bid</span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {coin.views || 0}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {coin.favorites || 0}
              </div>
            </div>
            
            {seller?.verified_dealer && (
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-blue-600">Verified Seller</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinCard;
