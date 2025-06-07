
import React from 'react';
import { Star, MapPin, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DealerStoreCardProps {
  id: string;
  avatar_url?: string;
  username?: string;
  full_name?: string;
  bio?: string;
  rating?: number;
  location?: string;
  totalCoins?: number;
  verified_dealer?: boolean;
}

const DealerStoreCard: React.FC<DealerStoreCardProps> = ({
  id,
  avatar_url,
  username,
  full_name,
  bio,
  rating = 5.0,
  location,
  totalCoins = 0,
  verified_dealer = false
}) => {
  const displayName = full_name || username || 'Unnamed Store';
  const displayRating = Math.min(Math.max(rating || 5.0, 0), 5);
  
  // Generate star rating display
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(displayRating);
    const hasHalfStar = displayRating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-electric-orange text-electric-orange" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-electric-orange/50 text-electric-orange" />);
    }
    
    const emptyStars = 5 - Math.ceil(displayRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <Link to={`/dealer/${id}`} className="block group">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:border-electric-orange/30 transition-all duration-300 group-hover:scale-[1.02] overflow-hidden">
        <div className="p-6">
          {/* Header with avatar and verification */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <img
                src={avatar_url || '/placeholder.svg'}
                alt={`${displayName} avatar`}
                className="w-16 h-16 rounded-full object-cover border-2 border-electric-blue/20"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              {verified_dealer && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-electric-green rounded-full flex items-center justify-center border-2 border-white">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-electric-blue group-hover:text-electric-purple transition-colors">
                {displayName}
              </h3>
              {verified_dealer && (
                <span className="text-sm text-electric-green font-medium">Verified Dealer</span>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center space-x-1">
              {renderStars()}
            </div>
            <span className="text-sm font-medium text-electric-purple">
              {displayRating.toFixed(1)}
            </span>
          </div>

          {/* Bio */}
          {bio && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {bio}
            </p>
          )}

          {/* Store stats */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{totalCoins} coins</span>
            </div>
            {location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Hover effect bar */}
        <div className="h-1 bg-gradient-to-r from-electric-blue to-electric-purple transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>
    </Link>
  );
};

export default DealerStoreCard;
