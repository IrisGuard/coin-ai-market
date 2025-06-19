
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  const categories = [
    { value: '', label: 'All Categories', count: 0 },
    { value: 'gold', label: 'Gold Coins', count: 45 },
    { value: 'silver', label: 'Silver Coins', count: 123 },
    { value: 'error_coin', label: 'Error Coins', count: 28 },
    { value: 'greek', label: 'Greek Coins', count: 34 },
    { value: 'american', label: 'American Coins', count: 89 },
    { value: 'british', label: 'British Coins', count: 56 },
    { value: 'european', label: 'European Coins', count: 67 },
    { value: 'ancient', label: 'Ancient Coins', count: 23 },
    { value: 'modern', label: 'Modern Coins', count: 78 },
    { value: 'commemorative', label: 'Commemorative', count: 41 }
  ];

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
