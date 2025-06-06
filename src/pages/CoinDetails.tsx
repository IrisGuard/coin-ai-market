
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Heart, Share2, Flag, Eye, Calendar, ShoppingCart, Gavel, Star, Shield, Award, TrendingUp, Clock, User, MapPin, DollarSign, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

const CoinDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [bidAmount, setBidAmount] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);

  // Fetch coin details with real data
  const { data: coin, isLoading: coinLoading, error: coinError } = useQuery({
    queryKey: ['coin', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles!coins_seller_id_fkey (
            id,
            username,
            avatar_url,
            verified_dealer,
            full_name,
            created_at,
            rating,
            name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Coin not found');

      // Update view count
      await supabase
        .from('coins')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id);

      return data;
    },
    enabled: !!id
  });

  // Fetch bids for auction coins
  const { data: bids = [], isLoading: bidsLoading } = useQuery({
    queryKey: ['coinBids', id],
    queryFn: async () => {
      if (!coin?.is_auction) return [];
      
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          profiles!bids_user_id_fkey (
            username,
            avatar_url,
            full_name,
            verified_dealer,
            name
          )
        `)
        .eq('coin_id', id)
        .order('amount', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!coin?.is_auction && !!id
  });

  // Fetch related coins
  const { data: relatedCoins = [] } = useQuery({
    queryKey: ['related-coins', coin?.year, coin?.country, coin?.id],
    queryFn: async () => {
      if (!coin) return [];
      
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .or(`year.eq.${coin.year},country.eq.${coin.country}`)
        .neq('id', coin.id)
        .eq('authentication_status', 'verified')
        .limit(6);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!coin
  });

  // Check if user has favorited this coin
  useEffect(() => {
    const checkFavorite = async () => {
      if (!user || !id) return;
      
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('coin_id', id)
        .single();
      
      setIsFavorited(!!data);
    };
    
    checkFavorite();
  }, [user, id]);

  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async () => {
      if (!coin || !user) throw new Error('Missing data');
      
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          coin_id: coin.id,
          buyer_id: user.id,
          seller_id: coin.seller_id,
          amount: coin.price,
          transaction_type: 'purchase',
          status: 'completed'
        });
      
      if (error) throw error;
      
      // Update coin as sold
      await supabase
        .from('coins')
        .update({ sold: true, sold_at: new Date().toISOString() })
        .eq('id', coin.id);
      
      return data;
    },
    onSuccess: () => {
      toast.success('Purchase successful!');
      queryClient.invalidateQueries({ queryKey: ['coin', id] });
      navigate('/marketplace');
    },
    onError: (error) => {
      toast.error('Purchase failed: ' + error.message);
    }
  });

  // Bid mutation
  const bidMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!coin || !user) throw new Error('Missing data');
      
      const { data, error } = await supabase
        .from('bids')
        .insert({
          coin_id: coin.id,
          user_id: user.id,
          amount: amount
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Bid placed successfully!');
      setBidAmount('');
      queryClient.invalidateQueries({ queryKey: ['coinBids', id] });
    },
    onError: (error) => {
      toast.error('Bid failed: ' + error.message);
    }
  });

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Please log in to favorite coins');
      return;
    }
    
    if (isFavorited) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('coin_id', id);
      setIsFavorited(false);
      toast.success('Removed from favorites');
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, coin_id: id });
      setIsFavorited(true);
      toast.success('Added to favorites');
    }
  };

  const handlePurchase = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to purchase');
      navigate('/auth');
      return;
    }
    
    if (user?.id === coin?.seller_id) {
      toast.error('You cannot purchase your own coin');
      return;
    }
    
    purchaseMutation.mutate();
  };

  const handleBid = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to bid');
      navigate('/auth');
      return;
    }
    
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid bid amount');
      return;
    }
    
    const highestBid = bids[0]?.amount || coin?.starting_bid || coin?.price;
    if (amount <= highestBid) {
      toast.error('Bid must be higher than current highest bid');
      return;
    }
    
    bidMutation.mutate(amount);
  };

  if (coinLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 rounded-3xl h-96"></div>
              <div className="space-y-4">
                <div className="bg-gray-200 rounded h-8 w-3/4"></div>
                <div className="bg-gray-200 rounded h-6 w-1/2"></div>
                <div className="bg-gray-200 rounded h-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Coin Not Found</h1>
          <p className="text-gray-600 mb-8">The coin you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/marketplace')} className="coinvision-button">
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const highestBid = bids[0]?.amount || coin.starting_bid || coin.price;
  const isOwner = user?.id === coin.seller_id;
  const sellerName = coin.profiles?.full_name || coin.profiles?.name || coin.profiles?.username || 'Unknown Seller';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
        >
          {/* Image Section */}
          <div className="space-y-6">
            <Card className="glass-card border-2 border-purple-200 overflow-hidden">
              <CardContent className="p-0">
                {coin.image ? (
                  <img 
                    src={coin.image}
                    alt={coin.name}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={toggleFavorite}
                className={`flex-1 ${isFavorited ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
              >
                <Heart className={`w-5 h-5 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? 'Favorited' : 'Add to Favorites'}
              </Button>
              
              <Button variant="outline" size="lg">
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
              
              <Button variant="outline" size="lg">
                <Flag className="w-5 h-5 mr-2" />
                Report
              </Button>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-purple-600 text-white">{coin.rarity}</Badge>
                <Badge variant="outline">{coin.grade}</Badge>
                {coin.featured && <Badge className="bg-yellow-500 text-white">Featured</Badge>}
                <div className="flex items-center text-gray-500 ml-auto">
                  <Eye className="w-4 h-4 mr-1" />
                  {coin.views || 0} views
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{coin.name}</h1>
              <p className="text-xl text-gray-600">{coin.year} • {coin.country}</p>
            </div>

            {/* Price & Purchase */}
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
                            onClick={handleBid}
                            disabled={bidMutation.isPending}
                            className="coinvision-button"
                          >
                            <Gavel className="w-4 h-4 mr-2" />
                            Place Bid
                          </Button>
                        </div>
                        
                        {bids.length > 0 && (
                          <div className="text-sm text-gray-600">
                            {bids.length} bid{bids.length !== 1 ? 's' : ''} • Ends in 2 days
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
                      <Button 
                        onClick={handlePurchase}
                        disabled={purchaseMutation.isPending}
                        className="w-full coinvision-button text-lg py-3"
                        size="lg"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Purchase Now
                      </Button>
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

            {/* Seller Info */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Seller Information
                </h3>
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={coin.profiles?.avatar_url} />
                    <AvatarFallback>{sellerName[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{sellerName}</span>
                      {coin.profiles?.verified_dealer && (
                        <Badge className="bg-blue-600 text-white">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Member since {new Date(coin.profiles?.created_at || coin.created_at).getFullYear()}</span>
                      {coin.profiles?.rating && (
                        <>
                          <span>•</span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                            {Number(coin.profiles.rating).toFixed(1)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coin Specifications */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="authentication">Authentication</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <Card className="glass-card">
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Denomination</span>
                        <div className="font-semibold">{coin.denomination || 'Not specified'}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Mint</span>
                        <div className="font-semibold">{coin.mint || 'Not specified'}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Composition</span>
                        <div className="font-semibold">{coin.composition || 'Not specified'}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Weight</span>
                        <div className="font-semibold">{coin.weight ? `${coin.weight}g` : 'Not specified'}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Diameter</span>
                        <div className="font-semibold">{coin.diameter ? `${coin.diameter}mm` : 'Not specified'}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Grade</span>
                        <div className="font-semibold">{coin.grade || 'Not graded'}</div>
                      </div>
                    </div>
                    
                    {coin.description && (
                      <div className="pt-4 border-t">
                        <span className="text-sm text-gray-600">Description</span>
                        <p className="mt-2 text-gray-800">{coin.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history">
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="font-semibold">Listed for sale</div>
                          <div className="text-sm text-gray-600">
                            {new Date(coin.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      {coin.ai_confidence && (
                        <div className="flex items-center gap-3">
                          <Zap className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-semibold">AI Verified</div>
                            <div className="text-sm text-gray-600">
                              {(coin.ai_confidence * 100).toFixed(1)}% confidence
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="authentication">
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-semibold">Authentication Status</div>
                          <Badge className={`mt-1 ${
                            coin.authentication_status === 'verified' ? 'bg-green-600 text-white' :
                            coin.authentication_status === 'rejected' ? 'bg-red-600 text-white' :
                            'bg-yellow-600 text-white'
                          }`}>
                            {coin.authentication_status === 'verified' ? 'Verified Authentic' :
                             coin.authentication_status === 'rejected' ? 'Authentication Failed' :
                             'Pending Authentication'}
                          </Badge>
                        </div>
                      </div>
                      
                      {coin.pcgs_number && (
                        <div>
                          <span className="text-sm text-gray-600">PCGS Number</span>
                          <div className="font-semibold">{coin.pcgs_number}</div>
                        </div>
                      )}
                      
                      {coin.ngc_number && (
                        <div>
                          <span className="text-sm text-gray-600">NGC Number</span>
                          <div className="font-semibold">{coin.ngc_number}</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>

        {/* Auction Bids */}
        {coin.is_auction && bids.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="w-5 h-5" />
                  Bid History ({bids.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bids.slice(0, 5).map((bid, index) => {
                    const bidderName = bid.profiles?.full_name || bid.profiles?.name || bid.profiles?.username || 'Anonymous';
                    return (
                      <div key={bid.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={bid.profiles?.avatar_url} />
                            <AvatarFallback>{bidderName[0]?.toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{bidderName}</div>
                            <div className="text-sm text-gray-600">
                              {new Date(bid.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">${Number(bid.amount).toFixed(2)}</div>
                          {index === 0 && <Badge className="bg-yellow-500 text-white">Highest Bid</Badge>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Related Coins */}
        {relatedCoins.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Related Coins</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCoins.map((relatedCoin) => (
                <Card 
                  key={relatedCoin.id} 
                  className="glass-card cursor-pointer hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate(`/coin/${relatedCoin.id}`)}
                >
                  <CardContent className="p-6">
                    <img 
                      src={relatedCoin.image || '/placeholder-coin.png'}
                      alt={relatedCoin.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-semibold text-lg mb-2">{relatedCoin.name}</h3>
                    <div className="flex justify-between items-center">
                      <Badge>{relatedCoin.year}</Badge>
                      <div className="text-lg font-bold text-green-600">${Number(relatedCoin.price).toFixed(2)}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CoinDetails;
