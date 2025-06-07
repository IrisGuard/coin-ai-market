
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye, ShoppingCart, Search, Star, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageView } from '@/hooks/usePageView';
import { allDirectSaleCoins } from '@/data/mockDirectSaleCoins';

const Index = () => {
  usePageView();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price_low' | 'price_high' | 'newest' | 'popular'>('newest');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  // Filter and sort coins
  const filteredCoins = allDirectSaleCoins
    .filter(coin => 
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedRarity === 'all' || coin.rarity === selectedRarity)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'popular':
          return b.views - a.views;
        case 'newest':
        default:
          return 0; // Keep original order for newest
      }
    });

  const featuredCoins = filteredCoins.filter(coin => coin.featured).slice(0, 8);
  const regularCoins = filteredCoins.filter(coin => !coin.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Premium Coin Marketplace
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover rare and valuable coins from trusted dealers worldwide
          </p>
          
          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search coins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Rarities</option>
                  <option value="Common">Common</option>
                  <option value="Uncommon">Uncommon</option>
                  <option value="Rare">Rare</option>
                  <option value="Very Rare">Very Rare</option>
                  <option value="Ultra Rare">Ultra Rare</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="newest">Newest</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Featured Coins */}
        {featuredCoins.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Coins</h2>
              <Badge className="bg-gold text-black">Premium Selection</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCoins.map((coin, index) => (
                <motion.div
                  key={coin.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-yellow-200">
                    <CardContent className="p-4">
                      <div className="relative mb-4">
                        <Link to={`/coin/${coin.id}`}>
                          <img 
                            src={coin.image} 
                            alt={coin.name}
                            className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform"
                          />
                        </Link>
                        <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
                          Featured
                        </Badge>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Link to={`/coin/${coin.id}`}>
                            <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors truncate">
                              {coin.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600">{coin.year} • {coin.grade}</p>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-green-600">
                            ${coin.price.toLocaleString()}
                          </span>
                          <Badge variant="outline">{coin.rarity}</Badge>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{coin.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{coin.watchers}</span>
                          </div>
                        </div>

                        {coin.profiles && (
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{coin.profiles.name}</p>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs">{coin.profiles.reputation}/100</span>
                                {coin.profiles.verified_dealer && (
                                  <Badge variant="outline" className="text-xs ml-1">Verified</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        <Button className="w-full" asChild>
                          <Link to={`/coin/${coin.id}`}>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Buy Now
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* All Coins */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Coins</h2>
            <div className="text-sm text-gray-600">
              {filteredCoins.length} coins available
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {regularCoins.map((coin, index) => (
              <motion.div
                key={coin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <Link to={`/coin/${coin.id}`}>
                        <img 
                          src={coin.image} 
                          alt={coin.name}
                          className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform"
                        />
                      </Link>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Link to={`/coin/${coin.id}`}>
                          <h3 className="font-semibold hover:text-blue-600 transition-colors truncate">
                            {coin.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600">{coin.year} • {coin.grade}</p>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-green-600">
                          ${coin.price.toLocaleString()}
                        </span>
                        <Badge variant="outline">{coin.rarity}</Badge>
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{coin.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{coin.watchers}</span>
                        </div>
                      </div>

                      <Button className="w-full" size="sm" asChild>
                        <Link to={`/coin/${coin.id}`}>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Buy Now
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to Start Trading?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/upload">
                List Your Coins
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auctions">
                Browse Auctions
              </Link>
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Index;
