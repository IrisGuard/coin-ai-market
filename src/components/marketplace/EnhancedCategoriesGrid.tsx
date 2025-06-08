
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const EnhancedCategoriesGrid = () => {
  const categories = [
    { name: 'Ancient Coins', count: 150 },
    { name: 'Modern Coins', count: 300 },
    { name: 'World Coins', count: 250 },
    { name: 'US Coins', count: 200 }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
            <p className="text-gray-600">{category.count} items</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedCategoriesGrid;
