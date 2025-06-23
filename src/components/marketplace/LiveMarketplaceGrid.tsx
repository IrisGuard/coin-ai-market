import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import EnhancedCoinDetailsModal from './EnhancedCoinDetailsModal';
import CoinCard from './CoinCard';
import LiveMarketplaceHeader from './LiveMarketplaceHeader';

interface Coin {
  id: string;
  name: string;
  image: string;
  images?: string[];
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
      console.log('🔍 Fetching live marketplace coins with images...');
      
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url,
            role
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('❌ Error fetching coins:', error);
        throw error;
      }

      console.log('✅ Fetched coins with images:', data?.length || 0);
      
      // Debug logging for the specific coin
      const greeceCoin = data?.find(coin => coin.name.includes('GREECE COIN 10 LEPTA DOUBLED DIE ERROR'));
      if (greeceCoin) {
        console.log('🔍 DEBUG - Greece coin found:', {
          id: greeceCoin.id,
          name: greeceCoin.name,
          images: greeceCoin.images,
          imagesLength: greeceCoin.images?.length || 0,
          imageField: greeceCoin.image
        });
      }
      
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
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
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

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <LiveMarketplaceHeader coinsCount={coins.length} />

        {/* Coins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {coins.map((coin, index) => (
            <CoinCard
              key={coin.id}
              coin={coin}
              index={index}
              onCoinClick={handleCoinClick}
            />
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
