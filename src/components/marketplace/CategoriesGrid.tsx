
import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Clock, Star, Globe, TrendingUp, Shield } from 'lucide-react';

const categories = [
  {
    name: 'Ancient Coins',
    icon: <Globe className="w-6 h-6" />,
    count: '245+',
    href: '/marketplace?category=ancient',
    color: 'from-amber-400 to-orange-500'
  },
  {
    name: 'Modern Coins',
    icon: <Coins className="w-6 h-6" />,
    count: '1.2k+',
    href: '/marketplace?category=modern',
    color: 'from-blue-400 to-indigo-500'
  },
  {
    name: 'Error Coins',
    icon: <Star className="w-6 h-6" />,
    count: '89+',
    href: '/marketplace?category=error',
    color: 'from-purple-400 to-pink-500'
  },
  {
    name: 'Live Auctions',
    icon: <Clock className="w-6 h-6" />,
    count: '126+',
    href: '/marketplace?auctions=true',
    color: 'from-red-400 to-rose-500'
  },
  {
    name: 'Graded Coins',
    icon: <Shield className="w-6 h-6" />,
    count: '567+',
    href: '/marketplace?graded=true',
    color: 'from-green-400 to-emerald-500'
  },
  {
    name: 'Trending',
    icon: <TrendingUp className="w-6 h-6" />,
    count: '89+',
    href: '/marketplace?trending=true',
    color: 'from-orange-400 to-red-500'
  }
];

const CategoriesGrid = () => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Shop by category
      </h2>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={category.href}
            className="group text-center p-6 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200"
          >
            <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
              {category.icon}
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
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
