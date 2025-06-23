import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Clock, Star, Globe, TrendingUp, Shield, Crown, DollarSign, MapPin, AlertCircle, Gavel, FileText, Medal, Banknote, Target, Zap } from 'lucide-react';
import { useCategoryStats } from '@/hooks/useCategoryStats';

const CategoryNavigationFix = () => {
  const { stats, loading, error } = useCategoryStats();

  const formatCount = (count: number | undefined) => {
    if (!count || count === 0) return '0';
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}k`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  // 30 FINAL CATEGORIES - EXACT ORDER
  const categories = [
    {
      name: 'US Coins',
      icon: <MapPin className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.us),
      href: '/category/us',
      color: 'from-red-500 to-blue-500',
      description: 'United States coins'
    },
    {
      name: 'World Coins',
      icon: <Globe className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.world),
      href: '/category/world',
      color: 'from-green-400 to-blue-500',
      description: 'International coins'
    },
    {
      name: 'Ancient Coins',
      icon: <Crown className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.ancient),
      href: '/category/ancient',
      color: 'from-amber-400 to-orange-500',
      description: 'Pre-1000 AD'
    },
    {
      name: 'Modern Coins',
      icon: <Coins className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.modern),
      href: '/category/modern',
      color: 'from-blue-400 to-indigo-500',
      description: '1900+ coins'
    },
    {
      name: 'Gold Coins',
      icon: <DollarSign className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.gold),
      href: '/category/gold',
      color: 'from-yellow-500 to-amber-500',
      description: 'Gold content'
    },
    {
      name: 'Silver Coins',
      icon: <Coins className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.silver),
      href: '/category/silver',
      color: 'from-gray-400 to-slate-500',
      description: 'Silver content'
    },
    {
      name: 'Platinum Coins',
      icon: <Medal className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.platinum),
      href: '/category/platinum',
      color: 'from-slate-400 to-gray-600',
      description: 'Platinum content'
    },
    {
      name: 'Paper Money',
      icon: <Banknote className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.paper),
      href: '/category/paper',
      color: 'from-green-500 to-emerald-600',
      description: 'Currency notes'
    },
    {
      name: 'Graded Coins',
      icon: <Shield className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.graded),
      href: '/category/graded',
      color: 'from-green-400 to-emerald-500',
      description: 'Professionally graded'
    },
    {
      name: 'Commemorative Coins',
      icon: <Medal className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.commemorative),
      href: '/category/commemorative',
      color: 'from-purple-400 to-pink-500',
      description: 'Special occasions'
    },
    {
      name: 'Proof Coins',
      icon: <Star className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.proof),
      href: '/category/proof',
      color: 'from-indigo-400 to-purple-500',
      description: 'Mirror finish'
    },
    {
      name: 'Uncirculated Coins',
      icon: <Target className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.uncirculated),
      href: '/category/uncirculated',
      color: 'from-teal-400 to-cyan-500',
      description: 'Mint condition'
    },
    {
      name: 'Tokens & Medals',
      icon: <Medal className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.tokens),
      href: '/category/tokens',
      color: 'from-orange-400 to-red-500',
      description: 'Non-currency items'
    },
    {
      name: 'Bullion Bars',
      icon: <Coins className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.bullion),
      href: '/category/bullion',
      color: 'from-yellow-600 to-orange-600',
      description: 'Precious metal bars'
    },
    {
      name: 'American Coins',
      icon: <MapPin className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.american),
      href: '/category/american',
      color: 'from-red-500 to-pink-500',
      description: 'US/Canada/Mexico'
    },
    {
      name: 'European Coins',
      icon: <Globe className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.european),
      href: '/category/european',
      color: 'from-cyan-400 to-blue-500',
      description: 'European coins'
    },
    {
      name: 'Asian Coins',
      icon: <Globe className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.asian),
      href: '/category/asian',
      color: 'from-yellow-400 to-orange-500',
      description: 'Asian countries'
    },
    {
      name: 'African Coins',
      icon: <Globe className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.african),
      href: '/category/african',
      color: 'from-green-600 to-teal-600',
      description: 'African nations'
    },
    {
      name: 'Australian Coins',
      icon: <Globe className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.australian),
      href: '/category/australian',
      color: 'from-blue-600 to-indigo-600',
      description: 'Australia/Oceania'
    },
    {
      name: 'South American Coins',
      icon: <Globe className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.south_american),
      href: '/category/south-american',
      color: 'from-emerald-500 to-green-600',
      description: 'South America'
    },
    {
      name: 'Error Coins',
      icon: <Star className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.error),
      href: '/category/error',
      color: 'from-purple-400 to-pink-500',
      description: 'Minting errors'
    },
    {
      name: 'Double Die',
      icon: <Zap className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.double_die),
      href: '/category/double-die',
      color: 'from-red-400 to-pink-500',
      description: 'Double strike error'
    },
    {
      name: 'Off-Center Strike',
      icon: <Target className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.off_center),
      href: '/category/off-center',
      color: 'from-orange-400 to-red-500',
      description: 'Misaligned strike'
    },
    {
      name: 'Clipped Planchet',
      icon: <Coins className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.clipped),
      href: '/category/clipped',
      color: 'from-blue-400 to-purple-500',
      description: 'Missing metal'
    },
    {
      name: 'Broadstrike',
      icon: <Coins className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.broadstrike),
      href: '/category/broadstrike',
      color: 'from-teal-400 to-blue-500',
      description: 'Expanded coin'
    },
    {
      name: 'Die Crack',
      icon: <Zap className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.die_crack),
      href: '/category/die-crack',
      color: 'from-gray-500 to-slate-600',
      description: 'Cracked die mark'
    },
    {
      name: 'Lamination Error',
      icon: <Coins className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.lamination),
      href: '/category/lamination',
      color: 'from-amber-400 to-yellow-500',
      description: 'Metal separation'
    },
    {
      name: 'Wrong Planchet',
      icon: <AlertCircle className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.wrong_planchet),
      href: '/category/wrong-planchet',
      color: 'from-pink-400 to-rose-500',
      description: 'Wrong metal type'
    },
    {
      name: 'Rotated Die',
      icon: <Clock className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.rotated_die),
      href: '/category/rotated-die',
      color: 'from-indigo-500 to-purple-600',
      description: 'Twisted alignment'
    },
    {
      name: 'Cud Error',
      icon: <Zap className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.cud_error),
      href: '/category/cud-error',
      color: 'from-red-600 to-pink-600',
      description: 'Die break error'
    }
  ];

  if (error) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Shop by Category
        </h2>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Failed to load category statistics</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  // Check if there are no coins at all
  const totalCoins = Object.values(stats).reduce((sum: number, count) => {
    return sum + (typeof count === 'number' ? count : 0);
  }, 0);
  const isEmpty = !loading && totalCoins === 0;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Shop by Category
      </h2>
      
      <div className="grid grid-cols-5 gap-6">
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
    </div>
  );
};

export default CategoryNavigationFix;
