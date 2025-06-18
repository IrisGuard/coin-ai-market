import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, Star, Eye, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { mapSupabaseCoinToCoin, type Coin, type CoinCategory } from '@/types/coin';
import CoinVerificationDisplay from './CoinVerificationDisplay';

const LiveMarketplaceGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const { data: coins = [], isLoading, error } = useQuery({
    queryKey: ['marketplace-coins', searchTerm, categoryFilter, priceFilter, sortBy, showVerifiedOnly],
    queryFn: async () => {
      console.log('Fetching marketplace coins...');
      
      let query = supabase
        .from('coins')
        .select(`
          *,
          profiles!coins_user_id_fkey (
            id,
            username,
            full_name,
            verified_dealer,
            avatar_url
          ),
          stores!coins_store_id_fkey (
            id,
            name,
            verified
          )
        `)
        .eq('authentication_status', 'verified')
        .eq('sold', false);

      // Apply verified store filter
      if (showVerifiedOnly) {
        query = query.eq('stores.verified', true);
      }

      // Apply search filter
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%`);
      }

      // Apply category filter with proper type checking
      if (categoryFilter !== 'all') {
        // Map UI category to valid database category
        const validCategories: CoinCategory[] = [
          'ancient', 'modern', 'error_coin', 'greek', 'american', 'british', 
          'asian', 'european', 'silver', 'gold', 'commemorative', 'unclassified'
        ];
        
        if (validCategories.includes(categoryFilter as CoinCategory)) {
          query = query.eq('category', categoryFilter);
        }
      }

      // Apply price filter
      if (priceFilter !== 'all') {
        const priceRanges = {
          'under-100': [0, 100],
          '100-500': [100, 500],
          '500-1000': [500, 1000],
          'over-1000': [1000, 999999]
        };
        const range = priceRanges[priceFilter as keyof typeof priceRanges];
        if (range) {
          query = query.gte('price', range[0]).lte('price', range[1]);
        }
      }

      // Apply sorting
      const sortOptions = {
        'created_at': { column: 'created_at', ascending: false },
        'price_asc': { column: 'price', ascending: true },
        'price_desc': { column: 'price', ascending: false },
        'name': { column: 'name', ascending: true },
        'year': { column: 'year', ascending: false }
      };
      
      const sort = sortOptions[sortBy as keyof typeof sortOptions];
      if (sort) {
        query = query.order(sort.column, { ascending: sort.ascending });
      }

      const { data, error } = await query.limit(50);
      
      if (error) {
        console.error('Error fetching coins:', error);
        throw error;
      }

      return data?.map(mapSupabaseCoinToCoin) || [];
    },
    refetchInterval: 30000,
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'ancient', label: 'Ancient' },
    { value: 'modern', label: 'Modern' },
    { value: 'error_coin', label: 'Error Coins' },
    { value: 'commemorative', label: 'Commemorative' },
    { value: 'gold', label: 'Gold' },
    { value: 'silver', label: 'Silver' }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading marketplace: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search coins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under-100">Under $100</SelectItem>
              <SelectItem value="100-500">$100 - $500</SelectItem>
              <SelectItem value="500-1000">$500 - $1,000</SelectItem>
              <SelectItem value="over-1000">Over $1,000</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Newest First</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="year">Year (Newest)</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={showVerifiedOnly ? "default" : "outline"}
            onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Verified Only
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{coins.length} coins found</span>
          {showVerifiedOnly && (
            <Badge variant="outline" className="text-green-600 border-green-300">
              Showing verified stores only
            </Badge>
          )}
        </div>
      </div>

      {/* Coins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {coins.map((coin, index) => (
          <motion.div
            key={coin.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="relative overflow-hidden">
                <img
                  src={coin.image || '/placeholder.svg'}
                  alt={coin.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {coin.featured && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500 text-yellow-900">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {coin.is_auction && (
                  <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                    Auction
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {coin.name}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{coin.year} • {coin.country}</span>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {coin.views || 0}
                    </div>
                  </div>

                  {/* VERIFIED STORE DISPLAY */}
                  <CoinVerificationDisplay 
                    storeId={coin.store_id}
                    storeName={(coin as any).stores?.name}
                    size="sm"
                    showStoreName={true}
                  />

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {coin.rarity}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Grade: {coin.grade}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-2xl font-bold text-green-600">
                      ${coin.price.toLocaleString()}
                    </div>
                    {coin.is_auction && coin.auction_end && (
                      <div className="text-xs text-red-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Ends {new Date(coin.auction_end).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                      {coin.category?.replace('_', ' ').toUpperCase() || 'UNCLASSIFIED'}
                    </Badge>
                    {coin.authentication_status === 'verified' && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {coins.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No coins found</h3>
          <p className="text-gray-500">
            {showVerifiedOnly 
              ? "No coins from verified stores match your search criteria."
              : "Try adjusting your search criteria or filters."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveMarketplaceGrid;
