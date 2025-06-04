
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye, Clock, Verified, Star, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface CoinCardProps {
  id: string;
  name: string;
  year: number;
  grade: string;
  price: number;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare';
  image: string;
  isAuction?: boolean;
  timeLeft?: string;
  model3d?: string;
  obverseImage?: string;
  reverseImage?: string;
  favorites?: number;
  views?: number;
  featured?: boolean;
  authentication_status?: string;
  profiles?: {
    name: string;
    verified_dealer?: boolean;
  };
}

const CoinCard: React.FC<CoinCardProps> = ({
  id,
  name,
  year,
  grade,
  price,
  rarity,
  image,
  isAuction = false,
  timeLeft,
  favorites = 0,
  views = 0,
  featured = false,
  authentication_status = 'verified',
  profiles
}) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return 'bg-vibrant-emerald text-white';
      case 'Uncommon':
        return 'bg-vibrant-blue text-white';
      case 'Rare':
        return 'bg-vibrant-orange text-white';
      case 'Ultra Rare':
        return 'bg-vibrant-purple text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'Ultra Rare':
        return 'shadow-lg shadow-vibrant-purple/30';
      case 'Rare':
        return 'shadow-lg shadow-vibrant-orange/30';
      default:
        return '';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group"
    >
      <Link to={`/coins/${id}`}>
        <div className={`coin-card relative ${getRarityGlow(rarity)}`}>
          {/* Featured badge */}
          {featured && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-gradient-to-r from-coin-gold to-vibrant-orange text-white shadow-lg">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}

          {/* Auction badge */}
          {isAuction && (
            <div className="absolute top-3 right-3 z-10">
              <Badge className="bg-vibrant-red text-white animate-pulse shadow-lg">
                <Clock className="w-3 h-3 mr-1" />
                Auction
              </Badge>
            </div>
          )}

          {/* Verified badge */}
          {authentication_status === 'verified' && (
            <div className="absolute bottom-3 right-3 z-10">
              <div className="w-6 h-6 bg-vibrant-emerald rounded-full flex items-center justify-center shadow-lg">
                <Verified className="w-3 h-3 text-white" />
              </div>
            </div>
          )}

          {/* Image container */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Overlay stats */}
            <div className="absolute bottom-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs">
                <Eye className="w-3 h-3" />
                {views}
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs">
                <Heart className="w-3 h-3" />
                {favorites}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Title and year */}
            <div>
              <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-vibrant-purple transition-colors line-clamp-2">
                {name}
              </h3>
              <p className="text-vibrant-cyan font-medium text-sm">{year}</p>
            </div>

            {/* Grade and rarity */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs font-medium">
                {grade}
              </Badge>
              <Badge className={`${getRarityColor(rarity)} text-xs font-medium`}>
                {rarity}
              </Badge>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-vibrant-purple to-vibrant-cyan bg-clip-text text-transparent">
                  ${price.toFixed(2)}
                </span>
                {isAuction && (
                  <p className="text-xs text-gray-500">Current bid</p>
                )}
              </div>
              {isAuction && timeLeft && (
                <div className="text-right">
                  <p className="text-xs text-vibrant-red font-medium">
                    {formatDistanceToNow(new Date(timeLeft), { addSuffix: true })}
                  </p>
                </div>
              )}
            </div>

            {/* Seller info */}
            {profiles && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-vibrant-purple to-vibrant-cyan rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {profiles.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs text-gray-600 truncate">{profiles.name}</span>
                </div>
                {profiles.verified_dealer && (
                  <div className="flex items-center gap-1">
                    <Verified className="w-3 h-3 text-vibrant-emerald" />
                    <span className="text-xs text-vibrant-emerald font-medium">Verified</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-vibrant-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CoinCard;
