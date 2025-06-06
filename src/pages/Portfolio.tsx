
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, Award, Eye, Heart, Filter, Grid3x3, List, Search, Calendar, Target, PieChart, BarChart3, Plus, Edit, Trash2, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { usePageView } from '@/hooks/usePageView';

interface PortfolioCoin {
  id: string;
  coin_id: string;
  purchase_price: number;
  purchase_date: string;
  quantity: number;
  current_value: number;
  profit_loss: number;
  profit_loss_percentage: number;
  coin: {
    id: string;
    name: string;
    year: number;
    image: string;
    current_price: number;
    rarity: string;
    condition: string;
    country: string;
  };
}

const Portfolio = () => {
  usePageView();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioCoins, setPortfolioCoins] = useState<PortfolioCoin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'purchase_date' | 'value' | 'profit'>('purchase_date');
  const [filterRarity, setFilterRarity] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Fetch portfolio data
  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const { data: portfolioData, error } = await supabase
          .from('user_portfolios')
          .select(`
            *,
            coins!user_portfolios_coin_id_fkey(
              id,
              name,
              year,
              image,
              price,
              rarity,
              condition,
              country
            )
          `)
          .eq('user_id', user.id)
          .order('purchase_date', { ascending: false });

        if (error) throw error;

        // Calculate current values and profit/loss
        const enrichedPortfolio = portfolioData?.map(item => {
          const currentPrice = item.coins?.price || 0;
          const currentValue = currentPrice * (item.quantity || 1);
          const totalPurchasePrice = (item.purchase_price || 0) * (item.quantity || 1);
          const profitLoss = currentValue - totalPurchasePrice;
          const profitLossPercentage = totalPurchasePrice > 0 ? (profitLoss / totalPurchasePrice) * 100 : 0;

          return {
            id: item.id,
            coin_id: item.coin_id,
            purchase_price: item.purchase_price || 0,
            purchase_date: item.purchase_date || new Date().toISOString(),
            quantity: item.quantity || 1,
            current_value: currentValue,
            profit_loss: profitLoss,
            profit_loss_percentage: profitLossPercentage,
            coin: {
              id: item.coins?.id || '',
              name: item.coins?.name || 'Unknown Coin',
              year: item.coins?.year || 0,
              image: item.coins?.image || '/placeholder.svg',
              current_price: currentPrice,
              rarity: item.coins?.rarity || 'Common',
              condition: item.coins?.condition || 'Good',
              country: item.coins?.country || 'Unknown'
            }
          };
        }) || [];

        setPortfolioCoins(enrichedPortfolio);

      } catch (error) {
        console.error('Error fetching portfolio:', error);
        toast({
          title: "Error",
          description: "Failed to load portfolio data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioData();
  }, [user?.id, toast]);

  // Calculate portfolio statistics
  const portfolioStats = useMemo(() => {
    const totalValue = portfolioCoins.reduce((sum, coin) => sum + coin.current_value, 0);
    const totalInvested = portfolioCoins.reduce((sum, coin) => sum + (coin.purchase_price * coin.quantity), 0);
    const totalProfitLoss = totalValue - totalInvested;
    const totalProfitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;
    
    const profitableCoins = portfolioCoins.filter(coin => coin.profit_loss > 0).length;
    const lossMakingCoins = portfolioCoins.filter(coin => coin.profit_loss < 0).length;
    
    const rarityDistribution = portfolioCoins.reduce((acc, coin) => {
      const rarity = coin.coin?.rarity || 'Unknown';
      acc[rarity] = (acc[rarity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPerformer = portfolioCoins.reduce((best, coin) => 
      coin.profit_loss_percentage > (best?.profit_loss_percentage || -Infinity) ? coin : best, 
      null as PortfolioCoin | null
    );

    const worstPerformer = portfolioCoins.reduce((worst, coin) => 
      coin.profit_loss_percentage < (worst?.profit_loss_percentage || Infinity) ? coin : worst, 
      null as PortfolioCoin | null
    );

    return {
      totalValue,
      totalInvested,
      totalProfitLoss,
      totalProfitLossPercentage,
      totalCoins: portfolioCoins.length,
      profitableCoins,
      lossMakingCoins,
      rarityDistribution,
      topPerformer,
      worstPerformer
    };
  }, [portfolioCoins]);

  // Filter and sort portfolio
  const filteredPortfolio = useMemo(() => {
    return portfolioCoins
      .filter(coin => {
        const matchesSearch = coin.coin?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            coin.coin?.country?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRarity = !filterRarity || coin.coin?.rarity === filterRarity;
        return matchesSearch && matchesRarity;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return (a.coin?.name || '').localeCompare(b.coin?.name || '');
          case 'value':
            return b.current_value - a.current_value;
          case 'profit':
            return b.profit_loss - a.profit_loss;
          default: // purchase_date
            return new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime();
        }
      });
  }, [portfolioCoins, searchTerm, filterRarity, sortBy]);

  // Remove coin from portfolio
  const removeCoinFromPortfolio = async (portfolioItemId: string) => {
    try {
      const { error } = await supabase
        .from('user_portfolios')
        .delete()
        .eq('id', portfolioItemId);

      if (error) throw error;

      setPortfolioCoins(prev => prev.filter(item => item.id !== portfolioItemId));
      toast({
        title: "Success",
        description: "Coin removed from portfolio"
      });

    } catch (error) {
      console.error('Error removing coin:', error);
      toast({
        title: "Error",
        description: "Failed to remove coin from portfolio",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Portfolio Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
              <p className="text-gray-600 mt-1">Track and manage your coin collection</p>
            </div>
            <Link to="/upload">
              <Button className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90">
                <Plus className="w-4 h-4" />
                Add Coin
              </Button>
            </Link>
          </div>

          {/* Portfolio Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold">${portfolioStats.totalValue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Invested</p>
                    <p className="text-2xl font-bold">${portfolioStats.totalInvested.toLocaleString()}</p>
                  </div>
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Profit/Loss</p>
                    <p className={`text-2xl font-bold ${portfolioStats.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {portfolioStats.totalProfitLoss >= 0 ? '+' : ''}${portfolioStats.totalProfitLoss.toLocaleString()}
                    </p>
                    <p className={`text-sm ${portfolioStats.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {portfolioStats.totalProfitLoss >= 0 ? '+' : ''}{portfolioStats.totalProfitLossPercentage.toFixed(2)}%
                    </p>
                  </div>
                  {portfolioStats.totalProfitLoss >= 0 ? 
                    <TrendingUp className="w-8 h-8 text-green-600" /> :
                    <TrendingDown className="w-8 h-8 text-red-600" />
                  }
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Coins</p>
                    <p className="text-2xl font-bold">{portfolioStats.totalCoins}</p>
                    <p className="text-sm text-gray-600">
                      {portfolioStats.profitableCoins} profitable
                    </p>
                  </div>
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Performance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Top Performer */}
                {portfolioStats.topPerformer && (
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">🏆 Top Performer</h4>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <img 
                        src={portfolioStats.topPerformer.coin?.image} 
                        alt={portfolioStats.topPerformer.coin?.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{portfolioStats.topPerformer.coin?.name}</p>
                        <p className="text-sm text-gray-600">
                          +{portfolioStats.topPerformer.profit_loss_percentage.toFixed(2)}% 
                          (+${portfolioStats.topPerformer.profit_loss.toFixed(2)})
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Worst Performer */}
                {portfolioStats.worstPerformer && portfolioStats.worstPerformer.profit_loss < 0 && (
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">📉 Needs Attention</h4>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <img 
                        src={portfolioStats.worstPerformer.coin?.image} 
                        alt={portfolioStats.worstPerformer.coin?.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{portfolioStats.worstPerformer.coin?.name}</p>
                        <p className="text-sm text-gray-600">
                          {portfolioStats.worstPerformer.profit_loss_percentage.toFixed(2)}% 
                          (${portfolioStats.worstPerformer.profit_loss.toFixed(2)})
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Rarity Distribution */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Collection by Rarity</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(portfolioStats.rarityDistribution).map(([rarity, count]) => (
                    <div key={rarity} className="text-center">
                      <div className="text-2xl font-bold text-brand-primary">{count}</div>
                      <div className="text-sm text-gray-600">{rarity}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search coins..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={filterRarity} onValueChange={setFilterRarity}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Rarities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Rarities</SelectItem>
                    <SelectItem value="Common">Common</SelectItem>
                    <SelectItem value="Uncommon">Uncommon</SelectItem>
                    <SelectItem value="Rare">Rare</SelectItem>
                    <SelectItem value="Ultra Rare">Ultra Rare</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase_date">Purchase Date</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="value">Current Value</SelectItem>
                    <SelectItem value="profit">Profit/Loss</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Portfolio Grid/List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {filteredPortfolio.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Coins in Portfolio</h3>
                <p className="text-gray-600 mb-4">Start building your collection by adding coins to your portfolio.</p>
                <Link to="/marketplace">
                  <Button className="bg-brand-primary hover:bg-brand-primary/90">Browse Marketplace</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredPortfolio.map((portfolioItem, index) => (
                <motion.div
                  key={portfolioItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      {viewMode === 'grid' ? (
                        <>
                          <div className="relative mb-4">
                            <img 
                              src={portfolioItem.coin?.image} 
                              alt={portfolioItem.coin?.name}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                            <Badge 
                              className={`absolute top-2 right-2 ${
                                portfolioItem.profit_loss >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {portfolioItem.profit_loss >= 0 ? '+' : ''}{portfolioItem.profit_loss_percentage.toFixed(1)}%
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="font-semibold truncate">{portfolioItem.coin?.name}</h3>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Purchase Price:</span>
                              <span>${portfolioItem.purchase_price}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Current Value:</span>
                              <span className="font-semibold">${portfolioItem.current_value.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Profit/Loss:</span>
                              <span className={portfolioItem.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {portfolioItem.profit_loss >= 0 ? '+' : ''}${portfolioItem.profit_loss.toFixed(2)}
                              </span>
                            </div>
                            
                            <div className="flex gap-2 mt-4">
                              <Link to={`/coins/${portfolioItem.coin_id}`} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Button>
                              </Link>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => removeCoinFromPortfolio(portfolioItem.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-4">
                          <img 
                            src={portfolioItem.coin?.image} 
                            alt={portfolioItem.coin?.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{portfolioItem.coin?.name}</h3>
                            <p className="text-sm text-gray-600">{portfolioItem.coin?.year} • {portfolioItem.coin?.country}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${portfolioItem.current_value.toFixed(2)}</p>
                            <p className={`text-sm ${portfolioItem.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {portfolioItem.profit_loss >= 0 ? '+' : ''}{portfolioItem.profit_loss_percentage.toFixed(1)}%
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Link to={`/coins/${portfolioItem.coin_id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeCoinFromPortfolio(portfolioItem.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Portfolio;
