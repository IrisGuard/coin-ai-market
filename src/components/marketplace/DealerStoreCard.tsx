
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Package, CheckCircle, Store, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface DealerStoreCardProps {
  id: string;
  avatar_url?: string;
  username?: string;
  full_name?: string;
  bio?: string;
  rating?: number;
  location?: string;
  verified_dealer?: boolean;
  totalCoins: number;
  storeName?: string;
  storeDescription?: string;
  created_at?: string;
}

const DealerStoreCard: React.FC<DealerStoreCardProps> = ({
  id,
  avatar_url,
  username,
  full_name,
  bio,
  rating,
  location,
  verified_dealer,
  totalCoins,
  storeName,
  storeDescription,
  created_at
}) => {
  const navigate = useNavigate();

  const handleVisitStore = () => {
    navigate(`/store/${id}`);
  };

  const displayName = storeName || full_name || username || 'Dealer Store';
  const displayDescription = storeDescription || bio || 'Professional coin dealer';

  const formatCreatedDate = (dateString?: string) => {
    if (!dateString) return 'Recently created';
    try {
      return format(new Date(dateString), 'MMMM yyyy');
    } catch {
      return 'Recently created';
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating || rating === 0) {
      return (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-gray-300" />
          <span className="text-sm text-brand-medium">Not yet rated</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-500 fill-current" />
        <span className="text-sm font-medium text-brand-primary">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const getCoinCountMessage = () => {
    if (totalCoins === 0) return 'No coins listed';
    if (totalCoins === 1) return '1 Coin';
    return `${totalCoins} Coins`;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-electric-blue/20 hover:border-electric-blue/40 bg-gradient-to-br from-white to-electric-blue/5" onClick={handleVisitStore}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-16 h-16 border-2 border-electric-blue/30">
            <AvatarImage src={avatar_url} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-br from-brand-primary to-electric-purple text-white text-lg font-semibold">
              <Store className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 
                className="font-semibold text-lg text-brand-primary max-w-full" 
                title={displayName}
              >
                {displayName}
              </h3>
              {verified_dealer && (
                <CheckCircle className="w-5 h-5 text-electric-blue flex-shrink-0" />
              )}
            </div>
            
            <p className="text-sm text-brand-medium line-clamp-2 mb-2">
              {displayDescription}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {renderStars(rating)}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-electric-purple" />
              <span className="text-sm font-medium text-brand-primary">
                {getCoinCountMessage()}
              </span>
            </div>
            
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-electric-purple" />
                <span className="text-xs text-brand-medium truncate max-w-20">
                  {location}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-electric-blue" />
            <span className="text-xs text-brand-medium">
              Created: {formatCreatedDate(created_at)}
            </span>
          </div>

          <div className="flex gap-2 pt-2">
            <Badge className="bg-gradient-to-r from-electric-blue to-electric-purple text-white border-0">
              <Store className="w-3 h-3 mr-1" />
              Verified Dealer
            </Badge>
          </div>

          <Button 
            className="w-full mt-3 bg-gradient-to-r from-brand-primary to-electric-purple hover:from-brand-primary/90 hover:to-electric-purple/90 text-white"
            onClick={(e) => {
              e.stopPropagation();
              handleVisitStore();
            }}
          >
            Visit Store
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealerStoreCard;
