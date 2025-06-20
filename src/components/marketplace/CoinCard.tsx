
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye, Clock, DollarSign, Star, Zap } from 'lucide-react';
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
  description?: string;
  listing_type?: string;
  error_type?: string;
  denomination?: string;
  condition?: string;
}

interface CoinCardProps {
  coin: Coin;
  index: number;
  onCoinClick: (coin: Coin) => void;
}

const CoinCard = ({ coin, index, onCoinClick }: CoinCardProps) => {
  // Enhanced function to get all available images - CLEANED VERSION
  const getAllImages = (coin: Coin): string[] => {
    const allImages: string[] = [];
    
    // Priority 1: Check images array
    if (coin.images && Array.isArray(coin.images) && coin.images.length > 0) {
      const validImages = coin.images.filter(img => 
        img && 
        typeof img === 'string' && 
        img.trim() !== '' && 
        img !== 'null' && 
        img !== 'undefined' &&
        !img.startsWith('blob:') &&
        (img.startsWith('http') || img.startsWith('/'))
      );
      allImages.push(...validImages);
    }
    
    // Priority 2: Add individual image fields if not already included
    const individualImages = [coin.image, coin.obverse_image, coin.reverse_image]
      .filter(img => 
        img && 
        typeof img === 'string' && 
        img.trim() !== '' && 
        img !== 'null' && 
        img !== 'undefined' &&
        !img.startsWith('blob:') &&
        (img.startsWith('http') || img.startsWith('/')) &&
        !allImages.includes(img)
      );
    
    allImages.push(...individualImages);
    
    return allImages;
  };

  const isAuctionActive = (coin: Coin) => {
    if (!coin.is_auction || !coin.auction_end) return false;
    return new Date(coin.auction_end) > new Date();
  };

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

  const allImages = getAllImages(coin);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
        onClick={() => onCoinClick(coin)}
      >
        {/* Clean Image Gallery - NO OVERLAYS */}
        <div className="relative">
          <ImageGallery 
            images={allImages}
            coinName={coin.name}
            className="aspect-square"
          />
          
          {/* Minimal overlay badges - only essential info */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {coin.featured && (
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {isAuctionActive(coin) && (
              <Badge className="bg-red-100 text-red-800 text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Auction
              </Badge>
            )}
          </div>

          {/* Views counter - minimal */}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/50 text-white text-xs">
              <Eye className="h-3 w-3 mr-1" />
              {coin.views}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title and Grade */}
          <div className="mb-2">
            <h3 className="font-semibold text-lg truncate" title={coin.name}>
              {coin.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{coin.year}</span>
              <span>•</span>
              <span>{coin.grade}</span>
              <span>•</span>
              <span>{coin.country}</span>
            </div>
          </div>

          {/* Rarity */}
          <div className="mb-3">
            <Badge 
              variant="outline" 
              className={`
                ${coin.rarity === 'Key Date' ? 'border-red-200 text-red-700' : ''}
                ${coin.rarity === 'Ultra Rare' ? 'border-purple-200 text-purple-700' : ''}
                ${coin.rarity === 'Rare' ? 'border-orange-200 text-orange-700' : ''}
                ${coin.rarity === 'Scarce' ? 'border-yellow-200 text-yellow-700' : ''}
                ${coin.rarity === 'Common' ? 'border-green-200 text-green-700' : ''}
              `}
            >
              {coin.rarity}
            </Badge>
          </div>

          {/* Price/Bid Info */}
          <div className="mb-4">
            {coin.is_auction && isAuctionActive(coin) ? (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Bid:</span>
                  <span className="font-semibold text-lg text-green-600">
                    ${coin.starting_bid?.toFixed(2) || '0.00'}
                  </span>
                </div>
                {coin.auction_end && (
                  <div className="text-sm text-red-600 mt-1">
                    Ends in: {getTimeRemaining(coin.auction_end)}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Price:</span>
                <span className="font-semibold text-xl text-blue-600">
                  ${coin.price.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons - Simplified */}
          <div className="flex gap-2">
            {coin.is_auction && isAuctionActive(coin) ? (
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Clock className="h-4 w-4 mr-2" />
                Place Bid
              </Button>
            ) : (
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Buy Now
              </Button>
            )}
            <Button 
              variant="outline" 
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* AI Confidence & Image Count */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
            {coin.ai_confidence && (
              <span className="text-blue-600">AI: {Math.round(coin.ai_confidence * 100)}%</span>
            )}
            {allImages.length > 1 && (
              <span className="text-green-600">{allImages.length} photos</span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CoinCard;
