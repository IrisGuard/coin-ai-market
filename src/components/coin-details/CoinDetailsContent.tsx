
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Share2, Edit, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CoinPriceSection from './CoinPriceSection';
import CoinBidHistory from './CoinBidHistory';
import RelatedCoins from './RelatedCoins';
import ImageGallery from '@/components/ui/ImageGallery';
import EditCoinImagesModal from '@/components/dealer/EditCoinImagesModal';

interface CoinDetailsContentProps {
  coin: {
    id: string;
    name: string;
    price: number;
    description?: string;
    category?: string;
    grade?: string;
    year?: number;
    condition?: string;
    image?: string;
    images?: string[];
    obverse_image?: string;
    reverse_image?: string;
    is_auction?: boolean;
    sold?: boolean;
    starting_bid?: number;
    user_id: string;
    profiles?: {
      id?: string;
      name?: string;
      full_name?: string;
      username?: string;
      verified_dealer?: boolean;
      email?: string;
    };
  };
  dealerStore?: {
    name: string;
    solana_wallet_address?: string;
    ethereum_wallet_address?: string;
    bitcoin_wallet_address?: string;
    usdc_wallet_address?: string;
    bank_name?: string;
    iban?: string;
    swift_bic?: string;
  } | null;
  bidsData: Array<{
    id: string;
    amount: number;
    created_at: string;
    profiles?: {
      name?: string;
      username?: string;
    };
  }>;
  relatedCoins: Array<{
    id: string;
    name: string;
    price: number;
    image?: string;
    grade?: string;
    year?: number;
  }>;
  isFavorited: boolean;
  bidAmount: string;
  setBidAmount: (amount: string) => void;
  isPurchasing: boolean;
  isBidding: boolean;
  onToggleFavorite: () => void;
  onPurchase: () => void;
  onBid: () => void;
  isOwner: boolean;
}

const CoinDetailsContent = ({
  coin,
  dealerStore,
  bidsData,
  relatedCoins,
  isFavorited,
  bidAmount,
  setBidAmount,
  isPurchasing,
  isBidding,
  onToggleFavorite,
  onPurchase,
  onBid,
  isOwner
}: CoinDetailsContentProps) => {
  const [isEditImagesModalOpen, setIsEditImagesModalOpen] = useState(false);
  
  const highestBid = bidsData && bidsData.length > 0 
    ? Math.max(...bidsData.map(bid => bid.amount))
    : coin.starting_bid || 0;

  // Enhanced function to get all available images - CLEAN VERSION
  const getAllImages = (): string[] => {
    const allImages: string[] = [];
    
    console.log('🏪 CoinDetailsContent - coin.images:', coin.images);
    console.log('🏪 CoinDetailsContent - coin.image:', coin.image);
    console.log('🏪 CoinDetailsContent - coin.obverse_image:', coin.obverse_image);
    console.log('🏪 CoinDetailsContent - coin.reverse_image:', coin.reverse_image);
    
    // Priority 1: Check images array
    if (coin.images && Array.isArray(coin.images) && coin.images.length > 0) {
      const validImagesFromArray = coin.images.filter(img => 
        img && 
        typeof img === 'string' && 
        img.trim() !== '' && 
        img !== 'null' && 
        img !== 'undefined' &&
        !img.startsWith('blob:') &&
        (img.startsWith('http') || img.startsWith('/'))
      );
      allImages.push(...validImagesFromArray);
      console.log('🏪 CoinDetailsContent - Valid images from array:', validImagesFromArray);
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
    console.log('🏪 CoinDetailsContent - Final all images:', allImages);
    
    return allImages;
  };

  const allImages = getAllImages();

  // Function to render rich text HTML safely
  const renderRichText = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  // Get proper seller name with fallback logic - FIXED
  const getSellerName = () => {
    if (!coin.profiles) {
      console.log('🏪 CoinDetailsContent - No profiles data');
      return 'Unknown Seller';
    }
    
    console.log('🏪 CoinDetailsContent - Full profiles object:', coin.profiles);
    
    const sellerName = coin.profiles.full_name || 
                      coin.profiles.name || 
                      coin.profiles.username || 
                      'Unknown Seller';
    
    console.log('🏪 CoinDetailsContent - Resolved seller name:', sellerName);
    return sellerName;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Multi-Image Gallery */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <ImageGallery 
                images={allImages}
                coinName={coin.name}
                className="w-full"
              />
            </CardContent>
          </Card>
          
          {/* Edit Images Button - ONLY for owners */}
          {isOwner && (
            <div className="flex justify-center">
              <Button
                onClick={() => setIsEditImagesModalOpen(true)}
                variant="outline"
                className="flex items-center gap-2 bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300"
              >
                <Camera className="w-4 h-4" />
                Edit Images
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - Details & Purchase */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{coin.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {coin.year && <span>Year: {coin.year}</span>}
                  {coin.grade && <span>Grade: {coin.grade}</span>}
                  {coin.condition && <span>Condition: {coin.condition}</span>}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleFavorite}
                >
                  {isFavorited ? <Heart className="w-4 h-4 fill-red-500 text-red-500" /> : <Heart className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {coin.category && (
              <Badge variant="secondary" className="mb-4">
                {coin.category}
              </Badge>
            )}
          </div>

          {/* Seller Info - FIXED DISPLAY */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sold by</p>
                  <p className="font-medium text-lg">{getSellerName()}</p>
                  {coin.profiles?.email && (
                    <p className="text-xs text-gray-500">{coin.profiles.email}</p>
                  )}
                </div>
                {coin.profiles?.verified_dealer && (
                  <Badge className="bg-blue-100 text-blue-800">
                    <Star className="w-3 h-3 mr-1" />
                    Verified Dealer
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Price Section */}
          <CoinPriceSection
            coin={coin}
            dealerStore={dealerStore}
            highestBid={highestBid}
            bidAmount={bidAmount}
            setBidAmount={setBidAmount}
            onPurchase={onPurchase}
            onBid={onBid}
            isOwner={isOwner}
            isPurchasing={isPurchasing}
            isBidding={isBidding}
            bidsCount={bidsData?.length || 0}
          />

          {/* Description */}
          {coin.description && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Description</h3>
                <div 
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={renderRichText(coin.description)}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Bid History */}
      {coin.is_auction && bidsData && bidsData.length > 0 && (
        <div className="mt-12">
          <CoinBidHistory bids={bidsData} />
        </div>
      )}

      {/* Related Coins */}
      {relatedCoins && relatedCoins.length > 0 && (
        <div className="mt-12">
          <RelatedCoins relatedCoins={relatedCoins} />
        </div>
      )}

      {/* Edit Images Modal */}
      {isOwner && (
        <EditCoinImagesModal
          isOpen={isEditImagesModalOpen}
          onClose={() => setIsEditImagesModalOpen(false)}
          coinId={coin.id}
          coinName={coin.name}
          currentImages={allImages}
        />
      )}
    </div>
  );
};

export default CoinDetailsContent;
