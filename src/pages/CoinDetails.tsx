import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import CoinBidForm from '@/components/coin-details/CoinBidForm';
import { logError } from '@/utils/errorHandler';
import CoinViewer3D from '@/components/coin-details/CoinViewer3D';

const CoinDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [highestBid, setHighestBid] = useState<any>(null);

  // Fetch coin details
  const { data: coin, isLoading: coinLoading, error: coinError } = useQuery({
    queryKey: ['coin', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            avatar_url,
            verified_dealer,
            name,
            created_at
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        logError(error, 'CoinDetails: Failed to fetch coin');
        throw error;
      }
      
      if (!data) {
        throw new Error('Coin not found');
      }

      return data;
    },
    enabled: !!id
  });

  // Fetch bids for this coin
  const { data: bids = [], isLoading: bidsLoading } = useQuery({
    queryKey: ['coinBids', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          profiles!bids_user_id_fkey (
            avatar_url,
            name,
            verified_dealer
          )
        `)
        .eq('coin_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        logError(error, 'CoinDetails: Failed to fetch bids');
        throw error;
      }

      return data || [];
    },
    enabled: !!id
  });

  // Fetch related coins
  const { data: relatedCoins } = useQuery({
    queryKey: ['related-coins', coin?.year, coin?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .eq('year', coin?.year)
        .neq('id', coin?.id)
        .limit(4);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!coin?.year
  });

  if (coinLoading) {
    return <div className="container mx-auto px-4 py-8">Loading coin details...</div>;
  }

  if (!coin) {
    return <div className="container mx-auto px-4 py-8">Coin not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <img 
            src={coin.image} 
            alt={coin.name} 
            className="w-full h-auto rounded-lg mb-4"
          />
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline">{coin.year}</Badge>
            <Badge variant="outline">{coin.grade}</Badge>
            <Badge variant="outline">{coin.rarity}</Badge>
            {coin.authentication_status && (
              <Badge variant={
                coin.authentication_status === 'approved' ? 'default' :
                coin.authentication_status === 'rejected' ? 'destructive' : 'secondary'
              }>
                {coin.authentication_status}
              </Badge>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-2">{coin.name}</h1>
          <div className="text-2xl font-semibold text-green-600 mb-4">
            ${coin.price}
          </div>
          
          <Tabs defaultValue="details" className="mb-6">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <div>
                <h3 className="font-semibold">Description</h3>
                <p>{coin.description || "No description provided."}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Country</h3>
                  <p>{coin.country || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Denomination</h3>
                  <p>{coin.denomination || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Year</h3>
                  <p>{coin.year}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Grade</h3>
                  <p>{coin.grade}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="history">
              <p>Coin history and provenance information will be displayed here.</p>
            </TabsContent>
            <TabsContent value="authentication">
              <div className="space-y-2">
                <h3 className="font-semibold">Authentication Status</h3>
                <Badge variant={
                  coin.authentication_status === 'approved' ? 'default' :
                  coin.authentication_status === 'rejected' ? 'destructive' : 'secondary'
                } className="text-base py-1 px-2">
                  {coin.authentication_status || "Pending"}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  {coin.authentication_status === 'approved' 
                    ? "This coin has been verified by our authentication team." 
                    : coin.authentication_status === 'rejected'
                    ? "This coin did not pass our authentication process."
                    : "This coin is awaiting authentication by our team."}
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {user && user.id !== coin.user_id && !coin.is_auction && (
            <Button className="w-full">Purchase Now</Button>
          )}
          
          {user && user.id === coin.user_id && (
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">Edit Listing</Button>
              <Button variant="destructive" className="flex-1">Remove Listing</Button>
            </div>
          )}
        </div>
      </div>

      {/* Bidding Section */}
      {coin?.is_auction && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Current Bids</h2>
            <div className="text-lg font-bold text-green-600">
              Current High: ${highestBid?.amount || coin.reserve_price || 0}
            </div>
          </div>
          
          <div className="space-y-4">
            {bids?.map((bid) => (
              <div key={bid.id} className="border rounded-lg p-4">
                {bid.profiles && (
                  <div className="flex items-center mb-2">
                    {bid.profiles.avatar_url && (
                      <img
                        src={bid.profiles.avatar_url}
                        alt={bid.profiles.name || 'User'}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    )}
                    <div>
                      <span className="font-medium">
                        {bid.profiles.name || 'Anonymous'}
                      </span>
                      {bid.profiles.verified_dealer && (
                        <span className="ml-2 text-green-600 text-sm">✓ Verified</span>
                      )}
                    </div>
                  </div>
                )}
                <p className="text-sm text-gray-600">
                  Bid placed: {new Date(bid.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
          
          <CoinBidForm coinId={id!} currentHighBid={highestBid?.amount || 0} />
        </div>
      )}

      {/* Seller Profile */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={coin.profiles?.avatar_url || ''} />
            <AvatarFallback>{coin.profiles?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium flex items-center gap-2">
              {coin.profiles?.name || 'Unknown User'}
              {coin.profiles?.verified_dealer && (
                <Badge variant="default" className="ml-2">Verified Dealer</Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">Member since {new Date(coin.profiles?.created_at || Date.now()).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Related Coins */}
      {relatedCoins && relatedCoins.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Related Coins</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedCoins.map((relatedCoin) => (
              <Card key={relatedCoin.id}>
                <CardContent className="p-4">
                  <img 
                    src={relatedCoin.image} 
                    alt={relatedCoin.name} 
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-medium">{relatedCoin.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <Badge variant="outline">{relatedCoin.year}</Badge>
                    <span className="font-semibold">${relatedCoin.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinDetails;
