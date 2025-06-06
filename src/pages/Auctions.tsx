import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Clock, Gavel, TrendingUp, Users, DollarSign, Star, Eye, Heart, Filter, Search, Timer, AlertCircle, CheckCircle, Trophy, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { usePageView } from '@/hooks/usePageView';

interface AuctionCoin {
  id: string;
  name: string;
  year: number;
  image: string;
  starting_price: number;
  current_bid: number;
  reserve_price: number;
  auction_end: string;
  bid_count: number;
  rarity: string;
  condition: string;
  country: string;
  seller_id: string;
  highest_bidder_id: string | null;
  description: string;
  views: number;
  watchers: number;
  profiles: {
    name: string;
    reputation: number;
    verified_dealer: boolean;
  };
}

interface Bid {
  id: string;
  auction_id: string;
  bidder_id: string;
  amount: number;
  created_at: string;
  profiles?: {
    name: string;
  };
}

const Auctions = () => {
  usePageView();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [auctions, setAuctions] = useState<AuctionCoin[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ending_soon' | 'just_started' | 'hot'>('all');
  const [sortBy, setSortBy] = useState<'ending_soon' | 'highest_bid' | 'most_bids' | 'newest'>('ending_soon');
  const [bidAmounts, setBidAmounts] = useState<Record<string, string>>({});

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Fetch auctions and user bids
  useEffect(() => {
    const fetchAuctionsData = async () => {
      setIsLoading(true);
      try {
        // Fetch active auctions
        const { data: auctionsData, error: auctionsError } = await supabase
          .from('coins')
          .select(`
            id,
            name,
            year,
            image,
            price,
            reserve_price,
            auction_end,
            rarity,
            condition,
            country,
            user_id,
            description,
            views,
            profiles!coins_user_id_fkey(
              name,
              reputation,
              verified_dealer
            )
          `)
          .eq('is_auction', true)
          .gt('auction_end', new Date().toISOString())
          .order('auction_end', { ascending: true });

        if (auctionsError) throw auctionsError;

        // Fetch bid counts and current bids for each auction
        const auctionsWithBids = await Promise.all(
          (auctionsData || []).map(async (auction) => {
            const { data: bids } = await supabase
              .from('auction_bids')
              .select('amount, bidder_id')
              .eq('auction_id', auction.id)
              .order('amount', { ascending: false });

            const { count: bidCount } = await supabase
              .from('auction_bids')
              .select('*', { count: 'exact', head: true })
              .eq('auction_id', auction.id);

            const { count: watcherCount } = await supabase
              .from('watchlist')
              .select('*', { count: 'exact', head: true })
              .eq('listing_id', auction.id);

            const currentBid = bids?.[0]?.amount || auction.price;
            const highestBidderId = bids?.[0]?.bidder_id || null;

            return {
              ...auction,
              starting_price: auction.price,
              current_bid: currentBid,
              bid_count: bidCount || 0,
              highest_bidder_id: highestBidderId,
              seller_id: auction.user_id,
              watchers: watcherCount || 0
            };
          })
        );

        setAuctions(auctionsWithBids);

        // Fetch user's bids if authenticated
        if (user?.id) {
          const { data: userBids } = await supabase
            .from('auction_bids')
            .select(`
              *,
              profiles!auction_bids_bidder_id_fkey(name)
            `)
            .eq('bidder_id', user.id)
            .order('created_at', { ascending: false });

          // Filter out any invalid bids and ensure proper typing
          const validBids = (userBids || []).filter(bid => bid && bid.profiles) as Bid[];
          setMyBids(validBids);
        }

      } catch (error) {
        console.error('Error fetching auctions:', error);
        toast({
          title: "Error",
          description: "Failed to load auctions data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctionsData();
    
    // Set up real-time subscription for auction updates
    const channel = supabase
      .channel('auction_updates')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'auction_bids' },
        (payload) => {
          // Update auction with new bid
          setAuctions(prev => prev.map(auction => {
            if (auction.id === payload.new.auction_id) {
              return {
                ...auction,
                current_bid: payload.new.amount,
                bid_count: auction.bid_count + 1,
                highest_bidder_id: payload.new.bidder_id
              };
            }
            return auction;
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, toast]);

  // Calculate time remaining for each auction
  const getTimeRemaining = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const remaining = end - now;

    if (remaining <= 0) return { expired: true };

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, expired: false };
  };

  // Filter and sort auctions
  const filteredAuctions = useMemo(() => {
    return auctions
      .filter(auction => {
        const matchesSearch = auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            auction.country.toLowerCase().includes(searchTerm.toLowerCase());
        
        const timeRemaining = getTimeRemaining(auction.auction_end);
        const hoursRemaining = timeRemaining.days * 24 + timeRemaining.hours;
        
        let matchesFilter = true;
        switch (filterStatus) {
          case 'ending_soon':
            matchesFilter = hoursRemaining <= 24;
            break;
          case 'just_started':
            matchesFilter = auction.bid_count <= 2;
            break;
          case 'hot':
            matchesFilter = auction.bid_count >= 5 || auction.watchers >= 10;
            break;
        }

        return matchesSearch && matchesFilter && !timeRemaining.expired;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'highest_bid':
            return b.current_bid - a.current_bid;
          case 'most_bids':
            return b.bid_count - a.bid_count;
          case 'newest':
            return new Date(b.auction_end).getTime() - new Date(a.auction_end).getTime();
          default: // ending_soon
            return new Date(a.auction_end).getTime() - new Date(b.auction_end).getTime();
        }
      });
  }, [auctions, searchTerm, filterStatus, sortBy]);

  // Place bid function
  const placeBid = async (auctionId: string) => {
    const bidAmount = parseFloat(bidAmounts[auctionId] || '0');
    const auction = auctions.find(a => a.id === auctionId);
    
    if (!auction || !user?.id) return;

    if (bidAmount <= auction.current_bid) {
      toast({
        title: "Invalid Bid",
        description: `Bid must be higher than current bid of $${auction.current_bid}`,
        variant: "destructive"
      });
      return;
    }

    if (auction.seller_id === user.id) {
      toast({
        title: "Error",
        description: "You cannot bid on your own auction",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('auction_bids')
        .insert({
          auction_id: auctionId,
          bidder_id: user.id,
          amount: bidAmount
        });

      if (error) throw error;

      toast({
        title: "Bid Placed!",
        description: `Your bid of $${bidAmount} has been placed successfully`,
      });

      setBidAmounts(prev => ({ ...prev, [auctionId]: '' }));

    } catch (error) {
      console.error('Error placing bid:', error);
      toast({
        title: "Error",
        description: "Failed to place bid. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Add to watchlist
  const addToWatchlist = async (coinId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('watchlist')
        .insert({
          user_id: user.id,
          listing_id: coinId
        });

      if (error) throw error;

      toast({
        title: "Added to Watchlist",
        description: "You'll be notified of updates on this auction"
      });

    } catch (error) {
      console.error('Error adding to watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to add to watchlist",
        variant: "destructive"
      });
    }
  };

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

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Timer className="w-6 h-6 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold">{auctions.filter(a => {
                  const time = getTimeRemaining(a.auction_end);
                  return !time.expired && (time.days * 24 + time.hours) <= 24;
                }).length}</div>
                <div className="text-sm text-gray-600">Ending Soon</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">{auctions.filter(a => a.bid_count >= 5).length}</div>
                <div className="text-sm text-gray-600">Hot Auctions</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">
                  ${auctions.reduce((sum, a) => sum + a.current_bid, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">{myBids.length}</div>
                <div className="text-sm text-gray-600">My Active Bids</div>
              </CardContent>
            </Card>
          </div>
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
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search auctions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Auctions</SelectItem>
                    <SelectItem value="ending_soon">Ending Soon</SelectItem>
                    <SelectItem value="just_started">Just Started</SelectItem>
                    <SelectItem value="hot">Hot Auctions</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ending_soon">Ending Soon</SelectItem>
                    <SelectItem value="highest_bid">Highest Bid</SelectItem>
                    <SelectItem value="most_bids">Most Bids</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
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
                  <motion.div
                    key={auction.id}
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
                            <p className="text-sm text-gray-600">{auction.year} • {auction.country}</p>
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
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{auction.profiles?.name}</p>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-500" />
                                  <span className="text-xs">{auction.profiles?.reputation}/100</span>
                                </div>
                                {auction.profiles?.verified_dealer && (
                                  <Badge variant="outline" className="text-xs">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Bidding Section */}
                          {!timeRemaining.expired && auction.seller_id !== user?.id && (
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  placeholder={`Min: $${auction.current_bid + 1}`}
                                  value={bidAmounts[auction.id] || ''}
                                  onChange={(e) => setBidAmounts(prev => ({
                                    ...prev,
                                    [auction.id]: e.target.value
                                  }))}
                                  className="flex-1"
                                />
                                <Button 
                                  onClick={() => placeBid(auction.id)}
                                  disabled={!bidAmounts[auction.id] || parseFloat(bidAmounts[auction.id]) <= auction.current_bid}
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
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Auctions;
