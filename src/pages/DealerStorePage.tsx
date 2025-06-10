
import React from 'react';
import { useParams } from 'react-router-dom';
import { useDealerStores } from '@/hooks/useDealerStores';
import { useDealerCoins } from '@/hooks/useDealerCoins';
import Navbar from '@/components/Navbar';
import OptimizedCoinCard from '@/components/OptimizedCoinCard';
import { Loader2, Store, Shield, Star, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mapSupabaseCoinToCoin } from '@/types/coin';

const DealerStorePage = () => {
  const { dealerId } = useParams<{ dealerId: string }>();
  const { data: dealers, isLoading: dealersLoading } = useDealerStores();
  const { data: coins, isLoading: coinsLoading } = useDealerCoins(dealerId || '');

  const dealer = dealers?.find(d => d.id === dealerId);
  const profile = dealer?.profiles?.[0];

  if (dealersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="text-gray-600">Loading dealer...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!dealer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Dealer Not Found</h2>
            <p className="text-gray-600">The dealer you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dealer Header */}
          <Card className="glass-card border-2 border-purple-200 mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile?.avatar_url || dealer.logo_url} />
                  <AvatarFallback className="text-2xl font-bold bg-purple-100">
                    {profile?.full_name?.[0] || dealer.name?.[0] || 'D'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-800">
                      {profile?.full_name || dealer.name}
                    </h1>
                    {profile?.verified_dealer && (
                      <Badge className="bg-blue-600 text-white">
                        <Shield className="w-4 h-4 mr-1" />
                        Verified Dealer
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    {dealer.address && typeof dealer.address === 'object' && dealer.address !== null && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{(dealer.address as any).city || 'Unknown Location'}</span>
                      </div>
                    )}
                    {profile?.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{Number(profile.rating).toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  
                  {dealer.description && (
                    <p className="text-gray-700 max-w-3xl">{dealer.description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coins Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Store className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">Available Coins</h2>
              <span className="text-gray-500">({coins?.length || 0} items)</span>
            </div>

            {coinsLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  <span className="text-gray-600">Loading coins...</span>
                </div>
              </div>
            ) : coins && coins.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {coins.map((rawCoin, index) => {
                  const coin = mapSupabaseCoinToCoin(rawCoin);
                  return (
                    <div key={coin.id} className="w-full">
                      <OptimizedCoinCard coin={coin} index={index} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Coins Available</h3>
                <p className="text-gray-600">This dealer hasn't listed any coins yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerStorePage;
