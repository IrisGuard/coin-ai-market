
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

type CoinCategory = 'error_coin' | 'greek' | 'american' | 'british' | 'asian' | 'european' | 'ancient' | 'modern' | 'silver' | 'gold' | 'commemorative' | 'unclassified';

interface Category {
  id: string;
  name: string;
  slug: CoinCategory;
  description: string;
  image: string;
  coinCount: number;
  trending?: boolean;
}

const CategoriesGrid = () => {
  const navigate = useNavigate();

  const categories: Category[] = [
    {
      id: '1',
      name: 'American Coins',
      slug: 'american',
      description: 'Classic American numismatics',
      image: '/api/placeholder/300/200',
      coinCount: 1247,
      trending: true
    },
    {
      id: '2', 
      name: 'European Coins',
      slug: 'european',
      description: 'European historical coins',
      image: '/api/placeholder/300/200',
      coinCount: 892
    },
    {
      id: '3',
      name: 'Ancient Coins',
      slug: 'ancient', 
      description: 'Ancient world numismatics',
      image: '/api/placeholder/300/200',
      coinCount: 567
    },
    {
      id: '4',
      name: 'Gold Coins',
      slug: 'gold',
      description: 'Precious metal investments',
      image: '/api/placeholder/300/200',
      coinCount: 423,
      trending: true
    },
    {
      id: '5',
      name: 'Silver Coins',
      slug: 'silver',
      description: 'Silver collectibles and bullion',
      image: '/api/placeholder/300/200',
      coinCount: 1056
    },
    {
      id: '6',
      name: 'Error Coins',
      slug: 'error_coin',
      description: 'Mint errors and varieties',
      image: '/api/placeholder/300/200',
      coinCount: 234
    }
  ];

  const handleCategoryClick = (category: Category) => {
    navigate(`/marketplace/category/${category.slug}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Card 
          key={category.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCategoryClick(category)}
        >
          <div className="relative">
            <img 
              src={category.image} 
              alt={category.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            {category.trending && (
              <Badge className="absolute top-2 right-2 bg-red-500">
                Trending
              </Badge>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{category.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {category.coinCount.toLocaleString()} coins
              </span>
              <Badge variant="outline">
                View Category
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CategoriesGrid;
