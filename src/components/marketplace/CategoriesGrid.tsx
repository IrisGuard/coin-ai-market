
import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Clock, Star, Globe, TrendingUp, Shield, Crown, DollarSign, MapPin, AlertCircle, Gavel } from 'lucide-react';
import { useCategoryStats } from '@/hooks/useCategoryStats';
import { Button } from '@/components/ui/button';

const CategoriesGrid = () => {
  const { stats, loading, error } = useCategoryStats();

  const formatCount = (count: number) => {
    if (count === 0) return '0';
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}k`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  // Always show all 12 categories
  const categories = [
    {
      name: 'Ancient Coins',
      icon: <Crown className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.ancient || 0),
      href: '/category/ancient',
      color: 'from-amber-400 to-orange-500',
      description: 'Pre-1000 AD coins'
    },
    {
      name: 'Modern Coins',
      icon: <Coins className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.modern || 0),
      href: '/category/modern',
      color: 'from-blue-400 to-indigo-500',
      description: '1900+ coins'
    },
    {
      name: 'Error Coins',
      icon: <Star className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.error || 0),
      href: '/category/error',
      color: 'from-purple-400 to-pink-500',
      description: 'Minting errors'
    },
    {
      name: 'Live Auctions',
      icon: <Gavel className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.auctions || 0),
      href: '/category/auctions',
      color: 'from-red-400 to-rose-500',
      description: 'Active auctions'
    },
    {
      name: 'Graded Coins',
      icon: <Shield className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.graded || 0),
      href: '/category/graded',
      color: 'from-green-400 to-emerald-500',
      description: 'PCGS/NGC certified'
    },
    {
      name: 'Trending',
      icon: <TrendingUp className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.trending || 0),
      href: '/category/trending',
      color: 'from-orange-400 to-red-500',
      description: 'Popular now'
    },
    {
      name: 'European',
      icon: <Globe className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.european || 0),
      href: '/category/european',
      color: 'from-cyan-400 to-blue-500',
      description: 'European coins'
    },
    {
      name: 'American',
      icon: <MapPin className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.american || 0),
      href: '/category/american',
      color: 'from-red-500 to-pink-500',
      description: 'US/Canada/Mexico'
    },
    {
      name: 'Asian',
      icon: <Globe className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.asian || 0),
      href: '/category/asian',
      color: 'from-yellow-400 to-orange-500',
      description: 'Asian countries'
    },
    {
      name: 'Gold Coins',
      icon: <DollarSign className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.gold || 0),
      href: '/category/gold',
      color: 'from-yellow-500 to-amber-500',
      description: 'Gold content'
    },
    {
      name: 'Silver Coins',
      icon: <Coins className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.silver || 0),
      href: '/category/silver',
      color: 'from-gray-400 to-slate-500',
      description: 'Silver content'
    },
    {
      name: 'Rare',
      icon: <Crown className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.rare || 0),
      href: '/category/rare',
      color: 'from-purple-500 to-indigo-600',
      description: 'Exceptional rarity'
    }
  ];

  if (error) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Shop by category
        </h2>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Failed to load category stats</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  // Check if there are no coins at all
  const totalCoins = Object.values(stats).reduce((sum, count) => sum + (count || 0), 0);
  const isEmpty = !loading && totalCoins === 0;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Shop by category
      </h2>
      
      {isEmpty && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Coins className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">No coins yet - Add sample data!</h3>
              <p className="text-sm text-blue-700">
                Go to Admin Panel → Sample Data Setup to populate all categories with coins.
              </p>
            </div>
            <Button asChild size="sm" className="ml-auto">
              <Link to="/admin">Go to Admin</Link>
            </Button>
          </div>
        </div>
      )}
      
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
            <p className="text-xs text-gray-600 mb-1">
              {category.count}
            </p>
            <p className="text-xs text-gray-400">
              {category.description}
            </p>
          </Link>
        ))}
      </div>
      
      {isEmpty && (
        <div className="text-center mt-8 py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">
            All 12 categories are ready - just waiting for coins to be added!
          </p>
          <Button asChild>
            <Link to="/admin">
              Add Sample Data Now
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoriesGrid;
