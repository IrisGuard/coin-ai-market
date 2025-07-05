
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye, Clock, Star, AlertTriangle, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageGallery from '@/components/ui/ImageGallery';
import { Coin } from '@/types/coin';
import ExpandableAIDetails from '@/components/ai/ExpandableAIDetails';
import { supabase } from '@/integrations/supabase/client';

interface OptimizedCoinCardProps {
  coin: Coin;
  index: number;
  priority?: boolean;
}

const OptimizedCoinCard: React.FC<OptimizedCoinCardProps> = ({ coin, index, priority = false }) => {
  const navigate = useNavigate();
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
      case 'Rare': return 'border-orange-200 text-orange-700 bg-orange-50';
      case 'Uncommon': return 'border-yellow-200 text-yellow-700 bg-yellow-50';
      case 'Common': return 'border-green-200 text-green-700 bg-green-50';
      case 'Legendary': return 'border-purple-200 text-purple-700 bg-purple-50';
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

            {/* AI Analysis Details */}
            <ExpandableAIDetails coin={coin} />

            {/* Visit Store Button */}
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  try {
                    let store = null;
                    
                    // Try to use store_id from coin first, then fallback to user_id search
                    if (coin.store_id) {
                      console.log('🔍 Finding store by store_id:', coin.store_id);
                      const { data: storeById, error: storeError } = await supabase
                        .from('stores')
                        .select('id, name, user_id, is_active')
                        .eq('id', coin.store_id)
                        .eq('is_active', true)
                        .single();
                      
                      if (storeById && !storeError) {
                        store = storeById;
                        console.log('✅ Found store by store_id:', store);
                      }
                    }
                    
                    // Fallback: Find store by user_id if store_id lookup failed
                    if (!store && coin.user_id) {
                      console.log('🔍 Finding store by user_id:', coin.user_id);
                      const { data: storeByUserId, error: userError } = await supabase
                        .from('stores')
                        .select('id, name, user_id, is_active')
                        .eq('user_id', coin.user_id)
                        .eq('is_active', true)
                        .single();
                      
                      if (storeByUserId && !userError) {
                        store = storeByUserId;
                        console.log('✅ Found store by user_id:', store);
                      }
                    }
                    
                    if (store) {
                      // Navigate using the store owner's user_id
                      navigate(`/store/${store.user_id}`);
                    } else {
                      console.error('❌ No store found for coin:', coin.id);
                      alert('Store not found for this coin.');
                    }
                  } catch (error) {
                    console.error('❌ Error accessing store:', error);
                    alert('Unable to access store at the moment.');
                  }
                }}
              >
                <Store className="h-3 w-3 mr-1" />
                Visit Store
              </Button>
            </div>

            {/* Image Count */}
            {allImages.length > 1 && (
              <div className="flex justify-end text-xs text-gray-500 mt-1">
                <span className="text-green-600">{allImages.length} photos</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default OptimizedCoinCard;
