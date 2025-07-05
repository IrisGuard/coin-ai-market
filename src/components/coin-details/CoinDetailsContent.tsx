import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Share2, Store, Wallet, Building2, ExternalLink, ShoppingBag, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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
    store_id?: string;
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
  bidsData = [],
  relatedCoins = [],
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
  const navigate = useNavigate();
  // 🛡️ DEFENSIVE CHECKS - Prevent crashes
  if (!coin || !coin.id) {
    console.error('❌ CRITICAL: Missing coin data', { coin });
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Coin</h2>
          <p className="text-gray-600">Coin data is missing or invalid. Please try again.</p>
        </Card>
      </div>
    );
  }

  // 🔍 DETAILED DEBUG LOGS
  console.log('🪙 COIN DATA DEBUG:', {
    coinId: coin?.id,
    coinName: coin?.name,
    userId: coin?.user_id,
    hasImages: Boolean(coin?.images?.length),
    imageCount: coin?.images?.length || 0,
    dealerStoreExists: Boolean(dealerStore),
    dealerStoreName: dealerStore?.name,
    profiles: coin?.profiles
  });

  const highestBid = Array.isArray(bidsData) && bidsData.length > 0 
    ? Math.max(...bidsData.map(bid => bid.amount))
    : coin.starting_bid || 0;

  // 🖼️ Enhanced function to get all available images with comprehensive validation
  const getAllImages = (): string[] => {
    const allImages: string[] = [];
    
    try {
      // Priority 1: Check images array with comprehensive validation
      if (coin.images && Array.isArray(coin.images)) {
        const validImagesFromArray = coin.images
          .filter(img => {
            if (!img || typeof img !== 'string' || img.trim() === '') return false;
            if (img.startsWith('blob:')) return false;
            return img.startsWith('http') || img.startsWith('/') || img.startsWith('data:');
          });
        allImages.push(...validImagesFromArray);
        console.log('✅ Images from array:', validImagesFromArray.length);
      }
      
      // Priority 2: Add individual image fields if not already included
      const individualImages = [coin.image, coin.obverse_image, coin.reverse_image]
        .filter(img => {
          if (!img || typeof img !== 'string' || img.trim() === '') return false;
          if (img.startsWith('blob:')) return false;
          if (allImages.includes(img)) return false;
          return img.startsWith('http') || img.startsWith('/') || img.startsWith('data:');
        });
      
      allImages.push(...individualImages);
      console.log('✅ Individual images added:', individualImages.length);
      
      // Fallback: Add placeholder if no valid images found
      if (allImages.length === 0) {
        console.warn('⚠️ No valid images found for coin, using placeholder');
        allImages.push('/placeholder-coin.svg');
      }
      
    } catch (error) {
      console.error('💥 Error processing images:', error);
      allImages.push('/placeholder-coin.svg');
    }
    
    console.log('🖼️ Final Images Array:', allImages);
    return allImages;
  };

  const allImages = getAllImages();

  // 🛡️ Safe user_id with fallback
  const safeUserId = coin?.user_id || 'unknown';
  const hasValidUserId = coin?.user_id && typeof coin.user_id === 'string' && coin.user_id.trim() !== '';

  // Function to render rich text HTML safely
  const renderRichText = (htmlContent: string) => {
    try {
      return { __html: htmlContent || '' };
    } catch (error) {
      console.error('Error rendering rich text:', error);
      return { __html: '' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Enhanced Multi-Image Gallery */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <ImageGallery 
                images={allImages}
                coinName={coin?.name || 'Unknown Coin'}
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{coin?.name || 'Unknown Coin'}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {coin?.year && <span>Year: {coin.year}</span>}
                  {coin?.grade && <span>Grade: {coin.grade}</span>}
                  {coin?.condition && <span>Condition: {coin.condition}</span>}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Owner Management Buttons */}
                {isOwner && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Navigate to edit page (could be upload page with coin data)
                        window.open(`/upload?edit=${coin.id}`, '_blank');
                      }}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                                         <Button
                       variant="outline"
                       size="sm"
                       onClick={async () => {
                         if (confirm(`Are you sure you want to delete "${coin.name}"? This action cannot be undone.`)) {
                           try {
                             // Import supabase dynamically
                             const { supabase } = await import('@/integrations/supabase/client');
                             
                             const { error } = await supabase
                               .from('coins')
                               .delete()
                               .eq('id', coin.id)
                               .eq('user_id', coin.user_id);
                             
                             if (error) {
                               console.error('Delete error:', error);
                               alert('Failed to delete coin: ' + error.message);
                               return;
                             }
                             
                             alert('Coin deleted successfully');
                             window.location.href = '/dealer-direct';
                           } catch (error) {
                             console.error('Delete error:', error);
                             alert('Failed to delete coin');
                           }
                         }
                       }}
                       className="border-red-200 text-red-700 hover:bg-red-50"
                     >
                       <Trash2 className="w-4 h-4 mr-1" />
                       Delete
                     </Button>
                  </>
                )}
                
                {/* Regular Action Buttons */}
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

            {coin?.category && (
              <Badge variant="secondary" className="mb-4">
                {coin.category}
              </Badge>
            )}
          </div>

          {/* Seller Info */}
          {coin?.profiles && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Sold by</p>
                    <p className="font-medium">{coin.profiles.name || coin.profiles.username || 'Anonymous Seller'}</p>
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

          {/* 🏪 ENHANCED Store Information Card - ALWAYS VISIBLE with comprehensive error handling */}
          <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-full">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900">Store Information</h3>
                </div>
                {hasValidUserId ? (
                  <Button
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      try {
                        let store = null;
                        
                        // FIXED: Try to use store_id from coin first, then fallback to user_id search
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
                            console.log('✅ Found store by ID:', store.name);
                          }
                        }
                        
                        // Fallback: Find any active store for this user
                        if (!store && coin.user_id) {
                          console.log('🔍 Fallback: Finding store by user_id:', coin.user_id);
                          const { data: storeByUser, error: userError } = await supabase
                            .from('stores')
                            .select('id, name, user_id, is_active')
                            .eq('user_id', coin.user_id)
                            .eq('is_active', true)
                            .limit(1)
                            .single();
                          
                          if (storeByUser && !userError) {
                            store = storeByUser;
                            console.log('✅ Found store by user_id:', store.name);
                          }
                        }

                        if (!store) {
                          console.error('❌ No store found for coin:', coin.id);
                          alert('This dealer\'s store is not available at the moment.');
                          return;
                        }

                        console.log('✅ Navigating to store:', store.name, 'with user_id:', store.user_id);
                        // Navigate using the store owner's user_id
                        navigate(`/store/${store.user_id}`);
                      } catch (error) {
                        console.error('❌ Error accessing store:', error);
                        alert('Unable to access store at the moment.');
                      }
                    }}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Visit Store
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg font-medium text-sm cursor-not-allowed">
                    <ShoppingBag className="w-4 h-4" />
                    Store Unavailable
                  </div>
                )}
              </div>
              
              {dealerStore && dealerStore.name ? (
                <div className="space-y-4">
                  {/* Store Name */}
                  <div className="bg-white p-5 rounded-xl border-2 border-blue-200 shadow-sm">
                    <p className="text-sm text-gray-600 mb-2 font-medium">🏪 Store Name</p>
                    <p className="font-bold text-2xl text-blue-900">{dealerStore.name}</p>
                  </div>

                  {/* Crypto Wallets */}
                  {(dealerStore.solana_wallet_address || dealerStore.ethereum_wallet_address || 
                    dealerStore.bitcoin_wallet_address || dealerStore.usdc_wallet_address) && (
                    <div className="bg-white p-5 rounded-xl border-2 border-green-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <Wallet className="w-5 h-5 text-green-600" />
                        <p className="font-bold text-lg text-gray-800">💳 Crypto Wallets</p>
                      </div>
                      <div className="grid grid-cols-1 gap-3 text-sm">
                        {dealerStore.solana_wallet_address && (
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                            <span className="text-gray-700 font-semibold">Solana:</span>
                            <span className="font-mono text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                              {dealerStore.solana_wallet_address.slice(0, 8)}...{dealerStore.solana_wallet_address.slice(-8)}
                            </span>
                          </div>
                        )}
                        {dealerStore.ethereum_wallet_address && (
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                            <span className="text-gray-700 font-semibold">Ethereum:</span>
                            <span className="font-mono text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                              {dealerStore.ethereum_wallet_address.slice(0, 8)}...{dealerStore.ethereum_wallet_address.slice(-8)}
                            </span>
                          </div>
                        )}
                        {dealerStore.bitcoin_wallet_address && (
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                            <span className="text-gray-700 font-semibold">Bitcoin:</span>
                            <span className="font-mono text-xs bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                              {dealerStore.bitcoin_wallet_address.slice(0, 8)}...{dealerStore.bitcoin_wallet_address.slice(-8)}
                            </span>
                          </div>
                        )}
                        {dealerStore.usdc_wallet_address && (
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                            <span className="text-gray-700 font-semibold">USDC:</span>
                            <span className="font-mono text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">
                              {dealerStore.usdc_wallet_address.slice(0, 8)}...{dealerStore.usdc_wallet_address.slice(-8)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Banking Information */}
                  {(dealerStore.bank_name || dealerStore.iban || dealerStore.swift_bic) && (
                    <div className="bg-white p-5 rounded-xl border-2 border-indigo-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                        <p className="font-bold text-lg text-gray-800">🏦 Banking Information</p>
                      </div>
                      <div className="grid grid-cols-1 gap-3 text-sm">
                        {dealerStore.bank_name && (
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                            <span className="text-gray-700 font-semibold">Bank:</span>
                            <span className="font-bold text-indigo-800">{dealerStore.bank_name}</span>
                          </div>
                        )}
                        {dealerStore.iban && (
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                            <span className="text-gray-700 font-semibold">IBAN:</span>
                            <span className="font-mono text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                              {dealerStore.iban.slice(0, 4)}...{dealerStore.iban.slice(-4)}
                            </span>
                          </div>
                        )}
                        {dealerStore.swift_bic && (
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                            <span className="text-gray-700 font-semibold">SWIFT/BIC:</span>
                            <span className="font-bold text-indigo-800">{dealerStore.swift_bic}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // 🔧 Enhanced Fallback when dealerStore is null or missing
                <div className="bg-white p-5 rounded-xl border-2 border-orange-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <Store className="w-4 h-4 text-orange-600" />
                    </div>
                    <p className="font-bold text-lg text-orange-800">
                      {hasValidUserId ? "Loading Store Information..." : "Store Information Unavailable"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <strong>Seller:</strong> {coin?.profiles?.name || coin?.profiles?.username || 'Verified Dealer'}
                    </p>
                    {hasValidUserId ? (
                      <>
                        <p className="text-sm text-gray-600">
                          📍 This coin belongs to a verified dealer. Store details are being loaded.
                        </p>
                        <p className="text-xs text-blue-600 font-medium">
                          💡 Click "Visit Store" above to see all items from this dealer!
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-red-600">
                        ⚠️ Store information temporarily unavailable. Please try again later.
                      </p>
                    )}
                  </div>
                </div>
              )}
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
            bidsCount={Array.isArray(bidsData) ? bidsData.length : 0}
          />

          {/* Description */}
          {coin?.description && (
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
      {coin?.is_auction && Array.isArray(bidsData) && bidsData.length > 0 && (
        <div className="mt-12">
          <CoinBidHistory bids={bidsData} />
        </div>
      )}

      {/* Related Coins */}
      {Array.isArray(relatedCoins) && relatedCoins.length > 0 && (
        <div className="mt-12">
          <RelatedCoins relatedCoins={relatedCoins} />
        </div>
      )}
    </div>
  );
};

export default CoinDetailsContent;
