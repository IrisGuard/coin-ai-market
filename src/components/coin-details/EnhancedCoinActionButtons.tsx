
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ShoppingCart, 
  Gavel, 
  Heart, 
  Eye, 
  Clock, 
  DollarSign,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePurchaseCoin } from '@/hooks/usePurchases';
import { usePlaceBid } from '@/hooks/useBids';
import { useEnhancedFavorites } from '@/hooks/useEnhancedFavorites';
import { getTimeRemaining } from '@/utils/auctionUtils';

interface EnhancedCoinActionButtonsProps {
  coin: any;
}

const EnhancedCoinActionButtons: React.FC<EnhancedCoinActionButtonsProps> = ({ coin }) => {
  const { user } = useAuth();
  const [bidAmount, setBidAmount] = useState('');
  const { isFavorite, toggleFavorite } = useEnhancedFavorites();
  const purchaseCoin = usePurchaseCoin();
  const placeBid = usePlaceBid();

  const isUserFavorite = isFavorite(coin.id);
  const isOwner = user?.id === coin.user_id || user?.id === coin.seller_id;
  const isAuction = coin.is_auction || coin.listing_type === 'auction';
  const isSold = coin.sold;

  // Calculate auction time remaining
  const timeRemaining = isAuction && coin.auction_end ? getTimeRemaining(coin.auction_end) : null;
  const auctionExpired = timeRemaining?.expired || false;

  const handlePurchase = async () => {
    if (!user) {
      // Redirect to auth
      window.location.href = '/auth';
      return;
    }

    try {
      await purchaseCoin.mutateAsync({
        coinId: coin.id,
        sellerId: coin.user_id || coin.seller_id,
        amount: coin.price,
        storeId: coin.store_id
      });
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  const handleBid = async () => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }

    const amount = parseFloat(bidAmount);
    if (!amount || amount <= (coin.current_bid || coin.price)) {
      return;
    }

    try {
      await placeBid.mutateAsync({
        coinId: coin.id,
        amount: amount
      });
      setBidAmount('');
    } catch (error) {
      console.error('Bid error:', error);
    }
  };

  const handleFavoriteToggle = () => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    toggleFavorite(coin.id);
  };

  if (isSold) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sold</h3>
            <p className="text-gray-600">This item has been sold</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isOwner) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="text-center">
            <Eye className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <p className="text-orange-700 font-medium">This is your listing</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Views:</span>
                <span className="font-medium">{coin.views || 0}</span>
              </div>
              {isAuction && (
                <div className="flex justify-between text-sm">
                  <span>Current Bid:</span>
                  <span className="font-medium">€{coin.current_bid || coin.price}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Price/Bid Information */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {isAuction ? (
              <>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    €{coin.current_bid || coin.starting_bid || coin.price}
                  </div>
                  <p className="text-gray-600">Current Bid</p>
                  {coin.bid_count > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      {coin.bid_count} bid{coin.bid_count !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {/* Auction Timer */}
                {timeRemaining && !auctionExpired && (
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-orange-700">
                      {timeRemaining.days > 0 && `${timeRemaining.days}d `}
                      {String(timeRemaining.hours).padStart(2, '0')}:
                      {String(timeRemaining.minutes).padStart(2, '0')}:
                      {String(timeRemaining.seconds).padStart(2, '0')}
                    </div>
                    <p className="text-sm text-orange-600">Time Remaining</p>
                  </div>
                )}

                {auctionExpired && (
                  <div className="text-center p-3 bg-gray-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">Auction Ended</p>
                  </div>
                )}

                {/* Bidding Section */}
                {!auctionExpired && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder={`Minimum: €${(coin.current_bid || coin.price) + 1}`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleBid}
                        disabled={
                          placeBid.isPending ||
                          !bidAmount ||
                          parseFloat(bidAmount) <= (coin.current_bid || coin.price)
                        }
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        <Gavel className="w-4 h-4 mr-2" />
                        {placeBid.isPending ? 'Bidding...' : 'Place Bid'}
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-500 text-center">
                      Next bid must be at least €{(coin.current_bid || coin.price) + 1}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    €{coin.price?.toLocaleString()}
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200 mt-2">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Buy Now
                  </Badge>
                </div>

                {/* Purchase Button */}
                <Button
                  onClick={handlePurchase}
                  disabled={purchaseCoin.isPending}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {purchaseCoin.isPending ? 'Processing...' : `Buy Now - €${coin.price?.toLocaleString()}`}
                </Button>
              </>
            )}

            {/* Favorite Button */}
            <Button
              onClick={handleFavoriteToggle}
              variant="outline"
              className={`w-full ${
                isUserFavorite 
                  ? 'border-red-200 text-red-600 hover:bg-red-50' 
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isUserFavorite ? 'fill-current' : ''}`} />
              {isUserFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seller Info */}
      {coin.profiles && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Seller Information</h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-medium">
                {coin.profiles.name?.[0]?.toUpperCase() || 'S'}
              </div>
              <div className="flex-1">
                <p className="font-medium">{coin.profiles.name || 'Anonymous Seller'}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Rating: {coin.profiles.reputation || 0}/100
                  </span>
                  {coin.profiles.verified_dealer && (
                    <Badge className="bg-blue-100 text-blue-700 text-xs">
                      Verified Dealer
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedCoinActionButtons;
