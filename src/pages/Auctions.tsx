import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { usePageView } from '@/hooks/usePageView';
import { useAuctionDataMock } from '@/hooks/useAuctionDataMock';
import { useAuctionActions } from '@/hooks/useAuctionActions';
import { filterAndSortAuctions, getTimeRemaining } from '@/utils/auctionUtils';
import AuctionStats from '@/components/auctions/AuctionStats';
import AuctionFilters from '@/components/auctions/AuctionFilters';
import AuctionCard from '@/components/auctions/AuctionCard';

const Auctions = () => {
  usePageView();
  const { user } = useAuth();
  const { auctions, myBids, isLoading } = useAuctionDataMock(user?.id);
  const { bidAmounts, setBidAmounts, placeBid, addToWatchlist } = useAuctionActions(user?.id);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ending_soon' | 'just_started' | 'hot'>('all');
  const [sortBy, setSortBy] = useState<'ending_soon' | 'highest_bid' | 'most_bids' | 'newest'>('ending_soon');

  // Filter and sort auctions
  const filteredAuctions = useMemo(() => {
    return filterAndSortAuctions(auctions, searchTerm, filterStatus, sortBy);
  }, [auctions, searchTerm, filterStatus, sortBy]);

  // Calculate stats with proper handling of missing properties
  const endingSoonCount = auctions.filter(auction => {
    const now = new Date().getTime();
    const end = new Date(auction.auction_end).getTime();
    const hoursRemaining = (end - now) / (1000 * 60 * 60);
    return hoursRemaining <= 24 && hoursRemaining > 0;
  }).length;

  // For hot auctions, we'll use views as a proxy since bid_count/watchers don't exist
  const hotAuctionsCount = auctions.filter(auction => {
    const views = auction.views || 0;
    return views >= 100; // Consider coins with 100+ views as "hot"
  }).length;

  // Calculate total value using price since current_bid doesn't exist
  const totalValue = auctions.reduce((sum, auction) => {
    const value = auction.price || auction.starting_bid || 0;
    return sum + value;
  }, 0);
  
  const userBidsCount = myBids.length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Coin Auctions</h1>
          <p className="text-gray-600">Active auctions from verified dealers on the platform</p>
        </motion.div>

        {/* Auction Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AuctionStats
            endingSoonCount={endingSoonCount}
            hotAuctionsCount={hotAuctionsCount}
            totalValue={totalValue}
            userBidsCount={userBidsCount}
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
          transition={{ delay: 0.3 }}
        >
          {filteredAuctions.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No auctions found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAuctions.map((auction, index) => {
                const timeRemaining = getTimeRemaining(auction.auction_end);
                const isEndingSoon = timeRemaining.days === 0 && timeRemaining.hours <= 24;
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
                    placeBid={(auctionId) => placeBid(auctionId, auctions)}
                    addToWatchlist={() => addToWatchlist(auction.id)}
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
