
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, TrendingUp, Clock, Star } from 'lucide-react';

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
    image?: string;
    grade?: string;
    year?: number;
  };
  onClick: () => void;
}

const CoinCard: React.FC<CoinCardProps> = ({ coin, onClick }) => {
  const formatTimeAgo = (hours: number) => {
    if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden relative">
        {coin.image ? (
          <img 
            src={coin.image} 
            alt={coin.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        {coin.featured && (
          <Badge className="absolute top-2 right-2 bg-primary">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}
      </div>
      
      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{coin.name}</h3>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-bold text-primary">${coin.price?.toLocaleString()}</span>
        {coin.trend && (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <TrendingUp className="h-3 w-3" />
            <span>{coin.trend}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          <span>{coin.views || 0} views</span>
        </div>
        {coin.addedHours !== undefined && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatTimeAgo(coin.addedHours)}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mb-3">
        {coin.rarity && (
          <Badge variant="outline" className="text-xs">
            {coin.rarity}
          </Badge>
        )}
        {coin.grade && (
          <Badge variant="secondary" className="text-xs">
            {coin.grade}
          </Badge>
        )}
      </div>
      
      <Button size="sm" className="w-full">
        View Details
      </Button>
    </div>
  );
};

export default CoinCard;
