
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Star,
  Eye,
  Heart,
  ChevronRight,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DiscoveryFeedProps {
  onCoinClick: (coinId: string) => void;
}

const DiscoveryFeed: React.FC<DiscoveryFeedProps> = ({ onCoinClick }) => {
  const [activeTab, setActiveTab] = useState<'trending' | 'new' | 'rare' | 'featured'>('trending');

  const mockCoins = {
    trending: [
      { id: '1', name: '1921 Morgan Silver Dollar', price: 450, views: 1203, trend: '+15%' },
      { id: '2', name: '1916-D Mercury Dime', price: 1250, views: 892, trend: '+8%' },
      { id: '3', name: '1893-S Morgan Dollar', price: 3500, views: 743, trend: '+12%' }
    ],
    new: [
      { id: '4', name: '1943 Walking Liberty Half', price: 85, addedHours: 2 },
      { id: '5', name: '1936 Buffalo Nickel', price: 125, addedHours: 5 },
      { id: '6', name: '1909-S VDB Lincoln Cent', price: 750, addedHours: 8 }
    ],
    rare: [
      { id: '7', name: '1933 Double Eagle', price: 18500000, rarity: 'Ultra Rare' },
      { id: '8', name: '1793 Chain Cent', price: 1200000, rarity: 'Ultra Rare' },
      { id: '9', name: '1804 Class I Dollar', price: 3800000, rarity: 'Ultra Rare' }
    ],
    featured: [
      { id: '10', name: '1955 Doubled Die Lincoln Cent', price: 1800, featured: true },
      { id: '11', name: '1970-S Small Date Lincoln Cent', price: 3500, featured: true },
      { id: '12', name: '1916 Standing Liberty Quarter', price: 8500, featured: true }
    ]
  };

  const tabs = [
    { key: 'trending', label: 'Trending', icon: TrendingUp, color: 'text-green-600' },
    { key: 'new', label: 'New Arrivals', icon: Clock, color: 'text-blue-600' },
    { key: 'rare', label: 'Rare Finds', icon: Sparkles, color: 'text-purple-600' },
    { key: 'featured', label: 'Featured', icon: Star, color: 'text-yellow-600' }
  ];

  const renderCoinCard = (coin: any) => (
    <motion.div
      key={coin.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm text-gray-900 truncate flex-1 mr-2">
              {coin.name}
            </h4>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-green-600">
                ${coin.price.toLocaleString()}
              </span>
              
              {coin.trend && (
                <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                  {coin.trend}
                </Badge>
              )}
              
              {coin.rarity && (
                <Badge className="text-xs bg-purple-600 text-white">
                  {coin.rarity}
                </Badge>
              )}
              
              {coin.featured && (
                <Badge className="text-xs bg-yellow-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {coin.views && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {coin.views} views
                </div>
              )}
              
              {coin.addedHours && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {coin.addedHours}h ago
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {Math.floor(Math.random() * 50 + 10)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Discovery Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            Discover Amazing Coins
          </CardTitle>
          <p className="text-gray-600">
            Explore trending coins, new arrivals, and rare finds curated by our AI
          </p>
        </CardHeader>
      </Card>

      {/* Discovery Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(tab.key as any)}
                className="flex items-center gap-2"
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.key ? 'text-white' : tab.color}`} />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCoins[activeTab].map(renderCoinCard)}
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-600" />
            Recommended for You
          </CardTitle>
          <p className="text-sm text-gray-600">
            Based on your search history and preferences
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: '13', name: '1942-D Mercury Dime', price: 45, reason: 'Similar to your recent searches' },
              { id: '14', name: '1964 Kennedy Half Dollar', price: 25, reason: 'Popular in your price range' },
              { id: '15', name: '1881-S Morgan Dollar', price: 350, reason: 'Matches your collection interests' },
              { id: '16', name: '1943-S Steel Cent', price: 15, reason: 'Trending in your area' }
            ].map((coin) => (
              <Card key={coin.id} className="border border-purple-200">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">{coin.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">
                        ${coin.price}
                      </span>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 italic">{coin.reason}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Market Trends
            </Button>
            <Button variant="outline" size="sm">
              <Star className="w-4 h-4 mr-2" />
              Browse Collections
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="w-4 h-4 mr-2" />
              Live Auctions
            </Button>
            <Button variant="outline" size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Recommendations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscoveryFeed;
