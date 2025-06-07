
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, Clock, Sparkles, Star } from 'lucide-react';

interface DiscoveryTabsProps {
  activeTab: 'trending' | 'new' | 'rare' | 'featured';
  onTabChange: (tab: 'trending' | 'new' | 'rare' | 'featured') => void;
}

const DiscoveryTabs: React.FC<DiscoveryTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { key: 'trending', label: 'Trending', icon: TrendingUp, color: 'text-green-600' },
    { key: 'new', label: 'New Arrivals', icon: Clock, color: 'text-blue-600' },
    { key: 'rare', label: 'Rare Finds', icon: Sparkles, color: 'text-purple-600' },
    { key: 'featured', label: 'Featured', icon: Star, color: 'text-yellow-600' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => (
        <Button
          key={tab.key}
          variant={activeTab === tab.key ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTabChange(tab.key as any)}
          className="flex items-center gap-2"
        >
          <tab.icon className={`w-4 h-4 ${activeTab === tab.key ? 'text-white' : tab.color}`} />
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default DiscoveryTabs;
