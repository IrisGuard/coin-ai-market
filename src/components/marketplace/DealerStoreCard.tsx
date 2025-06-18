
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Package, CheckCircle, Store, Calendar, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import VerifiedStoreBadge from '@/components/admin/enhanced/VerifiedStoreBadge';

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
  storeAddress?: any;
}

// Country flag mapping for common countries
const countryFlags: Record<string, string> = {
  'US': '🇺🇸',
  'GB': '🇬🇧', 
  'CA': '🇨🇦',
  'DE': '🇩🇪',
  'FR': '🇫🇷',
  'IT': '🇮🇹',
  'ES': '🇪🇸',
  'JP': '🇯🇵',
  'AU': '🇦🇺',
  'NZ': '🇳🇿',
  'CH': '🇨🇭',
  'AT': '🇦🇹',
  'NL': '🇳🇱',
  'BE': '🇧🇪',
  'DK': '🇩🇰',
  'SE': '🇸🇪',
  'NO': '🇳🇴',
  'FI': '🇫🇮',
};

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
  created_at,
  storeAddress
}) => {
  const navigate = useNavigate();

  const handleViewStore = () => {
    navigate(`/dealer/${id}`);
  };

  const getCountryFlag = () => {
    if (storeAddress && typeof storeAddress === 'object' && storeAddress.country) {
      return countryFlags[storeAddress.country] || '🌍';
    }
    return null;
  };

  const displayName = full_name || username || storeName || 'Unknown Store';
  const displayDescription = bio || storeDescription || 'No description available';

  return (
    <Card className="glass-card hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 border-2 border-electric-blue/20">
            <AvatarImage src={avatar_url} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-br from-electric-blue to-electric-purple text-white font-semibold">
              {displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg text-brand-primary group-hover:text-electric-blue transition-colors">
                {displayName}
              </h3>
              <div className="flex items-center gap-2">
                {/* VERIFIED STORE BADGE */}
                <VerifiedStoreBadge isVerified={verified_dealer} size="sm" />
                {getCountryFlag() && (
                  <span className="text-lg" title={`Country: ${storeAddress?.country}`}>
                    {getCountryFlag()}
                  </span>
                )}
              </div>
            </div>
            
            {storeName && storeName !== displayName && (
              <p className="text-sm text-electric-purple font-medium mb-1">
                <Store className="w-4 h-4 inline mr-1" />
                {storeName}
              </p>
            )}
            
            <p className="text-sm text-brand-medium mb-3 line-clamp-2">
              {displayDescription}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-electric-orange" />
                <span className="text-brand-medium">
                  <span className="font-semibold text-electric-orange">{totalCoins}</span> coins
                </span>
              </div>
              
              {rating && (
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-electric-yellow fill-current" />
                  <span className="text-brand-medium">
                    <span className="font-semibold">{rating.toFixed(1)}</span>/5
                  </span>
                </div>
              )}
              
              {location && (
                <div className="flex items-center gap-2 text-sm col-span-2">
                  <MapPin className="w-4 h-4 text-electric-green" />
                  <span className="text-brand-medium">{location}</span>
                </div>
              )}
              
              {created_at && (
                <div className="flex items-center gap-2 text-sm col-span-2">
                  <Calendar className="w-4 h-4 text-electric-purple" />
                  <span className="text-brand-medium">
                    Member since {format(new Date(created_at), 'MMM yyyy')}
                  </span>
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleViewStore}
              className="w-full bg-gradient-to-r from-electric-blue to-electric-purple hover:from-electric-purple hover:to-electric-blue text-white font-medium transition-all duration-300"
            >
              View Store
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealerStoreCard;
