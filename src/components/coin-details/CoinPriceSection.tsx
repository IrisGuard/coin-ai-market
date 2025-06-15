
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Gavel } from 'lucide-react';
import CheckoutModal from './CheckoutModal';

interface CoinPriceSectionProps {
  coin: {
    id: string;
    name: string;
    is_auction?: boolean;
    price: number;
    sold?: boolean;
    starting_bid?: number;
    image?: string;
    user_id: string;
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
  highestBid: number;
  bidAmount: string;
  setBidAmount: (amount: string) => void;
  onPurchase: () => void;
  onBid: () => void;
  isOwner: boolean;
  isPurchasing: boolean;
  isBidding: boolean;
  bidsCount: number;
}

const CoinPriceSection = ({
  coin,
  dealerStore,
  highestBid,
  bidAmount,
  setBidAmount,
  onPurchase,
  onBid,
  isOwner,
  isPurchasing,
  isBidding,
  bidsCount
}: CoinPriceSectionProps) => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleCheckoutSuccess = () => {
    setShowCheckoutModal(false);
    onPurchase(); // Call the original purchase handler
  };

  return (
    <>
      <Card className="glass-card border-2 border-green-200">
        <CardContent className="p-6">
          {coin.is_auction ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-600">Current Bid</div>
                  <div className="text-3xl font-bold text-green-600">${Number(highestBid).toFixed(2)}</div>
                </div>
                <Badge className="bg-blue-600 text-white flex items-center gap-2">
                  <Gavel className="w-4 h-4" />
                  Live Auction
                </Badge>
              </div>
              
              {!isOwner && !coin.sold && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder={`Min: $${Number(highestBid + 1).toFixed(2)}`}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={onBid}
                      disabled={isBidding}
                      className="coinvision-button"
                    >
                      <Gavel className="w-4 h-4 mr-2" />
                      Place Bid
                    </Button>
                  </div>
                  
                  {bidsCount > 0 && (
                    <div className="text-sm text-gray-600">
                      {bidsCount} bid{bidsCount !== 1 ? 's' : ''} • Ends in 2 days
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-gray-600">Price</div>
                  <div className="text-3xl font-bold text-green-600">${Number(coin.price).toFixed(2)}</div>
                </div>
                <Badge className="bg-green-600 text-white">
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Buy Now
                </Badge>
              </div>
              
              {!isOwner && !coin.sold && (
                <div className="space-y-3">
                  <Button 
                    onClick={() => setShowCheckoutModal(true)}
                    disabled={isPurchasing}
                    className="w-full coinvision-button text-lg py-3"
                    size="lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Purchase Now
                  </Button>
                </div>
              )}
              
              {coin.sold && (
                <div className="text-center py-4 text-gray-500">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    SOLD
                  </Badge>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        coin={coin}
        dealerStore={dealerStore}
        onTraditionalPurchase={handleCheckoutSuccess}
        onTransakSuccess={handleCheckoutSuccess}
      />
    </>
  );
};

export default CoinPriceSection;
