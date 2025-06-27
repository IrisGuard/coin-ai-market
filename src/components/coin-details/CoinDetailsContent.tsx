import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Share2, Store, Wallet, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CoinPriceSection from './CoinPriceSection';
import CoinBidHistory from './CoinBidHistory';
import RelatedCoins from './RelatedCoins';
import ImageGallery from '@/components/ui/ImageGallery';

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
      name?: string;
      username?: string;
      verified_dealer?: boolean;
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
  const highestBid = bidsData && bidsData.length > 0 
    ? Math.max(...bidsData.map(bid => bid.amount))
    : coin.starting_bid || 0;

  // Enhanced function to get all available images
  const getAllImages = (): string[] => {
    const allImages: string[] = [];
    
    // Priority 1: Check images array
    if (coin.images && Array.isArray(coin.images) && coin.images.length > 0) {
      const validImagesFromArray = coin.images.filter(img => 
        img && 
        typeof img === 'string' && 
        img.trim() !== '' && 
        !img.startsWith('blob:')
      );
      allImages.push(...validImagesFromArray);
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

  const allImages = getAllImages();

  // Function to render rich text HTML safely
  const renderRichText = (htmlContent: string) => {
    return { __html: htmlContent };
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

          {/* Seller Info */}
          {coin.profiles && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Sold by</p>
                    <p className="font-medium">{coin.profiles.name || coin.profiles.username}</p>
                  </div>
                  {coin.profiles.verified_dealer && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <Star className="w-3 h-3 mr-1" />
                      Verified Dealer
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Store Information */}
          {dealerStore && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Store className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Store Information</h3>
                </div>
                
                <div className="space-y-3">
                  {/* Store Name */}
                  <div>
                    <p className="text-sm text-gray-600">Store Name</p>
                    <p className="font-medium text-lg">{dealerStore.name}</p>
                  </div>

                  {/* Crypto Wallets */}
                  {(dealerStore.solana_wallet_address || dealerStore.ethereum_wallet_address || 
                    dealerStore.bitcoin_wallet_address || dealerStore.usdc_wallet_address) && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Wallet className="w-4 h-4 text-green-600" />
                        <p className="text-sm font-medium text-gray-700">Crypto Wallets</p>
                      </div>
                      <div className="space-y-1 text-sm">
                        {dealerStore.solana_wallet_address && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Solana:</span>
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              {dealerStore.solana_wallet_address.slice(0, 8)}...{dealerStore.solana_wallet_address.slice(-8)}
                            </span>
                          </div>
                        )}
                        {dealerStore.ethereum_wallet_address && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ethereum:</span>
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              {dealerStore.ethereum_wallet_address.slice(0, 8)}...{dealerStore.ethereum_wallet_address.slice(-8)}
                            </span>
                          </div>
                        )}
                        {dealerStore.bitcoin_wallet_address && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bitcoin:</span>
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              {dealerStore.bitcoin_wallet_address.slice(0, 8)}...{dealerStore.bitcoin_wallet_address.slice(-8)}
                            </span>
                          </div>
                        )}
                        {dealerStore.usdc_wallet_address && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">USDC:</span>
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              {dealerStore.usdc_wallet_address.slice(0, 8)}...{dealerStore.usdc_wallet_address.slice(-8)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Banking Information */}
                  {(dealerStore.bank_name || dealerStore.iban || dealerStore.swift_bic) && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <p className="text-sm font-medium text-gray-700">Banking Information</p>
                      </div>
                      <div className="space-y-1 text-sm">
                        {dealerStore.bank_name && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bank:</span>
                            <span className="font-medium">{dealerStore.bank_name}</span>
                          </div>
                        )}
                        {dealerStore.iban && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">IBAN:</span>
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              {dealerStore.iban.slice(0, 4)}...{dealerStore.iban.slice(-4)}
                            </span>
                          </div>
                        )}
                        {dealerStore.swift_bic && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">SWIFT/BIC:</span>
                            <span className="font-medium">{dealerStore.swift_bic}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

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
    </div>
  );
};

export default CoinDetailsContent;
