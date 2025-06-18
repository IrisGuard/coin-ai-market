
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye, Clock, Star, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageGallery from '@/components/ui/ImageGallery';

interface Coin {
  id: string;
  name: string;
  image: string;
  images?: string[];
  obverse_image?: string;
  reverse_image?: string;
  price: number;
  grade: string;
  year: number;
  rarity: string;
  is_auction: boolean;
  auction_end: string | null;
  starting_bid: number | null;
  views: number;
  featured: boolean;
  ai_confidence: number | null;
  country: string;
  authentication_status: string;
  category?: string;
}

interface OptimizedCoinCardProps {
  coin: Coin;
  index: number;
  priority?: boolean;
}

const OptimizedCoinCard: React.FC<OptimizedCoinCardProps> = ({ coin, index, priority = false }) => {
  // Prepare all available images for the gallery
  const getAllImages = (coin: Coin): string[] => {
    const allImages: string[] = [];
    
    // Add from images array if available
    if (coin.images && Array.isArray(coin.images) && coin.images.length > 0) {
      allImages.push(...coin.images.filter(img => img && !img.startsWith('blob:')));
    } else {
      // Fallback to individual image fields
      if (coin.image && !coin.image.startsWith('blob:')) allImages.push(coin.image);
      if (coin.obverse_image && !coin.obverse_image.startsWith('blob:')) allImages.push(coin.obverse_image);
      if (coin.reverse_image && !coin.reverse_image.startsWith('blob:')) allImages.push(coin.reverse_image);
    }
    
    return allImages;
  };

  const allImages = getAllImages(coin);
  const isAuctionActive = coin.is_auction && coin.auction_end && new Date(coin.auction_end) > new Date();

  const getTimeRemaining = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const getRarityColor = () => {
    switch (coin.rarity) {
      case 'Ultra Rare': return 'border-red-200 text-red-700 bg-red-50';
      case 'Very Rare': return 'border-purple-200 text-purple-700 bg-purple-50';
      case 'Rare': return 'border-orange-200 text-orange-700 bg-orange-50';
      case 'Uncommon': return 'border-yellow-200 text-yellow-700 bg-yellow-50';
      case 'Common': return 'border-green-200 text-green-700 bg-green-50';
      default: return 'border-gray-200 text-gray-700 bg-gray-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Link to={`/coin/${coin.id}`} className="block">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
          {/* Multi-Image Gallery */}
          <div className="relative">
            <ImageGallery 
              images={allImages}
              coinName={coin.name}
              className="aspect-square"
            />
            
            {/* Overlay Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {coin.featured && (
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {coin.category === 'error_coin' && (
                <Badge className="bg-red-100 text-red-800 text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Error
                </Badge>
              )}
              {isAuctionActive && (
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              )}
            </div>

            {/* Views counter */}
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-black/50 text-white text-xs">
                <Eye className="h-3 w-3 mr-1" />
                {coin.views || 0}
              </Badge>
            </div>
          </div>

          {/* Coin Info */}
          <div className="p-3 space-y-2">
            {/* Title */}
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
              {coin.name}
            </h3>

            {/* Year, Grade, Country */}
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>{coin.year}</span>
              <span>•</span>
              <span>{coin.grade}</span>
              <span>•</span>
              <span>{coin.country}</span>
            </div>

            {/* Rarity */}
            <div>
              <Badge variant="outline" className={`text-xs ${getRarityColor()}`}>
                {coin.rarity}
              </Badge>
            </div>

            {/* Price/Bid Info */}
            <div className="space-y-1">
              {isAuctionActive ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Current Bid:</span>
                    <span className="font-semibold text-sm text-green-600">
                      ${coin.starting_bid?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  {coin.auction_end && (
                    <div className="text-xs text-red-600">
                      Ends: {getTimeRemaining(coin.auction_end)}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Price:</span>
                  <span className="font-semibold text-lg text-blue-600">
                    ${coin.price.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* AI Confidence & Image Count */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              {coin.ai_confidence && coin.ai_confidence > 0.8 && (
                <span className="text-blue-600">AI: {Math.round(coin.ai_confidence * 100)}%</span>
              )}
              {allImages.length > 1 && (
                <span className="text-green-600">{allImages.length} photos</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default OptimizedCoinCard;
