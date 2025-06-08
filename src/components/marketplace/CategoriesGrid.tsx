
import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Clock, Star, Globe, TrendingUp, Shield, Crown, DollarSign, MapPin } from 'lucide-react';
import { useCategoryStats } from '@/hooks/useCategoryStats';

const CategoriesGrid = () => {
  const { stats, loading } = useCategoryStats();

  const formatCount = (count: number) => {
    if (count === 0) return '0';
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}k`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  const categories = [
    {
      name: 'Ancient Coins',
      icon: <Crown className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.ancient || 0),
      href: '/category/ancient',
      color: 'from-amber-400 to-orange-500'
    },
    {
      name: 'Modern Coins',
      icon: <Coins className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.modern || 0),
      href: '/category/modern',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      name: 'Error Coins',
      icon: <Star className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.error || 0),
      href: '/category/error',
      color: 'from-purple-400 to-pink-500'
    },
    {
      name: 'Live Auctions',
      icon: <Clock className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.auctions || 0),
      href: '/auctions',
      color: 'from-red-400 to-rose-500'
    },
    {
      name: 'Graded Coins',
      icon: <Shield className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.graded || 0),
      href: '/category/graded',
      color: 'from-green-400 to-emerald-500'
    },
    {
      name: 'Trending',
      icon: <TrendingUp className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.trending || 0),
      href: '/category/trending',
      color: 'from-orange-400 to-red-500'
    },
    {
      name: 'European',
      icon: <Globe className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.european || 0),
      href: '/category/european',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      name: 'American',
      icon: <MapPin className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.american || 0),
      href: '/category/american',
      color: 'from-red-500 to-pink-500'
    },
    {
      name: 'Asian',
      icon: <Globe className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.asian || 0),
      href: '/category/asian',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      name: 'Gold Coins',
      icon: <DollarSign className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.gold || 0),
      href: '/category/gold',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      name: 'Silver Coins',
      icon: <Coins className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.silver || 0),
      href: '/category/silver',
      color: 'from-gray-400 to-slate-500'
    },
    {
      name: 'Rare',
      icon: <Crown className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.rare || 0),
      href: '/category/rare',
      color: 'from-purple-500 to-indigo-600'
    }
  ];

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
