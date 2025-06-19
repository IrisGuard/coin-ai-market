
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { usePageView } from '@/hooks/usePageView';
import { useAuction } from '@/hooks/useAuction';
import { useBidding } from '@/hooks/useBidding';
import AuctionStats from '@/components/auctions/AuctionStats';
import AuctionFilters from '@/components/auctions/AuctionFilters';
import AuctionCard from '@/components/auctions/AuctionCard';
import BiddingInterface from '@/components/auctions/BiddingInterface';
import BidHistory from '@/components/auctions/BidHistory';
import AuctionTimer from '@/components/auctions/AuctionTimer';
import { AuctionListing, AuctionFilters as FilterType } from '@/types/auctionTypes';

const Auctions = () => {
  usePageView();
  const { user } = useAuth();
  const { auctions, auctionsLoading } = useAuction();
  const { auctionStats, userBids } = useBidding();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterType>({});
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null);

  // Filter and sort auctions
  const filteredAuctions = useMemo(() => {
    if (!auctions) return [];
    
    let filtered = [...auctions];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(auction =>
        auction.coins?.name?.toLowerCase().includes(searchLower) ||
        auction.coins?.description?.toLowerCase().includes(searchLower) ||
        auction.coins?.country?.toLowerCase().includes(searchLower)
      );
    }

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(auction => auction.coins?.category === filters.category);
    }

    if (filters.min_price) {
      filtered = filtered.filter(auction => auction.current_price >= filters.min_price!);
    }

    if (filters.max_price) {
      filtered = filtered.filter(auction => auction.current_price <= filters.max_price!);
    }

    if (filters.ending_soon) {
      const oneDayFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      filtered = filtered.filter(auction => new Date(auction.ends_at) <= oneDayFromNow);
    }

    if (filters.has_reserve) {
      filtered = filtered.filter(auction => !!auction.reserve_price);
    }

    if (filters.has_buyout) {
      filtered = filtered.filter(auction => !!auction.buyout_price);
    }

    if (filters.condition && filters.condition.length > 0) {
      filtered = filtered.filter(auction => 
        auction.coins?.condition && filters.condition!.includes(auction.coins.condition)
      );
    }

    // Apply sorting
    switch (filters.sort_by) {
      case 'ending_soon':
        filtered.sort((a, b) => new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime());
        break;
      case 'price_low':
        filtered.sort((a, b) => a.current_price - b.current_price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.current_price - a.current_price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default:
        filtered.sort((a, b) => new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime());
    }

    return filtered;
  }, [auctions, searchTerm, filters]);

  if (auctionsLoading) {
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

  const selectedAuctionData = selectedAuction 
    ? auctions?.find(a => a.id === selectedAuction) 
    : null;

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Coin Auctions</h1>
          <p className="text-gray-600">Real-time bidding on authenticated coins from verified dealers</p>
        </motion.div>

        {/* Auction Stats */}
        {auctionStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AuctionStats
              endingSoonCount={auctionStats.ending_soon}
              hotAuctionsCount={auctionStats.active_auctions}
              totalValue={auctionStats.total_value}
              userBidsCount={userBids?.length || 0}
            />
          </motion.div>
        )}

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
            filterStatus={filters.ending_soon ? 'ending_soon' : 'all'}
            setFilterStatus={(status) => setFilters(prev => ({ 
              ...prev, 
              ending_soon: status === 'ending_soon' 
            }))}
            sortBy={filters.sort_by || 'ending_soon'}
            setSortBy={(sortBy) => setFilters(prev => ({ ...prev, sort_by: sortBy }))}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Auctions List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {filteredAuctions.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">No auctions found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or check back later</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredAuctions.map((auction, index) => (
                    <div
                      key={auction.id}
                      className={`cursor-pointer transition-all ${
                        selectedAuction === auction.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedAuction(auction.id)}
                    >
                      <AuctionCard
                        auction={auction}
                        index={index}
                        timeRemaining={{
                          days: 0,
                          hours: 0, 
                          minutes: 0,
                          expired: new Date(auction.ends_at) <= new Date()
                        }}
                        isEndingSoon={new Date(auction.ends_at).getTime() - Date.now() <= 24 * 60 * 60 * 1000}
                        isMyBid={userBids?.some(bid => 
                          bid.marketplace_listings?.id === auction.id && 
                          bid.bidder_id === user?.id
                        ) || false}
                        bidAmount=""
                        setBidAmount={() => {}}
                        placeBid={() => {}}
                        addToWatchlist={() => {}}
                        userId={user?.id}
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Auction Details Sidebar */}
          <div className="space-y-6">
            {selectedAuctionData ? (
              <>
                {/* Auction Timer */}
                <div className="bg-white rounded-lg p-6">
                  <AuctionTimer 
                    endTime={selectedAuctionData.ends_at}
                    variant="large"
                  />
                </div>

                {/* Bidding Interface */}
                <BiddingInterface
                  auction={selectedAuctionData}
                  currentUserBid={userBids?.find(bid => 
                    bid.marketplace_listings?.id === selectedAuctionData.id &&
                    bid.bidder_id === user?.id
                  )?.amount}
                  isHighestBidder={userBids?.some(bid => 
                    bid.marketplace_listings?.id === selectedAuctionData.id &&
                    bid.bidder_id === user?.id &&
                    bid.is_winning
                  )}
                />

                {/* Bid History */}
                <BidHistory auctionId={selectedAuctionData.id} />
              </>
            ) : (
              <div className="bg-white rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Select an Auction</h3>
                <p className="text-gray-600">Click on any auction to view details and place bids</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auctions;
