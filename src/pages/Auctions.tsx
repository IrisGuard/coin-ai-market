
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Clock, TrendingUp, Gavel } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CoinCard from '@/components/CoinCard';
import { useCoins } from '@/hooks/useCoins';
import { usePageView } from '@/hooks/usePageView';

const Auctions = () => {
  usePageView();
  const { data: coins, isLoading } = useCoins();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter for auction coins
  const auctionCoins = coins?.filter(coin => coin.is_auction) || [];

  const filteredCoins = auctionCoins.filter(coin =>
    coin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const endingSoonCoins = auctionCoins
    .filter(coin => coin.auction_end)
    .sort((a, b) => {
      const aEnd = new Date(a.auction_end!).getTime();
      const bEnd = new Date(b.auction_end!).getTime();
      return aEnd - bEnd;
    })
    .slice(0, 6);

  const getTimeRemaining = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Live Auctions</h1>
            <p className="text-gray-600 mt-2">Bid on rare and valuable coins from collectors worldwide</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Create Auction
          </Button>
        </div>

        {/* Auction Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
              <Gavel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{auctionCoins.length}</div>
              <p className="text-xs text-muted-foreground">
                Currently bidding
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ending Soon</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{endingSoonCoins.length}</div>
              <p className="text-xs text-muted-foreground">
                Next 24 hours
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Highest Bid</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${Math.max(...auctionCoins.map(c => c.price || 0)).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Current session
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter Auctions
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Auctions ({auctionCoins.length})</TabsTrigger>
            <TabsTrigger value="ending">Ending Soon</TabsTrigger>
            <TabsTrigger value="new">Newly Listed</TabsTrigger>
            <TabsTrigger value="popular">Most Popular</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            {filteredCoins.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Gavel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No active auctions</h3>
                  <p className="text-gray-600 mb-4">Check back later for new auction listings.</p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Browse Marketplace
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCoins.map((coin) => (
                  <div key={coin.id} className="relative">
                    <CoinCard coin={coin} />
                    {coin.auction_end && (
                      <Badge 
                        variant="destructive" 
                        className="absolute top-2 right-2 bg-red-500 text-white"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {getTimeRemaining(coin.auction_end)}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="ending">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {endingSoonCoins.map((coin) => (
                <div key={coin.id} className="relative">
                  <CoinCard coin={coin} />
                  <Badge 
                    variant="destructive" 
                    className="absolute top-2 right-2 bg-red-500 text-white"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    {coin.auction_end && getTimeRemaining(coin.auction_end)}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="new">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {auctionCoins
                .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
                .slice(0, 8)
                .map((coin) => (
                  <CoinCard key={coin.id} coin={coin} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="popular">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {auctionCoins
                .sort((a, b) => (b.views || 0) - (a.views || 0))
                .slice(0, 8)
                .map((coin) => (
                  <CoinCard key={coin.id} coin={coin} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auctions;
