
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DiscoveryHeader from './discovery/DiscoveryHeader';
import DiscoveryTabs from './discovery/DiscoveryTabs';
import CoinCard from './discovery/CoinCard';
import PersonalizedRecommendations from './discovery/PersonalizedRecommendations';
import QuickActions from './discovery/QuickActions';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DiscoveryFeedProps {
  onCoinClick: (coinId: string) => void;
}

const DiscoveryFeed: React.FC<DiscoveryFeedProps> = ({ onCoinClick }) => {
  const [activeTab, setActiveTab] = useState<'trending' | 'new' | 'rare' | 'featured'>('trending');

  // Real data queries instead of mock data
  const { data: coins, isLoading } = useQuery({
    queryKey: ['discovery-coins', activeTab],
    queryFn: async () => {
      let query = supabase.from('coins').select('*');
      
      switch (activeTab) {
        case 'trending':
          query = query.order('views', { ascending: false }).limit(6);
          break;
        case 'new':
          query = query.order('created_at', { ascending: false }).limit(6);
          break;
        case 'rare':
          query = query.eq('rarity', 'extremely_rare').order('price', { ascending: false }).limit(6);
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
                <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
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
                coin={{
                  id: coin.id,
                  name: coin.name,
                  price: coin.price,
                  views: coin.views || 0,
                  trend: coin.rarity === 'extremely_rare' ? '+15%' : '+8%',
                  addedHours: Math.floor((Date.now() - new Date(coin.created_at).getTime()) / (1000 * 60 * 60)),
                  rarity: coin.rarity,
                  featured: coin.featured
                }}
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
