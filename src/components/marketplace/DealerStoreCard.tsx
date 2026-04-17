import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Package, CheckCircle, Store, Calendar, Globe } from 'lucide-react';
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
  storeAddress?: any;
}

const COUNTRY_FLAGS: Record<string, string> = {
  US: '🇺🇸', GB: '🇬🇧', CA: '🇨🇦', DE: '🇩🇪', FR: '🇫🇷', IT: '🇮🇹', ES: '🇪🇸',
  JP: '🇯🇵', AU: '🇦🇺', NZ: '🇳🇿', CH: '🇨🇭', AT: '🇦🇹', NL: '🇳🇱', BE: '🇧🇪',
  DK: '🇩🇰', SE: '🇸🇪', NO: '🇳🇴', FI: '🇫🇮', GR: '🇬🇷', IN: '🇮🇳', GI: '🇬🇮',
};

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States', GB: 'United Kingdom', CA: 'Canada', DE: 'Germany', FR: 'France',
  IT: 'Italy', ES: 'Spain', JP: 'Japan', AU: 'Australia', NZ: 'New Zealand', CH: 'Switzerland',
  AT: 'Austria', NL: 'Netherlands', BE: 'Belgium', DK: 'Denmark', SE: 'Sweden',
  NO: 'Norway', FI: 'Finland', GR: 'Greece', IN: 'India', GI: 'Gibraltar',
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
  storeAddress,
}) => {
  const navigate = useNavigate();
  const visit = () => navigate(`/store/${id}`);

  const displayName = storeName || full_name || username || 'Dealer Store';
  const displayDescription = storeDescription || bio || 'Professional coin dealer';

  const formatCreated = (d?: string) => {
    if (!d) return 'Recently created';
    try { return format(new Date(d), 'MMMM yyyy'); } catch { return 'Recently created'; }
  };

  const country = storeAddress && typeof storeAddress === 'object' ? storeAddress.country : null;
  const countryFlag = country ? COUNTRY_FLAGS[country] : null;
  const countryName = country ? COUNTRY_NAMES[country] || country : null;

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border bg-card hover:border-primary/40 hover:shadow-elevated transition-all"
      onClick={visit}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-5">
          <Avatar className="w-14 h-14 border border-border">
            <AvatarImage src={avatar_url} alt={displayName} />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground">
              <Store className="w-6 h-6" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-base truncate" title={displayName}>{displayName}</h3>
              {verified_dealer && <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{displayDescription}</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">
                {totalCoins === 0 ? 'No coins listed' : `${totalCoins} coin${totalCoins !== 1 ? 's' : ''}`}
              </span>
            </div>
            {rating && rating > 0 ? (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <span className="font-medium">{rating.toFixed(1)}</span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">Not yet rated</span>
            )}
          </div>

          {location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{location}</span>
            </div>
          )}

          {countryName && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span>{countryFlag} {countryName}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>Established {formatCreated(created_at)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-5 border-t border-border">
          {verified_dealer && (
            <Badge variant="outline" className="border-primary/30 text-primary gap-1.5">
              <CheckCircle className="w-3 h-3" /> Verified
            </Badge>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto text-primary hover:bg-primary/10 hover:text-primary"
            onClick={(e) => { e.stopPropagation(); visit(); }}
          >
            Visit store →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealerStoreCard;
