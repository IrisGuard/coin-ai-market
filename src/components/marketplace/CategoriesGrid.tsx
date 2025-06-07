
import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Clock, Star, Globe, TrendingUp, Shield } from 'lucide-react';

const categories = [
  {
    name: 'Ancient Coins',
    icon: <Globe className="w-6 h-6" />,
    count: '245+',
    href: '/marketplace?category=ancient'
  },
  {
    name: 'Modern Coins',
    icon: <Coins className="w-6 h-6" />,
    count: '1.2k+',
    href: '/marketplace?category=modern'
  },
  {
    name: 'Error Coins',
    icon: <Star className="w-6 h-6" />,
    count: '89+',
    href: '/marketplace?category=error'
  },
  {
    name: 'Live Auctions',
    icon: <Clock className="w-6 h-6" />,
    count: '126+',
    href: '/marketplace?auctions=true'
  },
  {
    name: 'Graded Coins',
    icon: <Shield className="w-6 h-6" />,
    count: '567+',
    href: '/marketplace?graded=true'
  },
  {
    name: 'Trending',
    icon: <TrendingUp className="w-6 h-6" />,
    count: '89+',
    href: '/marketplace?trending=true'
  }
];

const CategoriesGrid = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium text-gray-900 mb-4">
        Shop by category
      </h2>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={category.href}
            className="group text-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="w-12 h-12 mx-auto mb-2 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 group-hover:bg-orange-200 transition-colors">
              {category.icon}
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {category.name}
            </h3>
            <p className="text-xs text-gray-600">
              {category.count}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesGrid;
