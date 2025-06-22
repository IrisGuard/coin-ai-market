import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  // Fetch real categories from database
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['coin-categories'],
    queryFn: async () => {
      // Get categories with counts from coins table
      const { data: categoryData, error } = await supabase
        .from('coins')
        .select('category')
        .not('category', 'is', null);

      if (error) {
        console.error('Error fetching categories:', error);
        return [{ value: '', label: 'All Categories', count: 0 }];
      }

      // Count categories
      const categoryCounts: { [key: string]: number } = {};
      categoryData?.forEach(coin => {
        if (coin.category) {
          categoryCounts[coin.category] = (categoryCounts[coin.category] || 0) + 1;
        }
      });

      // Get total count for "All Categories"
      const totalCount = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);

      // Create categories array with real data
      const realCategories = [
        { value: '', label: 'All Categories', count: totalCount }
      ];

      // Add categories from database
      Object.entries(categoryCounts).forEach(([category, count]) => {
        realCategories.push({
          value: category,
          label: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
          count
        });
      });

      return realCategories;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000 // Consider data stale after 10 seconds
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Category</Label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Loading categories..." />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold">Category</Label>
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(category => (
            <SelectItem key={category.value} value={category.value}>
              <div className="flex items-center justify-between w-full">
                <span>{category.label}</span>
                {category.count > 0 && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategoryFilter;
