import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye, Clock, DollarSign, Star, Zap, Edit, Trash2, Settings, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageGallery from '@/components/ui/ImageGallery';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Coin } from '@/types/coin';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface CoinCardProps {
  coin: Coin;
  index: number;
  onCoinClick: (coin: Coin) => void;
  showManagementOptions?: boolean;
}

const CoinCard = ({ coin, index, onCoinClick, showManagementOptions = false }: CoinCardProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Check if current user owns this coin
  const isOwner = user?.id === coin.user_id;

  // Delete coin mutation
  const deleteCoinMutation = useMutation({
    mutationFn: async (coinId: string) => {
      const { error } = await supabase
        .from('coins')
        .delete()
        .eq('id', coinId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredCoins'] });
      queryClient.invalidateQueries({ queryKey: ['store-coins'] });
      queryClient.invalidateQueries({ queryKey: ['dealer-coins'] });
      toast.success('Coin deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete coin: ${error.message}`);
    }
  });

  // Enhanced function to get all available images
  const getAllImages = (coin: Coin): string[] => {
    const allImages: string[] = [];
    
    // Priority 1: Check images array
    if (coin.images && Array.isArray(coin.images) && coin.images.length > 0) {
      const validImages = coin.images.filter(img => 
        img && 
        typeof img === 'string' && 
        img.trim() !== '' && 
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
        !img.startsWith('blob:') &&
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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to upload page with edit parameter for photo editing
    window.open(`/upload?edit=${coin.id}`, '_blank');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCoinMutation.mutate(coin.id);
  };

  const allImages = getAllImages(coin);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer relative"
        onClick={() => onCoinClick(coin)}
      >
        {/* Multi-Image Gallery */}
        <div className="relative">
          <ImageGallery 
            images={allImages}
            coinName={coin.name}
            className="aspect-square"
            compact={true}
            showThumbnails={true}
          />
          
          {/* Overlay Badges */}
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
            {coin.ai_confidence && coin.ai_confidence > 0.9 && (
              <Badge className="bg-blue-100 text-blue-800 text-xs">
                <Zap className="h-3 w-3 mr-1" />
                AI Verified
              </Badge>
            )}
          </div>

          {/* Views */}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/50 text-white text-xs">
              <Eye className="h-3 w-3 mr-1" />
              {coin.views}
            </Badge>
          </div>

          {/* Management Options for Owner */}
          {(showManagementOptions || isOwner) && (
            <div className="absolute bottom-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/90 hover:bg-white text-gray-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Coin
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => e.stopPropagation()}
                    className="text-red-600 hover:text-red-700"
                  >
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <div className="flex items-center w-full">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Coin
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Coin</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{coin.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
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
                ${coin.rarity === 'Ultra Rare' ? 'border-purple-200 text-purple-700' : ''}
                ${coin.rarity === 'Rare' ? 'border-orange-200 text-orange-700' : ''}
                ${coin.rarity === 'Uncommon' ? 'border-yellow-200 text-yellow-700' : ''}
                ${coin.rarity === 'Common' ? 'border-green-200 text-green-700' : ''}
                ${coin.rarity === 'Legendary' ? 'border-red-200 text-red-700' : ''}
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

          {/* 🏪 FIXED: Go to Store Button with validation */}
          {coin.user_id && (
            <Button 
              variant="outline" 
              className="w-full mt-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
              onClick={(e) => {
                e.stopPropagation();
                // Validate user_id before navigation
                if (!coin.user_id || typeof coin.user_id !== 'string') {
                  console.error('❌ Invalid user_id for Visit Store:', coin.user_id);
                  alert('Store information not available');
                  return;
                }
                console.log('✅ Navigating to store for user:', coin.user_id);
                navigate(`/store/${coin.user_id}`);
              }}
            >
              <Store className="h-4 w-4 mr-2" />
              Visit Store
            </Button>
          )}

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
