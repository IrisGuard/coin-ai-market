
import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Clock, Star, Globe, TrendingUp, Shield, Crown, DollarSign, MapPin } from 'lucide-react';

const categories = [
  {
    name: 'Ancient Coins',
    icon: <Crown className="w-6 h-6" />,
    count: '245+',
    href: '/category/ancient',
    gradient: 'from-amber-500 to-orange-600'
  },
  {
    name: 'Modern Coins',
    icon: <Coins className="w-6 h-6" />,
    count: '1.2k+',
    href: '/category/modern',
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    name: 'Error Coins',
    icon: <Star className="w-6 h-6" />,
    count: '89+',
    href: '/category/error',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    name: 'Live Auctions',
    icon: <Clock className="w-6 h-6" />,
    count: '126+',
    href: '/auctions',
    gradient: 'from-red-500 to-rose-600'
  },
  {
    name: 'Graded Coins',
    icon: <Shield className="w-6 h-6" />,
    count: '567+',
    href: '/category/graded',
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    name: 'Trending',
    icon: <TrendingUp className="w-6 h-6" />,
    count: '89+',
    href: '/category/trending',
    gradient: 'from-orange-500 to-red-600'
  },
  {
    name: 'European',
    icon: <Globe className="w-6 h-6" />,
    count: '432+',
    href: '/category/european',
    gradient: 'from-cyan-500 to-blue-600'
  },
  {
    name: 'American',
    icon: <MapPin className="w-6 h-6" />,
    count: '678+',
    href: '/category/american',
    gradient: 'from-red-600 to-pink-600'
  },
  {
    name: 'Asian',
    icon: <Globe className="w-6 h-6" />,
    count: '234+',
    href: '/category/asian',
    gradient: 'from-yellow-500 to-orange-600'
  },
  {
    name: 'Gold Coins',
    icon: <DollarSign className="w-6 h-6" />,
    count: '345+',
    href: '/category/gold',
    gradient: 'from-yellow-600 to-amber-600'
  },
  {
    name: 'Silver Coins',
    icon: <Coins className="w-6 h-6" />,
    count: '789+',
    href: '/category/silver',
    gradient: 'from-gray-500 to-slate-600'
  },
  {
    name: 'Rare',
    icon: <Crown className="w-6 h-6" />,
    count: '156+',
    href: '/category/rare',
    gradient: 'from-purple-600 to-indigo-700'
  }
];

const CategoriesGrid = () => {
  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Shop by Category
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our curated collections of coins from around the world and throughout history
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={category.href}
            className="group text-center p-6 bg-white rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {category.icon}
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-gray-700">
              {category.name}
            </h3>
            <p className="text-xs text-gray-500 group-hover:text-gray-600">
              {category.count}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesGrid;
