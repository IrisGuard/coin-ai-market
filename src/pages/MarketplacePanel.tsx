
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import { useDealerStores } from '@/hooks/useDealerStores';
import { useCachedMarketplaceData } from '@/hooks/useCachedMarketplaceData';
import { useAuctionData } from '@/hooks/useAuctionData';
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Coins, Gavel, Store, TrendingUp, Eye } from 'lucide-react';

const MarketplacePanel = () => {
  usePageView();
  
  const { data: dealers, isLoading: dealersLoading } = useDealerStores();
  const { coins, isLoading: coinsLoading } = useCachedMarketplaceData();
  const { auctions, isLoading: auctionsLoading } = useAuctionData();

  const stats = {
    totalStores: dealers?.length || 0,
    totalCoins: coins?.length || 0,
    verifiedCoins: coins?.filter(coin => coin.authentication_status === 'verified').length || 0,
    pendingCoins: coins?.filter(coin => coin.authentication_status === 'pending').length || 0,
    activeAuctions: auctions?.filter(auction => new Date(auction.auction_end) > new Date()).length || 0,
    totalAuctions: auctions?.length || 0
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent mb-2">
            User Marketplace Panel
          </h1>
          <p className="text-gray-600">
            Real-time overview of marketplace activity and user statistics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card border border-electric-blue/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Stores</CardTitle>
              <Store className="h-4 w-4 text-electric-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-electric-blue">{stats.totalStores}</div>
              <p className="text-xs text-gray-500 mt-1">
                User-operated stores
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border border-electric-green/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Coins</CardTitle>
              <Coins className="h-4 w-4 text-electric-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-electric-green">{stats.totalCoins}</div>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {stats.verifiedCoins} Verified
                </Badge>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {stats.pendingCoins} Pending
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border border-electric-orange/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Auctions</CardTitle>
              <Gavel className="h-4 w-4 text-electric-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-electric-orange">{stats.totalAuctions}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.activeAuctions} currently active
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Stores */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-electric-blue" />
                Recent Stores
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dealersLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {dealers?.slice(0, 5).map((dealer) => (
                    <div key={dealer.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-electric-blue/10 rounded-full flex items-center justify-center">
                        <span className="text-electric-blue font-semibold">
                          {dealer.full_name?.[0] || dealer.username?.[0] || 'S'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {dealer.full_name || dealer.username}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {dealer.location || 'Location not specified'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Coins */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-electric-green" />
                Recent Coins
              </CardTitle>
            </CardHeader>
            <CardContent>
              {coinsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
                      <div className="w-12 h-12 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-40"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {coins?.slice(0, 5).map((coin) => (
                    <div key={coin.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                        {coin.image ? (
                          <img 
                            src={coin.image} 
                            alt={coin.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-electric-green/10 flex items-center justify-center">
                            <Coins className="w-6 h-6 text-electric-green" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {coin.name || 'Untitled Coin'}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              coin.authentication_status === 'verified' 
                                ? 'bg-green-100 text-green-800' 
                                : coin.authentication_status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {coin.authentication_status}
                          </Badge>
                          {coin.views && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {coin.views}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePanel;
