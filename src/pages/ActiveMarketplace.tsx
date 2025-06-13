import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CoinGrid from '@/components/CoinGrid';
import DirectDealerAccessButton from '@/components/navigation/DirectDealerAccessButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, SortAsc, TrendingUp, Users, Coins, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ActiveMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  // Fetch marketplace stats
  const { data: stats } = useQuery({
    queryKey: ['marketplace-stats'],
    queryFn: async () => {
      const { data: coinsData } = await supabase
        .from('coins')
        .select('id, price, created_at')
        .eq('is_featured', true);

      const { data: usersData } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'dealer');

      return {
        totalCoins: coinsData?.length || 0,
        activeDealers: usersData?.length || 0,
        featuredCoins: coinsData || [],
      };
    },
  });

  const coinFilters = useMemo(() => [
    { value: 'all', label: 'All Categories' },
    { value: 'gold', label: 'Gold Coins' },
    { value: 'silver', label: 'Silver Coins' },
    { value: 'ancient', label: 'Ancient Coins' },
    { value: 'modern', label: 'Modern Coins' },
  ], []);

  const sortOptions = useMemo(() => [
    { value: 'newest', label: 'Newest Listings' },
    { value: 'oldest', label: 'Oldest Listings' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
  ], []);

  const priceRanges = useMemo(() => [
    { value: 'all', label: 'All Prices' },
    { value: 'under_100', label: 'Under $100' },
    { value: '100_500', label: '$100 - $500' },
    { value: '500_1000', label: '$500 - $1000' },
    { value: 'over_1000', label: 'Over $1000' },
  ], []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="relative overflow-hidden pt-20">
        <div className="mesh-bg"></div>
        
        <div className="max-w-7xl mx-auto container-padding section-spacing relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-blue to-cyber-purple bg-clip-text text-transparent">
                Active Marketplace
              </h1>
              <p className="text-muted-foreground text-lg">
                Explore a wide selection of coins from trusted dealers around the world.
              </p>
            </div>

            {/* Marketplace Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    Total Coins Listed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.totalCoins || 0}</div>
                  <p className="text-sm text-muted-foreground">
                    Explore a diverse range of coins.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    Active Dealers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.activeDealers || 0}</div>
                  <p className="text-sm text-muted-foreground">
                    Connect with reputable coin dealers.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    Featured Listings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.featuredCoins?.length || 0}</div>
                  <p className="text-sm text-muted-foreground">
                    Discover curated and premium coins.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Input
                  type="text"
                  placeholder="Search for coins..."
                  className="shadow-sm focus:ring-electric-blue focus:border-electric-blue"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <Select onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] shadow-sm focus:ring-electric-blue focus:border-electric-blue">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px] shadow-sm focus:ring-electric-blue focus:border-electric-blue">
                    <SelectValue placeholder="Filter Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {coinFilters.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select onValueChange={setPriceRange}>
                  <SelectTrigger className="w-[180px] shadow-sm focus:ring-electric-blue focus:border-electric-blue">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Coin Grid */}
            <CoinGrid searchTerm={searchTerm} sortBy={sortBy} filterCategory={filterCategory} priceRange={priceRange} />
          </motion.div>
        </div>
      </div>
      <DirectDealerAccessButton />
    </div>
  );
};

export default ActiveMarketplace;
