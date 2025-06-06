
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Eye, Heart, Bell, TrendingUp, TrendingDown, DollarSign, Clock, Star, Filter, Search, Grid3x3, List, Trash2, ShoppingCart, AlertCircle, Target, Zap, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { usePageView } from '@/hooks/usePageView';

interface WatchlistItem {
  id: string;
  listing_id: string;
  created_at: string;
  price_alert_enabled: boolean;
  target_price: number | null;
  price_change_percentage: number | null;
  coin: {
    id: string;
    name: string;
    year: number;
    image: string;
    price: number;
    previous_price: number;
    rarity: string;
    condition: string;
    country: string;
    is_auction: boolean;
    auction_end: string | null;
    views: number;
    user_id: string;
    profiles: {
      name: string;
      reputation: number;
      verified_dealer: boolean;
    };
  };
}

const Watchlist = () => {
  usePageView();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'auctions' | 'buy_now' | 'price_drops'>('all');
  const [sortBy, setSortBy] = useState<'date_added' | 'price_low' | 'price_high' | 'ending_soon'>('date_added');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceAlerts, setPriceAlerts] = useState<Record<string, { enabled: boolean; target: string }>>({});

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Fetch watchlist data
  useEffect(() => {
    const fetchWatchlistData = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const { data: watchlistData, error } = await supabase
          .from('watchlist')
          .select(`
            *,
            coin:coins!inner(
              id,
              name,
              year,
              image,
              price,
              rarity,
              condition,
              country,
              is_auction,
              auction_end,
              views,
              user_id,
              profiles!coins_user_id_fkey(
                name,
                reputation,
                verified_dealer
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch price history for each coin to calculate price changes
        const enrichedWatchlist = await Promise.all(
          (watchlistData || []).map(async (item) => {
            const { data: priceHistory } = await supabase
              .from('coin_price_history')
              .select('price')
              .eq('coin_identifier', `${item.coin?.name}-${item.coin?.year}`)
              .order('date_recorded', { ascending: false })
              .limit(2);

            const previousPrice = priceHistory?.[1]?.price || item.coin?.price || 0;

            return {
              ...item,
              coin: {
                ...item.coin,
                previous_price: previousPrice
              }
            };
          })
        );

        setWatchlistItems(enrichedWatchlist);

        // Initialize price alerts state
        const alertsState = enrichedWatchlist.reduce((acc, item) => {
          acc[item.id] = {
            enabled: item.price_alert_enabled || false,
            target: item.target_price?.toString() || ''
          };
          return acc;
        }, {} as Record<string, { enabled: boolean; target: string }>);
        
        setPriceAlerts(alertsState);

      } catch (error) {
        console.error('Error fetching watchlist:', error);
        toast({
          title: "Error",
          description: "Failed to load watchlist data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlistData();
  }, [user?.id, toast]);

  // Filter and sort watchlist
  const filteredWatchlist = useMemo(() => {
    return watchlistItems
      .filter(item => {
        const matchesSearch = item.coin?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.coin?.country?.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesFilter = true;
        switch (filterType) {
          case 'auctions':
            matchesFilter = item.coin?.is_auction || false;
            break;
          case 'buy_now':
            matchesFilter = !item.coin?.is_auction;
            break;
          case 'price_drops':
            matchesFilter = (item.coin?.price || 0) < (item.coin?.previous_price || 0);
            break;
        }

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price_low':
            return (a.coin?.price || 0) - (b.coin?.price || 0);
          case 'price_high':
            return (b.coin?.price || 0) - (a.coin?.price || 0);
          case 'ending_soon':
            if (!a.coin?.is_auction && !b.coin?.is_auction) return 0;
            if (!a.coin?.is_auction) return 1;
            if (!b.coin?.is_auction) return -1;
            return new Date(a.coin.auction_end || '').getTime() - new Date(b.coin.auction_end || '').getTime();
          default: // date_added
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
  }, [watchlistItems, searchTerm, filterType, sortBy]);

  // Calculate watchlist statistics
  const watchlistStats = useMemo(() => {
    const totalValue = watchlistItems.reduce((sum, item) => sum + (item.coin?.price || 0), 0);
    const auctionItems = watchlistItems.filter(item => item.coin?.is_auction).length;
    const priceDrops = watchlistItems.filter(item => 
      (item.coin?.price || 0) < (item.coin?.previous_price || 0)
    ).length;
    const activeAlerts = watchlistItems.filter(item => item.price_alert_enabled).length;

    return {
      totalItems: watchlistItems.length,
      totalValue,
      auctionItems,
      priceDrops,
      activeAlerts
    };
  }, [watchlistItems]);

  // Remove from watchlist
  const removeFromWatchlist = async (watchlistItemId: string) => {
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', watchlistItemId);

      if (error) throw error;

      setWatchlistItems(prev => prev.filter(item => item.id !== watchlistItemId));
      toast({
        title: "Removed",
        description: "Item removed from watchlist"
      });

    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from watchlist",
        variant: "destructive"
      });
    }
  };

  // Update price alert
  const updatePriceAlert = async (watchlistItemId: string, enabled: boolean, targetPrice?: number) => {
    try {
      const { error } = await supabase
        .from('watchlist')
        .update({
          price_alert_enabled: enabled,
          target_price: targetPrice || null
        })
        .eq('id', watchlistItemId);

      if (error) throw error;

      setWatchlistItems(prev => prev.map(item => 
        item.id === watchlistItemId 
          ? { ...item, price_alert_enabled: enabled, target_price: targetPrice || null }
          : item
      ));

      toast({
        title: enabled ? "Alert Enabled" : "Alert Disabled",
        description: enabled 
          ? `You'll be notified when price ${targetPrice ? `reaches $${targetPrice}` : 'changes'}`
          : "Price alert has been disabled"
      });

    } catch (error) {
      console.error('Error updating price alert:', error);
      toast({
        title: "Error",
        description: "Failed to update price alert",
        variant: "destructive"
      });
    }
  };

  // Get price change info
  const getPriceChange = (current: number, previous: number) => {
    const change = current - previous;
    const percentage = previous > 0 ? (change / previous) * 100 : 0;
    return { change, percentage };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Watchlist Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Watchlist</h1>
              <p className="text-gray-600 mt-1">Track coins you're interested in and get price alerts</p>
            </div>
            <Link to="/marketplace">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add More Coins
              </Button>
            </Link>
          </div>

          {/* Watchlist Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Eye className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{watchlistStats.totalItems}</div>
                <div className="text-sm text-gray-600">Watching</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">${watchlistStats.totalValue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Value</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">{watchlistStats.auctionItems}</div>
                <div className="text-sm text-gray-600">Auctions</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <TrendingDown className="w-6 h-6 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold">{watchlistStats.priceDrops}</div>
                <div className="text-sm text-gray-600">Price Drops</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Bell className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">{watchlistStats.activeAlerts}</div>
                <div className="text-sm text-gray-600">Active Alerts</div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Price Drops Alert */}
        {watchlistStats.priceDrops > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Alert>
              <TrendingDown className="h-4 w-4" />
              <AlertDescription>
                🎯 {watchlistStats.priceDrops} coin{watchlistStats.priceDrops !== 1 ? 's have' : ' has'} dropped in price! 
                Great opportunity to buy.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

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
                      placeholder="Search watchlist..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="auctions">Auctions Only</SelectItem>
                    <SelectItem value="buy_now">Buy Now Only</SelectItem>
                    <SelectItem value="price_drops">Price Drops</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_added">Date Added</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="ending_soon">Ending Soon</SelectItem>
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

        {/* Watchlist Grid/List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {filteredWatchlist.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your Watchlist is Empty</h3>
                <p className="text-gray-600 mb-4">Start watching coins to track their prices and get notifications.</p>
                <Link to="/marketplace">
                  <Button>Browse Marketplace</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredWatchlist.map((item, index) => {
                const priceChange = getPriceChange(item.coin?.price || 0, item.coin?.previous_price || 0);
                const isPriceDrop = priceChange.change < 0;
                const isPriceRise = priceChange.change > 0;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        {viewMode === 'grid' ? (
                          <>
                            {/* Grid View */}
                            <div className="relative mb-4">
                              <Link to={`/coin/${item.listing_id}`}>
                                <img 
                                  src={item.coin?.image} 
                                  alt={item.coin?.name}
                                  className="w-full h-40 object-cover rounded-lg hover:scale-105 transition-transform"
                                />
                              </Link>
                              
                              {/* Price Change Badge */}
                              {priceChange.change !== 0 && (
                                <Badge 
                                  className={`absolute top-2 left-2 ${
                                    isPriceDrop ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                  }`}
                                >
                                  {isPriceDrop ? <TrendingDown className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1" />}
                                  {priceChange.percentage.toFixed(1)}%
                                </Badge>
                              )}

                              {/* Auction Badge */}
                              {item.coin?.is_auction && (
                                <Badge className="absolute top-2 right-2 bg-orange-100 text-orange-800">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Auction
                                </Badge>
                              )}
                            </div>

                            <div className="space-y-3">
                              <div>
                                <Link to={`/coin/${item.listing_id}`}>
                                  <h3 className="font-semibold hover:text-brand-primary transition-colors truncate">
                                    {item.coin?.name}
                                  </h3>
                                </Link>
                                <p className="text-sm text-gray-600">{item.coin?.year} • {item.coin?.country}</p>
                              </div>

                              {/* Price Info */}
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Current Price:</span>
                                  <span className="text-lg font-bold">${item.coin?.price}</span>
                                </div>
                                
                                {priceChange.change !== 0 && (
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Change:</span>
                                    <span className={isPriceDrop ? 'text-red-600' : 'text-green-600'}>
                                      {priceChange.change > 0 ? '+' : ''}${priceChange.change.toFixed(2)}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Price Alert Section */}
                              <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor={`alert-${item.id}`} className="text-sm">Price Alert</Label>
                                  <Switch
                                    id={`alert-${item.id}`}
                                    checked={priceAlerts[item.id]?.enabled || false}
                                    onCheckedChange={(checked) => {
                                      setPriceAlerts(prev => ({
                                        ...prev,
                                        [item.id]: { ...prev[item.id], enabled: checked }
                                      }));
                                      
                                      if (checked && priceAlerts[item.id]?.target) {
                                        updatePriceAlert(item.id, checked, parseFloat(priceAlerts[item.id].target));
                                      } else {
                                        updatePriceAlert(item.id, checked);
                                      }
                                    }}
                                  />
                                </div>
                                
                                {priceAlerts[item.id]?.enabled && (
                                  <div className="flex gap-2">
                                    <Input
                                      type="number"
                                      placeholder="Target price"
                                      value={priceAlerts[item.id]?.target || ''}
                                      onChange={(e) => setPriceAlerts(prev => ({
                                        ...prev,
                                        [item.id]: { ...prev[item.id], target: e.target.value }
                                      }))}
                                      className="text-sm"
                                    />
                                    <Button 
                                      size="sm"
                                      onClick={() => {
                                        const target = parseFloat(priceAlerts[item.id]?.target || '0');
                                        if (target > 0) {
                                          updatePriceAlert(item.id, true, target);
                                        }
                                      }}
                                    >
                                      Set
                                    </Button>
                                  </div>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <Link to={`/coin/${item.listing_id}`} className="flex-1">
                                  <Button variant="outline" size="sm" className="w-full">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                  </Button>
                                </Link>
                                
                                {!item.coin?.is_auction && (
                                  <Button size="sm" className="flex-1">
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Buy
                                  </Button>
                                )}
                                
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => removeFromWatchlist(item.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* List View */}
                            <div className="flex items-center gap-4">
                              <Link to={`/coin/${item.listing_id}`}>
                                <img 
                                  src={item.coin?.image} 
                                  alt={item.coin?.name}
                                  className="w-16 h-16 object-cover rounded-lg hover:scale-105 transition-transform"
                                />
                              </Link>
                              
                              <div className="flex-1">
                                <Link to={`/coin/${item.listing_id}`}>
                                  <h3 className="font-semibold hover:text-brand-primary transition-colors">
                                    {item.coin?.name}
                                  </h3>
                                </Link>
                                <p className="text-sm text-gray-600">{item.coin?.year} • {item.coin?.country}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {item.coin?.is_auction && (
                                    <Badge variant="outline" className="text-xs">Auction</Badge>
                                  )}
                                  {priceAlerts[item.id]?.enabled && (
                                    <Badge variant="outline" className="text-xs">
                                      <Bell className="w-3 h-3 mr-1" />
                                      Alert On
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <p className="text-lg font-bold">${item.coin?.price}</p>
                                {priceChange.change !== 0 && (
                                  <p className={`text-sm ${isPriceDrop ? 'text-red-600' : 'text-green-600'}`}>
                                    {priceChange.change > 0 ? '+' : ''}${priceChange.change.toFixed(2)}
                                    ({priceChange.percentage.toFixed(1)}%)
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex gap-2">
                                <Link to={`/coin/${item.listing_id}`}>
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </Link>
                                
                                {!item.coin?.is_auction && (
                                  <Button size="sm">
                                    <ShoppingCart className="w-4 h-4" />
                                  </Button>
                                )}
                                
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => removeFromWatchlist(item.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Watchlist;
