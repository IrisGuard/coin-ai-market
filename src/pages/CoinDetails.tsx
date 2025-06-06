
import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usePlaceBid } from '@/hooks/useBids';
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
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isBidding, setIsBidding] = useState(false);
  
  const placeBid = usePlaceBid();

  const { data: coin, isLoading, error } = useQuery({
    queryKey: ['coin', id],
    queryFn: async () => {
      if (!id) throw new Error('No coin ID provided');
      
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
      return data;
    },
    enabled: !!id,
  });

  // Separate query for bids to avoid relation issues
  const { data: bidsData } = useQuery({
    queryKey: ['coin-bids', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          profiles!bids_user_id_fkey (
            full_name,
            name,
            username,
            avatar_url
          )
        `)
        .eq('coin_id', id)
        .order('amount', { ascending: false });

      if (error) {
        console.error('Error fetching bids:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!id,
  });

  const { data: relatedCoins } = useQuery({
    queryKey: ['related-coins', coin?.rarity, coin?.country],
    queryFn: async () => {
      if (!coin) return [];
      
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .or(`rarity.eq.${coin.rarity},country.eq.${coin.country}`)
        .neq('id', coin.id)
        .limit(4);

      if (error) throw error;
      return data || [];
    },
    enabled: !!coin,
  });

  const toggleFavorite = async () => {
    if (!user || !coin) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add favorites",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('coin_id', coin.id);
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            coin_id: coin.id,
          });
      }
      
      setIsFavorited(!isFavorited);
      toast({
        title: isFavorited ? "Removed from Favorites" : "Added to Favorites",
        description: isFavorited ? "Coin removed from your favorites" : "Coin added to your favorites",
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    }
  };

  const handlePurchase = async () => {
    if (!user || !coin) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a purchase",
        variant: "destructive",
      });
      return;
    }

    setIsPurchasing(true);
    try {
      // Add purchase logic here
      toast({
        title: "Purchase Initiated",
        description: "Processing your purchase...",
      });
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleBid = async () => {
    if (!user || !coin || !bidAmount) {
      toast({
        title: "Invalid Bid",
        description: "Please enter a valid bid amount",
        variant: "destructive",
      });
      return;
    }

    setIsBidding(true);
    try {
      await placeBid.mutateAsync({ 
        coinId: coin.id, 
        amount: parseFloat(bidAmount) 
      });
      setBidAmount('');
    } catch (error) {
      console.error('Bid error:', error);
    } finally {
      setIsBidding(false);
    }
  };

  if (!id) {
    return <Navigate to="/marketplace" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading coin details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-gray-600">Coin not found</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle profile data - extract first profile from array if it exists
  const profile = coin.profiles && Array.isArray(coin.profiles) ? coin.profiles[0] : coin.profiles;
  const isOwner = user?.id === coin.user_id;
  const bids = bidsData?.filter(bid => bid.profiles) || [];
  const highestBid = Math.max(...bids.map(bid => bid.amount), coin.starting_bid || coin.price || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Left Column - Image */}
            <div className="space-y-6">
              <CoinImage coin={coin} />
              <CoinActionButtons 
                isFavorited={isFavorited} 
                onToggleFavorite={toggleFavorite} 
              />
            </div>

            {/* Right Column - Details */}
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
                isPurchasing={isPurchasing}
                isBidding={isBidding}
                bidsCount={bids.length}
              />
              {profile && (
                <CoinSellerInfo 
                  seller={profile} 
                  coinCreatedAt={coin.created_at} 
                />
              )}
            </div>
          </div>

          {/* Tabs Section */}
          <Card className="glass-card border-2 border-purple-200">
            <CardContent className="p-6">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="bids">Bid History</TabsTrigger>
                  <TabsTrigger value="authentication">Authentication</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="mt-6">
                  <CoinDetailsTab coin={coin} />
                </TabsContent>
                
                <TabsContent value="bids" className="mt-6">
                  <CoinBidHistory bids={bids} />
                </TabsContent>
                
                <TabsContent value="authentication" className="mt-6">
                  <CoinAuthenticationTab coin={coin} />
                </TabsContent>
                
                <TabsContent value="history" className="mt-6">
                  <CoinHistoryTab coin={coin} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Related Coins */}
          {relatedCoins && relatedCoins.length > 0 && (
            <div className="mt-12">
              <RelatedCoins relatedCoins={relatedCoins} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoinDetails;
