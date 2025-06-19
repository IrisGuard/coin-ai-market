
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Sparkles, Trophy, Zap } from 'lucide-react';

// Production categories - no mock data
const PRODUCTION_CATEGORIES = [
  {
    id: 'all',
    name: 'All Coins',
    icon: Coins,
    description: 'Browse all available coins',
    count: 0 // Will be populated by real data
  },
  {
    id: 'featured',
    name: 'Featured',
    icon: Sparkles,
    description: 'Highlighted premium coins',
    count: 0
  },
  {
    id: 'auctions',
    name: 'Live Auctions',
    icon: Trophy,
    description: 'Active bidding opportunities',
    count: 0
  },
  {
    id: 'new',
    name: 'Recently Added',
    icon: Zap,
    description: 'Latest coin additions',
    count: 0
  }
];

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
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {PRODUCTION_CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category.id;
        const count = categoryCounts[category.id] || 0;
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
