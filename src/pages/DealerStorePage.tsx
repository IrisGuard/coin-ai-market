
import React from 'react';
import { useParams } from 'react-router-dom';
import { useDealerStores } from '@/hooks/useDealerStores';
import { useDealerCoins } from '@/hooks/useDealerCoins';
import Navbar from '@/components/Navbar';
import OptimizedCoinCard from '@/components/OptimizedCoinCard';
import StoreRatingSystem from '@/components/marketplace/StoreRatingSystem';
import { Loader2, Store, Shield, Star, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mapSupabaseCoinToCoin } from '@/types/coin';
import { format } from 'date-fns';

const DealerStorePage = () => {
  const { dealerId } = useParams<{ dealerId: string }>();
  const { data: dealers, isLoading: dealersLoading } = useDealerStores();
  const { data: coins, isLoading: coinsLoading } = useDealerCoins(dealerId || '');

  const dealer = dealers?.find(d => d.profiles?.id === dealerId);
  const profile = dealer?.profiles;

  const formatCreatedDate = (dateString?: string) => {
    if (!dateString) return 'Recently created';
    try {
      return format(new Date(dateString), 'MMMM yyyy');
    } catch {
      return 'Recently created';
    }
  };

  if (dealersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            <span className="text-brand-medium">Loading dealer...</span>
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
            <h2 className="text-2xl font-bold text-brand-primary mb-4">Dealer Not Found</h2>
            <p className="text-brand-medium">The dealer you're looking for doesn't exist.</p>
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
          <Card className="border-2 border-electric-blue/20 bg-gradient-to-br from-white to-electric-blue/5 mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="w-24 h-24 border-2 border-electric-blue/30">
                  <AvatarImage src={profile?.avatar_url || dealer.logo_url} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-brand-primary to-electric-purple text-white">
                    {profile?.full_name?.[0] || dealer.name?.[0] || 'D'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-brand-primary">
                      {profile?.full_name || dealer.name}
                    </h1>
                    {profile?.verified_dealer && (
                      <Badge className="bg-gradient-to-r from-electric-blue to-electric-purple text-white border-0">
                        <Shield className="w-4 h-4 mr-1" />
                        Verified Dealer
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-brand-medium mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-electric-blue" />
                      <span>Created: {formatCreatedDate(dealer.created_at)}</span>
                    </div>
                    {dealer.address && typeof dealer.address === 'object' && dealer.address !== null && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-electric-purple" />
                        <span>{(dealer.address as any).city || 'Unknown Location'}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-electric-blue" />
                      <span>Not yet rated</span>
                    </div>
                  </div>
                  
                  {dealer.description && (
                    <p className="text-brand-primary max-w-3xl">{dealer.description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Store Content Tabs */}
          <Tabs defaultValue="coins" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-electric-blue/10 to-electric-purple/10">
              <TabsTrigger value="coins" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-primary data-[state=active]:to-electric-purple data-[state=active]:text-white">
                <Store className="w-4 h-4" />
                Available Coins ({coins?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-primary data-[state=active]:to-electric-purple data-[state=active]:text-white">
                <Star className="w-4 h-4" />
                Reviews & Ratings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="coins" className="mt-6">
              {coinsLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                    <span className="text-brand-medium">Loading coins...</span>
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
                <Card className="text-center py-16 border-2 border-electric-blue/20 bg-gradient-to-br from-white to-electric-blue/5">
                  <CardContent className="p-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-brand-primary to-electric-purple rounded-full flex items-center justify-center mx-auto mb-6">
                      <Store className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-brand-primary mb-2">This store doesn't have any coins listed yet</h3>
                    <p className="text-brand-medium">Please check back later for new additions.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <StoreRatingSystem
                storeId={dealerId || ''}
                averageRating={0}
                totalReviews={0}
                recentReviews={[]}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DealerStorePage;
