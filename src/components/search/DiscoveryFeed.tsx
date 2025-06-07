
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DiscoveryHeader from './discovery/DiscoveryHeader';
import DiscoveryTabs from './discovery/DiscoveryTabs';
import CoinCard from './discovery/CoinCard';
import PersonalizedRecommendations from './discovery/PersonalizedRecommendations';
import QuickActions from './discovery/QuickActions';
import { mockCoins } from './discovery/mockData';

interface DiscoveryFeedProps {
  onCoinClick: (coinId: string) => void;
}

const DiscoveryFeed: React.FC<DiscoveryFeedProps> = ({ onCoinClick }) => {
  const [activeTab, setActiveTab] = useState<'trending' | 'new' | 'rare' | 'featured'>('trending');

  return (
    <div className="space-y-6">
      <DiscoveryHeader />

      <Card>
        <CardContent className="p-4">
          <DiscoveryTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCoins[activeTab].map((coin) => (
              <CoinCard key={coin.id} coin={coin} />
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
