import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Star, Clock, Sparkles } from 'lucide-react';
import CoinCard from './CoinCard';
import { useCoins } from '@/hooks/useCoins';

const DiscoveryFeed = () => {
  const { data: coins, isLoading } = useCoins();
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    if (coins) {
      // Generate personalized recommendations from real coins
      const featured = coins.slice(0, 6).map(coin => ({
        id: coin.id,
        title: coin.name || 'Unknown Coin',
        price: coin.price || 0,
        condition: coin.grade || 'Ungraded',
        year: coin.year || new Date().getFullYear(),
        country: coin.country || 'Unknown',
        image: coin.image, // Fix: use 'image' instead of 'image_url'
        featured: true
      }));
      setRecommendations(featured);
    }
  }, [coins]);

  const handleViewDetails = (coinId: string) => {
    window.location.href = `/coin/${coinId}`;
  };

  const handleAddToWatchlist = (coinId: string) => {
    console.log('Adding to watchlist:', coinId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Discover Coins
            <Badge variant="outline">Personalized</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recommended" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="recommended" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                For You
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recently Added
              </TabsTrigger>
              <TabsTrigger value="featured" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Featured
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recommended" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recommended for You</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.map((coin) => (
                    <CoinCard
                      key={coin.id}
                      coin={coin}
                      onView={handleViewDetails}
                      onFavorite={handleAddToWatchlist}
                    />
                  ))}
                </div>
                
                {recommendations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No recommendations available at the moment.</p>
                    <p className="text-sm">Browse our marketplace to get personalized suggestions!</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="trending" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Trending Coins</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.slice(0, 3).map((coin) => (
                    <CoinCard
                      key={coin.id}
                      coin={coin}
                      onView={handleViewDetails}
                      onFavorite={handleAddToWatchlist}
                    />
                  ))}
                </div>
                
                {recommendations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No trending coins available right now.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="recent" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recently Added</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.slice(0, 4).map((coin) => (
                    <CoinCard
                      key={coin.id}
                      coin={coin}
                      onView={handleViewDetails}
                      onFavorite={handleAddToWatchlist}
                    />
                  ))}
                </div>
                
                {recommendations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent additions to display.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="featured" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Featured Coins</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.map((coin) => (
                    <CoinCard
                      key={coin.id}
                      coin={{ ...coin, featured: true }}
                      onView={handleViewDetails}
                      onFavorite={handleAddToWatchlist}
                    />
                  ))}
                </div>
                
                {recommendations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No featured coins available at the moment.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscoveryFeed;
