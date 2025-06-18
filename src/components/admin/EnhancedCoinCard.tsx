
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Star, TrendingUp, AlertTriangle } from 'lucide-react';

interface EnhancedCoinCardProps {
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
    created_at?: string;
  };
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFeatured?: (id: string, featured: boolean) => void;
}

const EnhancedCoinCard = ({ coin, onView, onEdit, onDelete, onToggleFeatured }: EnhancedCoinCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'error_coin': return 'bg-red-100 text-red-800 border-red-300 font-bold';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'ancient': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const isErrorCoin = coin.category === 'error_coin';

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${isErrorCoin ? 'ring-2 ring-red-300 border-red-200' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {/* Enhanced Coin Image */}
          <div className="flex-shrink-0 relative">
            <img
              src={coin.image}
              alt={coin.name}
              className={`w-20 h-20 object-cover rounded-lg border-2 ${isErrorCoin ? 'border-red-300' : 'border-gray-200'}`}
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop';
              }}
            />
            {isErrorCoin && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1">
                <AlertTriangle className="w-3 h-3" />
              </div>
            )}
          </div>

          {/* Enhanced Coin Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`text-sm font-semibold truncate ${isErrorCoin ? 'text-red-800' : 'text-gray-900'}`}>
                  {coin.name}
                  {isErrorCoin && <span className="ml-2 text-red-600">🚨</span>}
                </h3>
                <p className="text-xs text-gray-500">
                  {coin.year} • {coin.grade}
                </p>
                <p className={`text-sm font-medium ${isErrorCoin ? 'text-red-600' : 'text-green-600'}`}>
                  ${coin.price.toLocaleString()}
                  {coin.is_auction && (
                    <span className="text-xs text-gray-500 ml-1">(Auction)</span>
                  )}
                </p>
              </div>
              
              <div className="flex items-center space-x-1">
                {coin.featured && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                )}
                {isErrorCoin && (
                  <Badge className="bg-red-500 text-white text-xs">ERROR</Badge>
                )}
              </div>
            </div>

            {/* Enhanced Status and Category Badges */}
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
                {isErrorCoin && ' 🚨'}
              </Badge>

              {coin.views !== undefined && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Eye className="w-3 h-3" />
                  <span>{coin.views}</span>
                </div>
              )}
            </div>

            {/* Creation Date for Error Coins */}
            {isErrorCoin && coin.created_at && (
              <div className="text-xs text-red-600 mt-1">
                Created: {new Date(coin.created_at).toLocaleDateString()}
              </div>
            )}

            {/* Enhanced Action Buttons */}
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
                  className={`h-7 px-2 text-xs ${isErrorCoin ? 'border-red-300 text-red-700' : ''}`}
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

export default EnhancedCoinCard;
