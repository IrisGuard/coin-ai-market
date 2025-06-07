
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CoinHeader from './CoinHeader';
import CoinImage from './CoinImage';
import CoinActionButtons from './CoinActionButtons';
import CoinPriceSection from './CoinPriceSection';
import CoinSellerInfo from './CoinSellerInfo';
import CoinDetailsTab from './CoinDetailsTab';
import CoinHistoryTab from './CoinHistoryTab';
import CoinAuthenticationTab from './CoinAuthenticationTab';
import CoinBidHistory from './CoinBidHistory';
import RelatedCoins from './RelatedCoins';

interface CoinDetailsContentProps {
  coin: any;
  bidsData: any[];
  relatedCoins: any[];
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
  // Handle profile data - extract first profile from array if it exists, or use as object
  const rawProfile = coin.profiles;
  const profile = Array.isArray(rawProfile) ? rawProfile[0] : rawProfile;
  
  // Process bids data - now they should have proper profile structure
  const validBids = (bidsData || []).filter(bid => bid.profiles);
  const highestBid = Math.max(...validBids.map(bid => bid.amount), coin.starting_bid || coin.price || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Left Column - Image */}
        <div className="space-y-6">
          <CoinImage coin={coin} />
          <CoinActionButtons 
            isFavorited={isFavorited} 
            onToggleFavorite={onToggleFavorite} 
          />
        </div>

        {/* Right Column - Details */}
        <div className="space-y-8">
          <CoinHeader coin={coin} />
          <CoinPriceSection 
            coin={coin}
            highestBid={highestBid}
            bidAmount={bidAmount}
            setBidAmount={setBidAmount}
            onPurchase={onPurchase}
            onBid={onBid}
            isOwner={isOwner}
            isPurchasing={isPurchasing}
            isBidding={isBidding}
            bidsCount={validBids.length}
          />
          {profile && (
            <CoinSellerInfo 
              seller={profile} 
              coinCreatedAt={coin.created_at || new Date().toISOString()} 
            />
          )}
        </div>
      </div>

      {/* Tabs Section */}
      <Card className="glass-card border-2 border-purple-200">
        <CardContent className="p-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="bids">Bid History</TabsTrigger>
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <CoinDetailsTab coin={coin} />
            </TabsContent>
            
            <TabsContent value="bids" className="mt-6">
              <CoinBidHistory bids={validBids} />
            </TabsContent>
            
            <TabsContent value="authentication" className="mt-6">
              <CoinAuthenticationTab coin={coin} />
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              <CoinHistoryTab coin={{
                created_at: coin.created_at || new Date().toISOString(),
                ai_confidence: coin.ai_confidence
              }} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
