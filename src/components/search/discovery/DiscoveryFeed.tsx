
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DiscoveryHeader from './DiscoveryHeader';
import DiscoveryTabs from './DiscoveryTabs';
import CoinCard from './CoinCard';
import PersonalizedRecommendations from './PersonalizedRecommendations';
import QuickActions from './QuickActions';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DiscoveryFeedProps {
  onCoinClick: (coinId: string) => void;
}

const DiscoveryFeed: React.FC<DiscoveryFeedProps> = ({ onCoinClick }) => {
  const [activeTab, setActiveTab] = useState<'trending' | 'new' | 'rare' | 'featured'>('trending');

  const { data: coins, isLoading } = useQuery({
    queryKey: ['discovery-coins', activeTab],
    queryFn: async () => {
      let query = supabase
        .from('coins')
        .select('*')
        .eq('authentication_status', 'verified');
      
      switch (activeTab) {
        case 'trending':
          query = query.order('views', { ascending: false }).limit(6);
          break;
        case 'new':
          query = query.order('created_at', { ascending: false }).limit(6);
          break;
        case 'rare':
          query = query.in('rarity', ['extremely_rare', 'very_rare']).order('price', { ascending: false }).limit(6);
          break;
        case 'featured':
          query = query.eq('featured', true).limit(6);
          break;
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DiscoveryHeader />
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-muted h-64 rounded-lg"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DiscoveryHeader />

      <Card>
        <CardContent className="p-4">
          <DiscoveryTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coins?.map((coin) => (
              <CoinCard 
                key={coin.id} 
                id={coin.id}
                name={coin.name}
                imageUrl={coin.image}
                year={coin.year}
                mint={coin.mint || 'Unknown'}
                grade={coin.grade}
                price={coin.price}
                onViewDetails={() => onCoinClick(coin.id)}
                onAddToWatchlist={() => console.log('Add to watchlist:', coin.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <PersonalizedRecommendations />
      <QuickActions />
    </div>
  );
};

export default DiscoveryFeed;
