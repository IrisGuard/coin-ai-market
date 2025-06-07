
import React from 'react';
import { Coins, Crown, Globe, Zap } from 'lucide-react';

const categories = [
  {
    icon: Crown,
    title: "Ancient Coins",
    description: "Greek, Roman & Byzantine treasures",
    count: "2,500+ items",
    color: "bg-amber-100 text-amber-600"
  },
  {
    icon: Coins,
    title: "World Coins",
    description: "Modern coins from around the globe",
    count: "5,000+ items",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Globe,
    title: "European Coins",
    description: "Historic European currency",
    count: "1,800+ items",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: Zap,
    title: "Rare & Collectible",
    description: "Limited edition & error coins",
    count: "700+ items",
    color: "bg-purple-100 text-purple-600"
  }
];

const CategoriesGrid = () => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{category.description}</p>
              <p className="text-xs text-gray-500">{category.count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesGrid;
