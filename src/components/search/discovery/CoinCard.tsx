
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye } from 'lucide-react';

interface CoinCardProps {
  coin: {
    id: string;
    title: string;
    price: number;
    condition: string;
    year: number;
    country: string;
    image?: string;
    featured?: boolean;
  };
  onView?: (id: string) => void;
  onFavorite?: (id: string) => void;
}

const CoinCard: React.FC<CoinCardProps> = ({ coin, onView, onFavorite }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gray-100 relative">
        {coin.image ? (
          <img 
            src={coin.image} 
            alt={coin.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        {coin.featured && (
          <Badge className="absolute top-2 right-2">Featured</Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{coin.title}</h3>
        
        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <div>Year: {coin.year}</div>
          <div>Country: {coin.country}</div>
          <div>Condition: {coin.condition}</div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">
            ${coin.price.toLocaleString()}
          </span>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFavorite?.(coin.id)}
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onView?.(coin.id)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinCard;
