
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuctionData } from '@/hooks/useAuctionData';
import { useAuctionActions } from '@/hooks/useAuctionActions';
import { getTimeRemaining, filterAndSortAuctions } from '@/utils/auctionUtils';
import { AuctionCoin, TimeRemaining } from '@/types/auction';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuctionFilters from '@/components/auctions/AuctionFilters';
import AuctionStats from '@/components/auctions/AuctionStats';
import AuctionCard from '@/components/auctions/AuctionCard';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Gavel, Clock } from 'lucide-react';

type FilterStatus = 'all' | 'ending_soon' | 'just_started' | 'hot';
type SortBy = 'ending_soon' | 'highest_bid' | 'most_bids' | 'newest';

const Auctions = () => {
  const { user } = useAuth();
  const { auctions, myBids, isLoading } = useAuctionData(user?.id);
  const { bidAmounts, setBidAmounts, placeBid, addToWatchlist } = useAuctionActions(user?.id);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('ending_soon');

  // Filter auctions to show only auction-type listings
  const auctionListings = React.useMemo(() => {
    return auctions.filter((auction: AuctionCoin) => 
      auction.is_auction === true || auction.listing_type === 'auction'
    );
  }, [auctions]);

  const filteredAuctions = filterAndSortAuctions(auctionListings, searchTerm, filterStatus, sortBy);

  const auctionStats = {
    total: auctionListings.length,
    ending_soon: auctionListings.filter((auction: AuctionCoin) => {
      const timeLeft = getTimeRemaining(auction.auction_end);
      const hoursLeft = timeLeft.days * 24 + timeLeft.hours;
      return hoursLeft <= 24 && !timeLeft.expired;
    }).length,
    my_bids: myBids.length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Gavel className="w-8 h-8 text-orange-500" />
              Live Auctions
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bid on rare and collectible coins from verified dealers worldwide
            </p>
          </div>

          {/* Stats */}
          <AuctionStats stats={auctionStats} />

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search auctions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <AuctionFilters
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </div>
          </div>

          {/* Auctions Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : filteredAuctions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredAuctions.map((auction: AuctionCoin, index: number) => {
                const isMyBid = myBids.some(bid => bid.auction_id === auction.id);

                return (
                  <AuctionCard
                    key={auction.id}
                    auction={auction}
                    index={index}
                    isMyBid={isMyBid}
                    bidAmount={bidAmounts[auction.id] || ''}
                    setBidAmount={(amount: string) => setBidAmounts(prev => ({ ...prev, [auction.id]: amount }))}
                    placeBid={() => placeBid(auction.id, auctionListings)}
                    addToWatchlist={addToWatchlist}
                    userId={user?.id}
                  />
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Auctions</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'No auctions match your current filters' 
                    : 'There are no active auctions at the moment'}
                </p>
                <div className="flex justify-center gap-4">
                  {(searchTerm || filterStatus !== 'all') && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                  <a href="/marketplace">
                    <Button>Browse Direct Sales</Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Auctions;
