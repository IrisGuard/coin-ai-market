
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye, Clock, DollarSign, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import EnhancedCoinDetailsModal from './EnhancedCoinDetailsModal';

interface Coin {
  id: string;
  name: string;
  image: string;
  price: number;
  grade: string;
  year: number;
  rarity: string;
  is_auction: boolean;
  auction_end: string | null;
  starting_bid: number | null;
  views: number;
  featured: boolean;
  ai_confidence: number | null;
  country: string;
  authentication_status: string;
  category?: string;
  description?: string;
  listing_type?: string;
  error_type?: string;
  denomination?: string;
  condition?: string;
}

const LiveMarketplaceGrid = () => {
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: coins = [], isLoading, error } = useQuery({
    queryKey: ['live-marketplace-coins'],
    queryFn: async (): Promise<Coin[]> => {
      console.log('🔍 Fetching live marketplace coins...');
      
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .eq('authentication_status', 'verified')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching coins:', error);
        throw error;
      }

      console.log('✅ Fetched coins:', data?.length || 0);
      return data as Coin[] || [];
    },
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  const handleCoinClick = (coin: Coin) => {
    setSelectedCoin(coin);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoin(null);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">❌ Error loading marketplace</div>
        <Button onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    );
  }

  if (coins.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🪙</div>
        <h3 className="text-xl font-semibold mb-2">No Coins Listed Yet</h3>
        <p className="text-muted-foreground mb-4">
          Be the first to list a coin in our marketplace!
        </p>
        <Button onClick={() => window.location.href = '/dealer-direct'}>
          <Zap className="h-4 w-4 mr-2" />
          List Your First Coin
        </Button>
      </div>
    );
  }

  const isAuctionActive = (coin: Coin) => {
    if (!coin.is_auction || !coin.auction_end) return false;
    return new Date(coin.auction_end) > new Date();
  };

  const getTimeRemaining = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  return (
    <>
      <div className="space-y-6">
        {/* Live Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Live Marketplace</h2>
            <Badge className="bg-green-100 text-green-800">
              {coins.length} Active Listings
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Updates every 10 seconds
          </div>
        </div>

        {/* Coins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {coins.map((coin, index) => (
            <motion.div
              key={coin.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => handleCoinClick(coin)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop';
                    }}
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {coin.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {coin.is_auction && isAuctionActive(coin) && (
                      <Badge className="bg-red-100 text-red-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Auction
                      </Badge>
                    )}
                    {coin.ai_confidence && coin.ai_confidence > 0.9 && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Zap className="h-3 w-3 mr-1" />
                        AI Verified
                      </Badge>
                    )}
                  </div>

                  {/* Views */}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      <Eye className="h-3 w-3 mr-1" />
                      {coin.views}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Title and Grade */}
                  <div className="mb-2">
                    <h3 className="font-semibold text-lg truncate" title={coin.name}>
                      {coin.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{coin.year}</span>
                      <span>•</span>
                      <span>{coin.grade}</span>
                      <span>•</span>
                      <span>{coin.country}</span>
                    </div>
                  </div>

                  {/* Rarity */}
                  <div className="mb-3">
                    <Badge 
                      variant="outline" 
                      className={`
                        ${coin.rarity === 'Key Date' ? 'border-red-200 text-red-700' : ''}
                        ${coin.rarity === 'Very Rare' ? 'border-purple-200 text-purple-700' : ''}
                        ${coin.rarity === 'Rare' ? 'border-orange-200 text-orange-700' : ''}
                        ${coin.rarity === 'Scarce' ? 'border-yellow-200 text-yellow-700' : ''}
                        ${coin.rarity === 'Common' ? 'border-green-200 text-green-700' : ''}
                      `}
                    >
                      {coin.rarity}
                    </Badge>
                  </div>

                  {/* Price/Bid Info */}
                  <div className="mb-4">
                    {coin.is_auction && isAuctionActive(coin) ? (
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Current Bid:</span>
                          <span className="font-semibold text-lg text-green-600">
                            ${coin.starting_bid?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                        {coin.auction_end && (
                          <div className="text-sm text-red-600 mt-1">
                            Ends in: {getTimeRemaining(coin.auction_end)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Price:</span>
                        <span className="font-semibold text-xl text-blue-600">
                          ${coin.price.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {coin.is_auction && isAuctionActive(coin) ? (
                      <Button 
                        className="flex-1 bg-red-600 hover:bg-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle bid action
                        }}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Place Bid
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle buy action
                        }}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Buy Now
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle favorite action
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* AI Confidence */}
                  {coin.ai_confidence && (
                    <div className="mt-3 text-xs text-muted-foreground">
                      AI Confidence: {Math.round(coin.ai_confidence * 100)}%
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Coin Details Modal */}
      <EnhancedCoinDetailsModal
        coin={selectedCoin}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default LiveMarketplaceGrid;
