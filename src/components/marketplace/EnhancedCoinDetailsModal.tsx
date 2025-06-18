
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Clock, DollarSign, Star, AlertTriangle, Eye, Zap, Package, Globe, Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import CoinImageManagerModal from '@/components/dealer/CoinImageManagerModal';

interface Coin {
  id: string;
  name: string;
  image: string;
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
  user_id: string;
  images?: string[];
}

interface EnhancedCoinDetailsModalProps {
  coin: Coin | null;
  isOpen: boolean;
  onClose: () => void;
}

const EnhancedCoinDetailsModal: React.FC<EnhancedCoinDetailsModalProps> = ({
  coin,
  isOpen,
  onClose
}) => {
  const [showImageManager, setShowImageManager] = useState(false);
  const { user } = useAuth();
  
  if (!coin) return null;

  const isOwner = user?.id === coin.user_id;
  const isAuctionActive = coin.is_auction && coin.auction_end && new Date(coin.auction_end) > new Date();

  const handleImagesUpdated = () => {
    setShowImageManager(false);
    // Refresh the modal data or parent component
    onClose();
  };

  const getValidImages = (): string[] => {
    const allImages: string[] = [];
    
    if (coin.images && Array.isArray(coin.images) && coin.images.length > 0) {
      const validImages = coin.images.filter((img: string) => 
        img && typeof img === 'string' && img.trim() !== '' && !img.startsWith('blob:')
      );
      allImages.push(...validImages);
    }
    
    if (allImages.length === 0 && coin.image && !coin.image.startsWith('blob:')) {
      allImages.push(coin.image);
    }
    
    return allImages;
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

  const getListingTypeDisplay = () => {
    if (coin.is_auction && isAuctionActive) {
      return { type: 'Auction', color: 'bg-red-100 text-red-800', icon: Clock };
    } else if (coin.listing_type === 'fixed_price' || !coin.is_auction) {
      return { type: 'Fixed Price', color: 'bg-green-100 text-green-800', icon: DollarSign };
    }
    return { type: 'Direct Sale', color: 'bg-blue-100 text-blue-800', icon: Package };
  };

  const getRarityColor = () => {
    switch (coin.rarity) {
      case 'Key Date': return 'border-red-200 text-red-700 bg-red-50';
      case 'Very Rare': return 'border-purple-200 text-purple-700 bg-purple-50';
      case 'Rare': return 'border-orange-200 text-orange-700 bg-orange-50';
      case 'Scarce': return 'border-yellow-200 text-yellow-700 bg-yellow-50';
      case 'Common': return 'border-green-200 text-green-700 bg-green-50';
      default: return 'border-gray-200 text-gray-700 bg-gray-50';
    }
  };

  const listingInfo = getListingTypeDisplay();
  const ListingIcon = listingInfo.icon;
  const allImages = getValidImages();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{coin.name}</span>
              {coin.featured && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-full h-80 object-cover rounded-lg border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop';
                  }}
                />
                
                {/* Views counter */}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    <Eye className="h-3 w-3 mr-1" />
                    {coin.views}
                  </Badge>
                </div>
              </div>

              {/* Edit Images Button for Owner */}
              {isOwner && (
                <Button
                  onClick={() => setShowImageManager(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Επεξεργασία Εικόνων ({allImages.length})
                </Button>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{coin.year}</h3>
                  <Badge variant="outline" className="text-sm">
                    <Globe className="h-3 w-3 mr-1" />
                    {coin.country}
                  </Badge>
                </div>

                {/* Category */}
                {coin.category && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Category:</span>
                    <Badge variant="secondary">{coin.category}</Badge>
                  </div>
                )}

                {/* Listing Type */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Listing Type:</span>
                  <Badge className={listingInfo.color}>
                    <ListingIcon className="h-3 w-3 mr-1" />
                    {listingInfo.type}
                  </Badge>
                </div>

                {/* Grade and Condition */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Grade:</span>
                    <p className="font-semibold">{coin.grade}</p>
                  </div>
                  {coin.condition && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Condition:</span>
                      <p className="font-semibold">{coin.condition}</p>
                    </div>
                  )}
                </div>

                {/* Denomination */}
                {coin.denomination && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Denomination:</span>
                    <p className="font-semibold">{coin.denomination}</p>
                  </div>
                )}

                {/* Rarity */}
                <div>
                  <span className="text-sm font-medium text-gray-600 mb-1 block">Rarity:</span>
                  <Badge variant="outline" className={getRarityColor()}>
                    {coin.rarity}
                  </Badge>
                </div>

                {/* Error Detection */}
                {coin.error_type && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">Error Detected</span>
                    </div>
                    <p className="text-sm text-orange-700">{coin.error_type}</p>
                  </div>
                )}

                {/* AI Confidence */}
                {coin.ai_confidence && coin.ai_confidence > 0.8 && (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      <Zap className="h-3 w-3 mr-1" />
                      AI Verified ({Math.round(coin.ai_confidence * 100)}%)
                    </Badge>
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div className="p-4 bg-gray-50 rounded-lg">
                {coin.is_auction && isAuctionActive ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Bid:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${coin.starting_bid?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    {coin.auction_end && (
                      <div className="text-sm text-red-600">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Ends in: {getTimeRemaining(coin.auction_end)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${coin.price.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {coin.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {coin.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {!isOwner && (
                <div className="flex gap-3 pt-4">
                  {coin.is_auction && isAuctionActive ? (
                    <Button className="flex-1 bg-red-600 hover:bg-red-700">
                      <Clock className="h-4 w-4 mr-2" />
                      Place Bid
                    </Button>
                  ) : (
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                  )}
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Manager Modal */}
      <CoinImageManagerModal
        isOpen={showImageManager}
        onClose={() => setShowImageManager(false)}
        coin={coin}
        onImagesUpdated={handleImagesUpdated}
      />
    </>
  );
};

export default EnhancedCoinDetailsModal;
