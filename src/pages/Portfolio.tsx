
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Grid, List, TrendingUp, DollarSign, Coins, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CoinCard from '@/components/CoinCard';
import { useAuth } from '@/contexts/AuthContext';
import { usePageView } from '@/hooks/usePageView';
import { useUserPortfolio } from '@/hooks/useEnhancedDataSources';

const Portfolio = () => {
  usePageView();
  const { user } = useAuth();
  const { data: portfolioItems, isLoading } = useUserPortfolio(user?.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Calculate real portfolio statistics
  const totalValue = portfolioItems?.reduce((sum, item) => 
    sum + (item.coins?.price || item.purchase_price || 0) * item.quantity, 0) || 0;
  const totalCoins = portfolioItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const uniqueCountries = new Set(portfolioItems?.map(item => item.coins?.country).filter(Boolean)).size;

  // Calculate portfolio performance
  const totalPurchaseValue = portfolioItems?.reduce((sum, item) => 
    sum + (item.purchase_price || 0) * item.quantity, 0) || 0;
  const performancePercentage = totalPurchaseValue > 0 
    ? ((totalValue - totalPurchaseValue) / totalPurchaseValue * 100).toFixed(1)
    : '0.0';

  const filteredPortfolio = portfolioItems?.filter(item =>
    item.coins?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.coins?.country?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
          <Button className="bg-brand-primary hover:bg-brand-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add New Coin
          </Button>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`${parseFloat(performancePercentage) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(performancePercentage) >= 0 ? '+' : ''}{performancePercentage}%
                </span> from purchase price
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Coins</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCoins}</div>
              <p className="text-xs text-muted-foreground">
                Across {uniqueCountries} countries
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <span className={parseFloat(performancePercentage) >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {parseFloat(performancePercentage) >= 0 ? '+' : ''}{performancePercentage}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Portfolio growth
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search your coins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Coins ({totalCoins})</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
            <TabsTrigger value="valuable">Most Valuable</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            {filteredPortfolio.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No coins in your portfolio</h3>
                  <p className="text-gray-600 mb-4">Start building your collection by adding your first coin.</p>
                  <Button className="bg-brand-primary hover:bg-brand-primary/90">
                    Add Your First Coin
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {filteredPortfolio.map((item) => (
                  <div key={item.id} className="relative">
                    {item.coins && <CoinCard coin={item.coins} />}
                    <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium shadow-md">
                      Qty: {item.quantity}
                    </div>
                    {item.purchase_price && (
                      <div className="absolute bottom-2 left-2 bg-white rounded-full px-2 py-1 text-xs shadow-md">
                        Bought: ${item.purchase_price}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recent">
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredPortfolio
                .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
                .slice(0, 8)
                .map((item) => (
                  <div key={item.id} className="relative">
                    {item.coins && <CoinCard coin={item.coins} />}
                    <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium shadow-md">
                      Qty: {item.quantity}
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="valuable">
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredPortfolio
                .sort((a, b) => (b.coins?.price || 0) - (a.coins?.price || 0))
                .slice(0, 8)
                .map((item) => (
                  <div key={item.id} className="relative">
                    {item.coins && <CoinCard coin={item.coins} />}
                    <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium shadow-md">
                      Qty: {item.quantity}
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Portfolio;
