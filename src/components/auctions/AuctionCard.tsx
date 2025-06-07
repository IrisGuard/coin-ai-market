
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useAuctionTimer } from '@/hooks/useAuctionTimer';
import { TimeRemaining } from '@/types/auction';
import AuctionCardImage from './AuctionCardImage';
import AuctionCardTimer from './AuctionCardTimer';
import AuctionCardInfo from './AuctionCardInfo';
import AuctionCardBidding from './AuctionCardBidding';

interface AuctionCoin {
  id: string;
  name: string;
  year: number;
  image: string;
  current_bid: number;
  reserve_price: number;
  auction_end: string;
  bid_count: number;
  seller_id: string;
  highest_bidder_id: string | null;
  watchers: number;
  profiles?: {
    name: string;
    reputation: number;
    verified_dealer: boolean;
  };
}

interface AuctionCardProps {
  auction: AuctionCoin;
  index?: number;
  isMyBid: boolean;
  bidAmount: string;
  setBidAmount: (amount: string) => void;
  placeBid: (auctionId: string) => void;
  addToWatchlist: (coinId: string) => void;
  userId?: string;
}

const AuctionCard = ({
  auction,
  index = 0,
  isMyBid,
  bidAmount,
  setBidAmount,
  placeBid,
  addToWatchlist,
  userId
}: AuctionCardProps) => {
  const timeRemaining = useAuctionTimer(auction.auction_end);
  const isEndingSoon = timeRemaining.days === 0 && timeRemaining.hours <= 24;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
    >
      <Card className={`hover:shadow-lg transition-shadow ${isEndingSoon ? 'ring-2 ring-red-200' : ''}`}>
        <CardContent className="p-4">
          <AuctionCardImage
            auction={auction}
            isEndingSoon={isEndingSoon}
            isMyBid={isMyBid}
            addToWatchlist={addToWatchlist}
          />

          <AuctionCardTimer
            timeRemaining={timeRemaining}
            isEndingSoon={isEndingSoon}
          />

          <div className="mt-3">
            <AuctionCardInfo auction={auction} />
          </div>

          <div className="mt-3">
            <AuctionCardBidding
              auction={auction}
              timeRemaining={timeRemaining}
              bidAmount={bidAmount}
              setBidAmount={setBidAmount}
              placeBid={placeBid}
              userId={userId}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuctionCard;
