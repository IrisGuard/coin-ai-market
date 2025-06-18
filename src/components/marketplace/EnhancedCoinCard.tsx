import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye, Clock, DollarSign, Star, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import UltraFastImageGallery from '@/components/ui/UltraFastImageGallery';
import AutoImageEnhancer from './AutoImageEnhancer';
import { useAuth } from '@/contexts/AuthContext';
import { useSmartUserRole } from '@/hooks/useSmartUserRole';

interface Coin {
  id: string;
  name: string;
  image: string;
  images?: string[];
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
  denomination?: string;
  condition?: string;
  enhanced_images?: string[];
}

interface EnhancedCoinCardProps {
  coin: Coin;
  index: number;
  onCoinClick: (coin: Coin) => void;
  enableAutoEnhancement?: boolean;
}

const EnhancedCoinCard = ({ coin, index, onCoinClick, enableAutoEnhancement = true }: EnhancedCoinCardProps) => {
  const { user } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useSmartUserRole();
  const [enhancedImages, setEnhancedImages] = useState<string[]>(coin.enhanced_images || []);
  
  // Check if user is admin
  const isAdmin = userRole === 'admin';
  
  // Prepare all available images for the gallery - prioritize enhanced images
  const getAllImages = (coin: Coin): string[] => {
    const allImages: string[] = [];
    
    // PRIORITY: Use enhanced images first if available
    if (enhancedImages.length > 0) {
      allImages.push(...enhancedImages.filter(img => 
        img && 
        typeof img === 'string' && 
        img.trim() !== '' && 
        !img.startsWith('blob:') &&
        (img.startsWith('http') || img.startsWith('/'))
      ));
    }
    
    // Add original images as fallback
    if (coin.images && Array.isArray(coin.images) && coin.images.length > 0) {
      const validImages = coin.images.filter(img => 
        img && 
        typeof img === 'string' && 
        img.trim() !== '' && 
        !img.startsWith('blob:') &&
        (img.startsWith('http') || img.startsWith('/'))
      );
      
      // Only add if not already in enhanced images
      validImages.forEach(img => {
        if (!allImages.includes(img)) {
          allImages.push(img);
        }
      });
    }
    
    // Fallback to single image field if no valid images from arrays
    if (allImages.length === 0 && coin.image && !coin.image.startsWith('blob:')) {
      allImages.push(coin.image);
    }
    
    return allImages;
  };

  const handleImageEnhanced = (enhancedUrl: string) => {
    setEnhancedImages(prev => {
      if (!prev.includes(enhancedUrl)) {
        return [...prev, enhancedUrl];
      }
      return prev;
    });
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
  const hasEnhancedImages = enhancedImages.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer bg-white"
        onClick={() => onCoinClick(coin)}
      >
        {/* Enhanced Image Gallery with Auto Enhancement */}
        <div className="relative">
          <UltraFastImageGallery 
            images={allImages}
            coinName={coin.name}
            className="aspect-square"
            enableEnhancement={isAdmin}
            showQualityAnalysis={isAdmin}
          />
          
          {/* Auto Enhancement for Primary Image */}
          {enableAutoEnhancement && allImages.length > 0 && (
            <div className="absolute bottom-2 left-2">
              <AutoImageEnhancer
                imageUrl={allImages[0]}
                coinId={coin.id}
                onEnhanced={handleImageEnhanced}
                autoEnhance={true}
                enhancementLevel="professional"
              />
            </div>
          )}
          
          {/* Enhanced Image Indicator */}
          {hasEnhancedImages && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-purple-100 text-purple-800 text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Enhanced
              </Badge>
            </div>
          )}
          
          {/* Other badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
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
            {coin.ai_confidence && coin.ai_confidence > 0.9 && (
              <Badge className="bg-blue-100 text-blue-800 text-xs">
                <Zap className="h-3 w-3 mr-1" />
                AI Verified
              </Badge>
            )}
          </div>

          {/* Views */}
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="bg-black/50 text-white text-xs">
              <Eye className="h-3 w-3 mr-1" />
              {coin.views}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 bg-white">
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

          {/* Action Buttons */}
          <div className="flex gap-2">
            {coin.is_auction && isAuctionActive(coin) ? (
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle bid action
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
                  // Handle buy action
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
                // Handle favorite action
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Enhanced Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
            {coin.ai_confidence && (
              <span className="text-blue-600">AI: {Math.round(coin.ai_confidence * 100)}%</span>
            )}
            {allImages.length > 1 && (
              <span className={`font-semibold ${hasEnhancedImages ? 'text-purple-600' : 'text-green-600'}`}>
                {allImages.length} {hasEnhancedImages ? 'Enhanced' : 'HD'} photos
              </span>
            )}
            {hasEnhancedImages && (
              <span className="text-purple-600 font-bold bg-purple-50 px-2 py-1 rounded border border-purple-200">
                AI ENHANCED ✨
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnhancedCoinCard;
