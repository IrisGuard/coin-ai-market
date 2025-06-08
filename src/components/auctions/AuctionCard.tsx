
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface AuctionCardProps {
  auction: any;
  index: number;
  timeRemaining: any;
  isEndingSoon: boolean;
  isMyBid: boolean;
  bidAmount: string;
  setBidAmount: (amount: string) => void;
  placeBid: (auctionId: string) => void;
  addToWatchlist: () => void;
  userId?: string;
}

const AuctionCard: React.FC<AuctionCardProps> = ({
  auction,
  index,
  timeRemaining,
  isEndingSoon,
  isMyBid,
  bidAmount,
  setBidAmount,
  placeBid,
  addToWatchlist,
  userId
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">Auction Item #{auction.id}</h3>
            <p className="text-gray-600 mb-4">
              Time remaining: {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
            </p>
            <div className="text-2xl font-bold text-green-600 mb-4">
              Current Bid: ${auction.current_bid || 0}
            </div>
            {isEndingSoon && (
              <div className="text-red-600 font-semibold mb-2">Ending Soon!</div>
            )}
            {isMyBid && (
              <div className="text-blue-600 font-semibold mb-2">You're the highest bidder!</div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuctionCard;
