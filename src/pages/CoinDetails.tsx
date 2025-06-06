
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CoinHeader from '@/components/coin-details/CoinHeader';
import CoinImage from '@/components/coin-details/CoinImage';
import CoinActionButtons from '@/components/coin-details/CoinActionButtons';
import CoinPriceSection from '@/components/coin-details/CoinPriceSection';
import CoinSellerInfo from '@/components/coin-details/CoinSellerInfo';
import CoinDetailsTab from '@/components/coin-details/CoinDetailsTab';
import CoinHistoryTab from '@/components/coin-details/CoinHistoryTab';
import CoinAuthenticationTab from '@/components/coin-details/CoinAuthenticationTab';
import CoinBidHistory from '@/components/coin-details/CoinBidHistory';
import RelatedCoins from '@/components/coin-details/RelatedCoins';

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
          <button onClick={() => navigate('/marketplace')} className="coinvision-button">
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const highestBid = bids[0]?.amount || coin.starting_bid || coin.price;
  const isOwner = user?.id === coin.seller_id;

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
            <CoinImage coin={coin} />
            <CoinActionButtons 
              isFavorited={isFavorited}
              onToggleFavorite={toggleFavorite}
            />
          </div>

          {/* Details Section */}
          <div className="space-y-8">
            <CoinHeader coin={coin} />

            <CoinPriceSection
              coin={coin}
              highestBid={highestBid}
              bidAmount={bidAmount}
              setBidAmount={setBidAmount}
              onPurchase={handlePurchase}
              onBid={handleBid}
              isOwner={isOwner}
              isPurchasing={purchaseMutation.isPending}
              isBidding={bidMutation.isPending}
              bidsCount={bids.length}
            />

            <CoinSellerInfo 
              seller={coin.profiles}
              coinCreatedAt={coin.created_at}
            />

            {/* Coin Specifications */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="authentication">Authentication</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <CoinDetailsTab coin={coin} />
              </TabsContent>
              
              <TabsContent value="history">
                <CoinHistoryTab coin={coin} />
              </TabsContent>
              
              <TabsContent value="authentication">
                <CoinAuthenticationTab coin={coin} />
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
            <CoinBidHistory bids={bids} />
          </motion.div>
        )}

        {/* Related Coins */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <RelatedCoins relatedCoins={relatedCoins} />
        </motion.div>
      </div>
    </div>
  );
};

export default CoinDetails;
