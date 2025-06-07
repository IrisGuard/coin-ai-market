
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Trophy, Eye, Clock, Star, Gavel } from 'lucide-react';

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

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

interface AuctionCardProps {
  auction: AuctionCoin;
  index: number;
  timeRemaining: TimeRemaining;
  isEndingSoon: boolean;
  isMyBid: boolean;
  bidAmount: string;
  setBidAmount: (amount: string) => void;
  placeBid: (auctionId: string) => void;
  addToWatchlist: (coinId: string) => void;
  userId?: string;
}

const AuctionCard = ({
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
}: AuctionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
    >
      <Card className={`hover:shadow-lg transition-shadow ${isEndingSoon ? 'ring-2 ring-red-200' : ''}`}>
        <CardContent className="p-4">
          {/* Auction Image */}
          <div className="relative mb-4">
            <Link to={`/coins/${auction.id}`}>
              <img 
                src={auction.image} 
                alt={auction.name}
                className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform"
              />
            </Link>
            
            {/* Status Badges */}
            <div className="absolute top-2 left-2">
              {isEndingSoon && (
                <Badge className="bg-red-100 text-red-800">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Ending Soon
                </Badge>
              )}
            </div>
            
            <div className="absolute top-2 right-2">
              {isMyBid && (
                <Badge className="bg-green-100 text-green-800">
                  <Trophy className="w-3 h-3 mr-1" />
                  Your Bid
                </Badge>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="absolute bottom-2 right-2 flex gap-2">
              <Button 
                size="sm" 
                variant="secondary"
                onClick={() => addToWatchlist(auction.id)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Auction Info */}
          <div className="space-y-3">
            <div>
              <Link to={`/coins/${auction.id}`}>
                <h3 className="font-semibold text-lg hover:text-brand-primary transition-colors truncate">
                  {auction.name}
                </h3>
              </Link>
              <p className="text-sm text-gray-600">{auction.year}</p>
            </div>

            {/* Countdown Timer */}
            {!timeRemaining.expired ? (
              <div className={`p-3 rounded-lg ${isEndingSoon ? 'bg-red-50' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Time Remaining:</span>
                  <Clock className={`w-4 h-4 ${isEndingSoon ? 'text-red-600' : 'text-gray-600'}`} />
                </div>
                <div className={`text-lg font-bold ${isEndingSoon ? 'text-red-600' : 'text-gray-900'}`}>
                  {timeRemaining.days > 0 && `${timeRemaining.days}d `}
                  {String(timeRemaining.hours).padStart(2, '0')}:
                  {String(timeRemaining.minutes).padStart(2, '0')}:
                  {String(timeRemaining.seconds).padStart(2, '0')}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-gray-100 rounded-lg text-center">
                <span className="text-gray-600 font-medium">Auction Ended</span>
              </div>
            )}

            {/* Bidding Info */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Bid:</span>
                <span className="text-xl font-bold text-green-600">${auction.current_bid}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Bids: {auction.bid_count}</span>
                <span className="text-gray-600">Watchers: {auction.watchers}</span>
              </div>

              {auction.reserve_price > auction.current_bid && (
                <div className="text-sm text-orange-600">
                  Reserve not met (${auction.reserve_price})
                </div>
              )}
            </div>

            {/* Seller Info */}
            {auction.profiles && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">{auction.profiles.name}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs">{auction.profiles.reputation}/100</span>
                    </div>
                    {auction.profiles.verified_dealer && (
                      <Badge variant="outline" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bidding Section */}
            {!timeRemaining.expired && auction.seller_id !== userId && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder={`Min: $${auction.current_bid + 1}`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => placeBid(auction.id)}
                    disabled={!bidAmount || parseFloat(bidAmount) <= auction.current_bid}
                    className="flex items-center gap-2"
                  >
                    <Gavel className="w-4 h-4" />
                    Bid
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500 text-center">
                  Next bid must be at least ${auction.current_bid + 1}
                </div>
              </div>
            )}

            {/* View Details Button */}
            <Link to={`/coins/${auction.id}`}>
              <Button variant="outline" className="w-full">
                View Full Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuctionCard;
