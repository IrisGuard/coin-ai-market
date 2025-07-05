import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Globe, Crown, Coins, DollarSign, Medal, 
  Banknote, Shield, Star, Target, AlertCircle, 
  Clock, Zap
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const CategoryNavigationFix = () => {
  // Phase 4: Use real database categories instead of hardcoded ones
  const { data: categories = [], isLoading: loading, error } = useQuery({
    queryKey: ['phase4-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000
  });

  // Get category statistics from the database function
  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['phase4-category-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_category_stats');
      if (error) throw error;
      return data || {};
    },
    refetchInterval: 60000
  });

  const iconMap: { [key: string]: React.ReactNode } = {
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

  const formatCount = (count: number) => {
    if (count === 0) return '0';
    if (count < 1000) return count.toString();
    if (count < 1000000) return Math.floor(count / 1000) + 'k';
    return Math.floor(count / 1000000) + 'M';
  };

  const getCategoryCount = (categoryName: string) => {
    const key = categoryName.toLowerCase().replace(/\s+/g, '_').replace(/[&]/g, '');
    return stats[key] || 0;
  };

  if (error) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Shop by Category
        </h2>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Failed to load categories</p>
          <p className="text-sm text-gray-500">{String(error)}</p>
        </div>
      </div>
    );
  }

  // Check if there are no categories
  const isEmpty = !loading && categories.length === 0;

  if (isEmpty) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Shop by Category
        </h2>
        <div className="text-center py-8">
          <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No categories available yet</p>
          <p className="text-sm text-gray-500">Categories are being loaded from the database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Shop by Category
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        Explore our comprehensive collection across {categories.length} specialized categories
      </p>
      
      <div className="grid grid-cols-5 gap-6">
        {categories.map((category) => {
          const href = `/category/${category.name.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, '')}`;
          const count = (loading || statsLoading) ? '...' : formatCount(getCategoryCount(category.name));
          
          return (
            <Link
              key={category.id}
              to={href}
              className="group relative bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="relative z-10">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 p-3 bg-blue-50 rounded-full">
                    {iconMap[category.icon] || <Coins className="w-6 h-6" />}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm leading-tight">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-xs mb-2">
                    {category.description}
                  </p>
                  <div className="bg-blue-100 px-2 py-1 rounded-full">
                    <span className="text-blue-800 font-bold text-xs">
                      {count}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNavigationFix;