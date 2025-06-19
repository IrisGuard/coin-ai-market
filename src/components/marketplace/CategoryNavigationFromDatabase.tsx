
import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Clock, Star, Globe, TrendingUp, Shield, Crown, DollarSign, MapPin, AlertCircle, Gavel, FileText, Medal, Banknote, Target, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCategoryStats } from '@/hooks/useCategoryStats';

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  color?: string;
  created_at: string;
  updated_at: string;
}

const CategoryNavigationFromDatabase = () => {
  const { stats, loading, error } = useCategoryStats();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['homepage-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Category[] || [];
    }
  });

  // Real-time category coin counts
  const { data: categoryCounts = {} } = useQuery({
    queryKey: ['category-coin-counts'],
    queryFn: async () => {
      const { data: coins } = await supabase
        .from('coins')
        .select('category');
      
      const counts: Record<string, number> = {};
      coins?.forEach(coin => {
        if (coin.category) {
          counts[coin.category] = (counts[coin.category] || 0) + 1;
        }
      });
      
      return counts;
    }
  });

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'MapPin': <MapPin className="w-6 h-6" />,
      'Globe': <Globe className="w-6 h-6" />,
      'Crown': <Crown className="w-6 h-6" />,
      'Coins': <Coins className="w-6 h-6" />,
      'DollarSign': <DollarSign className="w-6 h-6" />,
      'Medal': <Medal className="w-6 h-6" />,
      'Banknote': <Banknote className="w-6 h-6" />,
      'Shield': <Shield className="w-6 h-6" />,
      'Star': <Star className="w-6 h-6" />,
      'Target': <Target className="w-6 h-6" />,
      'AlertCircle': <AlertCircle className="w-6 h-6" />,
      'Clock': <Clock className="w-6 h-6" />,
      'Zap': <Zap className="w-6 h-6" />
    };
    return icons[iconName] || <Coins className="w-6 h-6" />;
  };

  const formatCount = (count: number) => {
    if (count === 0) return '0';
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}k`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  const getCategoryStats = (categoryName: string) => {
    // Use real data from categoryCounts, with stats mapping as fallback
    const realCount = categoryCounts[categoryName];
    if (realCount !== undefined) return realCount;

    // Enhanced mapping for all 30+ categories
    const statsMap: { [key: string]: string } = {
      'US Coins': 'american',
      'World Coins': 'world',
      'Ancient Coins': 'ancient',
      'Modern Coins': 'modern',
      'Gold Coins': 'gold',
      'Silver Coins': 'silver',
      'Platinum Coins': 'platinum',
      'Paper Money': 'paper',
      'Graded Coins': 'graded',
      'Error Coins': 'error',
      'Commemorative Coins': 'commemorative',
      'Proof Coins': 'proof',
      'Mint Sets': 'mint_sets',
      'Type Coins': 'type',
      'Key Date Coins': 'key_date',
      'Bullion Coins': 'bullion',
      'Colonial Coins': 'colonial',
      'Civil War Tokens': 'civil_war',
      'Trade Dollars': 'trade',
      'Half Cents': 'half_cent',
      'Large Cents': 'large_cent',
      'Flying Eagle Cents': 'flying_eagle',
      'Indian Head Cents': 'indian_head',
      'Lincoln Cents': 'lincoln',
      'Two Cent Pieces': 'two_cent',
      'Three Cent Pieces': 'three_cent',
      'Half Dimes': 'half_dime',
      'Twenty Cent Pieces': 'twenty_cent',
      'Gold Dollars': 'gold_dollar',
      'Double Eagles': 'double_eagle'
    };
    
    const statKey = statsMap[categoryName];
    return statKey ? stats[statKey] || 0 : 0; // Remove Math.random fallback
  };

  if (categoriesLoading || loading) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shop by Category</h2>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Failed to load categories</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shop by Category</h2>
      <p className="text-gray-600 mb-8 text-center">Explore our comprehensive collection of {categories.length} specialized coin categories</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="group text-center p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200"
          >
            <div className={`w-16 h-16 mx-auto mb-3 bg-gradient-to-br ${category.color || 'from-blue-400 to-indigo-500'} rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
              {category.image_url ? (
                <img 
                  src={category.image_url} 
                  alt={category.name}
                  className="w-10 h-10 object-cover rounded-full"
                />
              ) : (
                getIconComponent(category.icon || 'Coins')
              )}
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
              {category.name}
            </h3>
            <p className="text-xs text-gray-600 mb-1">
              {loading ? '...' : formatCount(getCategoryStats(category.name))} items
            </p>
            {category.description && (
              <p className="text-xs text-gray-400 line-clamp-2">
                {category.description}
              </p>
            )}
          </Link>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Link 
          to="/marketplace" 
          className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
        >
          <Coins className="w-5 h-5 mr-2" />
          Browse All Categories
        </Link>
      </div>
    </div>
  );
};

export default CategoryNavigationFromDatabase;
