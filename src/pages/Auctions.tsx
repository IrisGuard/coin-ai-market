
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Gavel, Trophy, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { usePageView } from '@/hooks/usePageView';
import AuctionStats from '@/components/auctions/AuctionStats';
import AuctionFilters from '@/components/auctions/AuctionFilters';
import AuctionCard from '@/components/auctions/AuctionCard';
import { useAuctionData } from '@/hooks/useAuctionData';
import { useAuctionActions } from '@/hooks/useAuctionActions';
import { getTimeRemaining, filterAndSortAuctions } from '@/utils/auctionUtils';

const Auctions = () => {
  usePageView();
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ending_soon' | 'just_started' | 'hot'>('all');
  const [sortBy, setSortBy] = useState<'ending_soon' | 'highest_bid' | 'most_bids' | 'newest'>('ending_soon');

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const { auctions, myBids, isLoading } = useAuctionData(user?.id);
  const { bidAmounts, setBidAmounts, placeBid, addToWatchlist } = useAuctionActions(user?.id);

  // Filter and sort auctions
  const filteredAuctions = useMemo(() => {
    return filterAndSortAuctions(auctions, searchTerm, filterStatus, sortBy);
  }, [auctions, searchTerm, filterStatus, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const endingSoonCount = auctions.filter(a => {
      const time = getTimeRemaining(a.auction_end);
      return !time.expired && (time.days * 24 + time.hours) <= 24;
    }).length;
    
    const hotAuctionsCount = auctions.filter(a => a.bid_count >= 5).length;
    const totalValue = auctions.reduce((sum, a) => sum + a.current_bid, 0);

    return {
      endingSoonCount,
      hotAuctionsCount,
      totalValue,
      userBidsCount: myBids.length
    };
  }, [auctions, myBids]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Auctions Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full border border-yellow-200 mb-6">
              <Gavel className="w-5 h-5 mr-3 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-800">Live Auctions</span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">🔥 Live Coin Auctions</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bid on authenticated coins from verified dealers. Real-time bidding with instant notifications.
            </p>
          </div>

          <AuctionStats {...stats} />
        </motion.div>

        {/* My Active Bids Alert */}
        {myBids.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Alert>
              <Trophy className="h-4 w-4" />
              <AlertDescription>
                You have {myBids.length} active bid{myBids.length !== 1 ? 's' : ''}. 
                <Link to="/portfolio" className="ml-2 text-brand-primary hover:underline">
                  View all your bids →
                </Link>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <AuctionFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </motion.div>

        {/* Auctions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {filteredAuctions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Gavel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Auctions</h3>
                <p className="text-gray-600 mb-4">Check back later for new auctions or adjust your filters.</p>
                <Link to="/marketplace">
                  <Button>Browse Marketplace</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAuctions.map((auction, index) => {
                const timeRemaining = getTimeRemaining(auction.auction_end);
                const isEndingSoon = !timeRemaining.expired && (timeRemaining.days * 24 + timeRemaining.hours) <= 24;
                const isMyBid = auction.highest_bidder_id === user?.id;

                return (
                  <AuctionCard
                    key={auction.id}
                    auction={auction}
                    index={index}
                    timeRemaining={timeRemaining}
                    isEndingSoon={isEndingSoon}
                    isMyBid={isMyBid}
                    bidAmount={bidAmounts[auction.id] || ''}
                    setBidAmount={(amount) => setBidAmounts(prev => ({ ...prev, [auction.id]: amount }))}
                    placeBid={() => placeBid(auction.id, auctions)}
                    addToWatchlist={addToWatchlist}
                    userId={user?.id}
                  />
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Auctions;
