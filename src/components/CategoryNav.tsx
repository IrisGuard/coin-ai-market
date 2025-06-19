
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Sparkles, Trophy, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CategoryNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categoryCounts?: Record<string, number>;
}

const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onCategoryChange,
  categoryCounts = {}
}) => {
  // Fetch real category data from Supabase
  const { data: realCategoryCounts = { all: 0, featured: 0, auctions: 0, new: 0 } } = useQuery({
    queryKey: ['category-counts'],
    queryFn: async () => {
      const { data: allCoins } = await supabase
        .from('coins')
        .select('featured, is_auction, created_at')
        .eq('authentication_status', 'verified');

      const { data: featuredCoins } = await supabase
        .from('coins')
        .select('id')
        .eq('featured', true)
        .eq('authentication_status', 'verified');

      const { data: auctionCoins } = await supabase
        .from('coins')
        .select('id')
        .eq('is_auction', true)
        .gt('auction_end', new Date().toISOString());

      const { data: recentCoins } = await supabase
        .from('coins')
        .select('id')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .eq('authentication_status', 'verified');

      return {
        all: allCoins?.length || 0,
        featured: featuredCoins?.length || 0,
        auctions: auctionCoins?.length || 0,
        new: recentCoins?.length || 0
      };
    },
    refetchInterval: 30000
  });

  // Use real counts or fallback to passed counts
  const finalCounts = { ...categoryCounts, ...realCategoryCounts };

  const PRODUCTION_CATEGORIES = [
    {
      id: 'all',
      name: 'All Coins',
      icon: Coins,
      description: 'Browse all available coins',
      count: finalCounts.all || 0
    },
    {
      id: 'featured',
      name: 'Featured',
      icon: Sparkles,
      description: 'Highlighted premium coins',
      count: finalCounts.featured || 0
    },
    {
      id: 'auctions',
      name: 'Live Auctions',
      icon: Trophy,
      description: 'Active bidding opportunities',
      count: finalCounts.auctions || 0
    },
    {
      id: 'new',
      name: 'Recently Added',
      icon: Zap,
      description: 'Latest coin additions',
      count: finalCounts.new || 0
    }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {PRODUCTION_CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category.id;
        const count = category.count;
        const Icon = category.icon;

        return (
          <Button
            key={category.id}
            variant={isSelected ? "default" : "outline"}
            onClick={() => onCategoryChange(category.id)}
            className="flex items-center gap-2 h-auto p-3"
          >
            <Icon className="w-4 h-4" />
            <span>{category.name}</span>
            {count > 0 && (
              <Badge variant="secondary" className="ml-1">
                {count}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
};

export default CategoryNav;
