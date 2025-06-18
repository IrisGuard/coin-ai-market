
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Star, TrendingUp } from 'lucide-react';

interface CoinCardProps {
  coin: {
    id: string;
    name: string;
    image: string;
    price: number;
    year: number;
    grade: string;
    category: string;
    authentication_status: string;
    featured: boolean;
    is_auction: boolean;
    views?: number;
  };
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFeatured?: (id: string, featured: boolean) => void;
}

const CoinCard = ({ coin, onView, onEdit, onDelete, onToggleFeatured }: CoinCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'error_coin': return 'bg-red-100 text-red-800 border-red-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'ancient': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {/* Coin Image */}
          <div className="flex-shrink-0">
            <img
              src={coin.image}
              alt={coin.name}
              className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = '/placeholder-coin.png';
              }}
            />
          </div>

          {/* Coin Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {coin.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {coin.year} • {coin.grade}
                </p>
                <p className="text-sm font-medium text-green-600">
                  ${coin.price.toLocaleString()}
                  {coin.is_auction && (
                    <span className="text-xs text-gray-500 ml-1">(Auction)</span>
                  )}
                </p>
              </div>
              
              {coin.featured && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
            </div>

            {/* Status and Category Badges */}
            <div className="flex items-center space-x-2 mt-2">
              <Badge 
                variant="outline" 
                className={`text-xs ${getStatusColor(coin.authentication_status)}`}
              >
                {coin.authentication_status}
              </Badge>
              
              <Badge 
                variant="outline" 
                className={`text-xs ${getCategoryColor(coin.category)}`}
              >
                {coin.category.replace('_', ' ').toUpperCase()}
              </Badge>

              {coin.views && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Eye className="w-3 h-3" />
                  <span>{coin.views}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 mt-3">
              {onView && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView(coin.id)}
                  className="h-7 px-2 text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
              )}
              
              {onEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(coin.id)}
                  className="h-7 px-2 text-xs"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              )}

              {onToggleFeatured && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onToggleFeatured(coin.id, !coin.featured)}
                  className="h-7 px-2 text-xs"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {coin.featured ? 'Unfeature' : 'Feature'}
                </Button>
              )}
              
              {onDelete && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(coin.id)}
                  className="h-7 px-2 text-xs text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinCard;
