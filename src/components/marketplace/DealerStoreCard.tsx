
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Package, CheckCircle, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  storeDescription
}) => {
  const navigate = useNavigate();

  const handleVisitStore = () => {
    navigate(`/dealer/${id}`);
  };

  const displayName = storeName || full_name || username || 'Dealer Store';
  const displayDescription = storeDescription || bio || 'Professional coin dealer';

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={handleVisitStore}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={avatar_url} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg text-primary truncate">
                {displayName}
              </h3>
              {verified_dealer && (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              )}
            </div>
            
            {username && storeName && (
              <p className="text-sm text-muted-foreground mb-1">@{username}</p>
            )}
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {displayDescription}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-muted-foreground">Rating</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {totalCoins} {totalCoins === 1 ? 'Coin' : 'Coins'}
              </span>
            </div>
            
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate max-w-20">
                  {location}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Badge variant="secondary" className="text-xs">
              <Store className="w-3 h-3 mr-1" />
              Verified Dealer
            </Badge>
          </div>

          <Button 
            className="w-full mt-3"
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
