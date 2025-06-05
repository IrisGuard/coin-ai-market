
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCoinBids } from '@/hooks/useBids';
import TransakPaymentButton from '@/components/payment/TransakPaymentButton';
import { logErrorToSentry } from '@/lib/sentry';

const CoinDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch coin details with proper relations
  const { data: coin, isLoading } = useQuery({
    queryKey: ['coin', id],
    queryFn: async () => {
      if (!id) throw new Error('Coin ID is required');
      
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles!inner (
            id,
            name,
            email,
            avatar_url,
            verified_dealer
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch bids for this coin
  const { data: bids = [] } = useCoinBids(id || '');

  // Fetch related coins
  const { data: relatedCoins = [] } = useQuery({
    queryKey: ['related-coins', coin?.year, coin?.id],
    queryFn: async () => {
      if (!coin?.year || !coin?.id) return [];
      
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .eq('year', coin.year)
        .neq('id', coin.id)
        .eq('authentication_status', 'verified')
        .limit(4);

      if (error) {
        logErrorToSentry(error, { context: 'fetching related coins' });
        return [];
      }
      return data || [];
    },
    enabled: !!coin?.year && !!coin?.id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading coin details...</div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Coin not found</div>
      </div>
    );
  }

  const highestBid = bids.length > 0 ? bids[0] : null;
  const isOwner = user?.id === coin.user_id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Coin Image */}
        <Card className="p-6">
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
              <Badge
                variant={
                  coin.authentication_status === 'verified' ? 'default' :
                  coin.authentication_status === 'rejected' ? 'destructive' : 'secondary'
                }
              >
                {coin.authentication_status}
              </Badge>
            )}
          </div>
        </Card>

        {/* Coin Details */}
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-2">{coin.name}</h1>
          <div className="text-2xl font-semibold text-green-600 mb-4">
            ${Number(coin.price).toFixed(2)}
          </div>

          <Tabs defaultValue="details" className="mb-6">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="seller">Seller</TabsTrigger>
              {coin.is_auction && <TabsTrigger value="bids">Bids</TabsTrigger>}
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Country:</span>
                  <span className="ml-2">{coin.country || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium">Denomination:</span>
                  <span className="ml-2">{coin.denomination || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium">Composition:</span>
                  <span className="ml-2">{coin.composition || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium">Mint:</span>
                  <span className="ml-2">{coin.mint || 'N/A'}</span>
                </div>
                {coin.weight && (
                  <div>
                    <span className="font-medium">Weight:</span>
                    <span className="ml-2">{coin.weight}g</span>
                  </div>
                )}
                {coin.diameter && (
                  <div>
                    <span className="font-medium">Diameter:</span>
                    <span className="ml-2">{coin.diameter}mm</span>
                  </div>
                )}
              </div>
              {coin.description && (
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="mt-2 text-gray-600">{coin.description}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="seller">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={coin.profiles?.avatar_url || ''} />
                  <AvatarFallback>
                    {coin.profiles?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{coin.profiles?.name || 'Unknown Seller'}</h3>
                  <p className="text-sm text-gray-600">{coin.profiles?.email}</p>
                  {coin.profiles?.verified_dealer && (
                    <Badge variant="default" className="mt-1">Verified Dealer</Badge>
                  )}
                </div>
              </div>
            </TabsContent>

            {coin.is_auction && (
              <TabsContent value="bids">
                <div className="space-y-4">
                  {highestBid && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-medium text-green-800">Highest Bid</h3>
                      <p className="text-2xl font-bold text-green-600">
                        ${Number(highestBid.amount).toFixed(2)}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {bids.map((bid) => (
                      <div key={bid.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={bid.profiles?.avatar_url} />
                            <AvatarFallback>
                              {bid.profiles?.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span>{bid.profiles?.name || 'Anonymous'}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${Number(bid.amount).toFixed(2)}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(bid.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>

          {/* Payment Button */}
          {!isOwner && user && coin.authentication_status === 'verified' && (
            <div className="mt-6">
              <TransakPaymentButton
                coinId={coin.id}
                amount={Number(coin.price)}
                className="w-full"
              >
                Buy Now with Crypto
              </TransakPaymentButton>
            </div>
          )}
        </Card>
      </div>

      {/* Related Coins */}
      {relatedCoins.length > 0 && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Related Coins</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {relatedCoins.map((relatedCoin) => (
              <div key={relatedCoin.id} className="border rounded-lg p-4">
                <img
                  src={relatedCoin.image}
                  alt={relatedCoin.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <h3 className="font-medium text-sm">{relatedCoin.name}</h3>
                <p className="text-green-600 font-semibold">
                  ${Number(relatedCoin.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CoinDetails;
