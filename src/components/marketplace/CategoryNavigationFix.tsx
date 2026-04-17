import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Globe, Crown, Coins, DollarSign, Medal, Banknote, Shield, Star, Target, AlertCircle, Clock, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const FALLBACK_CATEGORIES = [
  { id: 'coins', name: 'Coins', description: 'Authenticated collectible coins and numismatic rarities.', slug: 'world', icon: 'Coins' },
  { id: 'banknotes', name: 'Banknotes', description: 'Paper money, notes, and banknote errors.', slug: 'banknotes', icon: 'Banknote' },
  { id: 'bullion', name: 'Bullion', description: 'Gold and silver bullion for collectors and investors.', slug: 'bullion', icon: 'DollarSign' },
];

const CategoryNavigationFix = () => {
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
    retry: 1,
    refetchInterval: 30000,
  });

  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['phase4-category-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_category_stats');
      if (error) throw error;
      return data || {};
    },
    retry: 1,
    refetchInterval: 60000,
  });

  const iconMap: { [key: string]: React.ReactNode } = {
    MapPin: <MapPin className="w-6 h-6" />,
    Globe: <Globe className="w-6 h-6" />,
    Crown: <Crown className="w-6 h-6" />,
    Coins: <Coins className="w-6 h-6" />,
    DollarSign: <DollarSign className="w-6 h-6" />,
    Medal: <Medal className="w-6 h-6" />,
    Banknote: <Banknote className="w-6 h-6" />,
    Shield: <Shield className="w-6 h-6" />,
    Star: <Star className="w-6 h-6" />,
    Target: <Target className="w-6 h-6" />,
    AlertCircle: <AlertCircle className="w-6 h-6" />,
    Clock: <Clock className="w-6 h-6" />,
    Zap: <Zap className="w-6 h-6" />,
  };

  const formatCount = (count: number) => {
    if (count === 0) return '0';
    if (count < 1000) return count.toString();
    if (count < 1000000) return Math.floor(count / 1000) + 'k';
    return Math.floor(count / 1000000) + 'M';
  };

  const getCategoryCount = (categoryName: string) => {
    const key = categoryName.toLowerCase().replace(/\s+/g, '_').replace(/[&]/g, '');
    return (stats as Record<string, number>)[key] || 0;
  };

  const effectiveCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES;
  const usingFallback = categories.length === 0;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Shop by Category
      </h2>
      <p className="text-muted-foreground mb-8 text-center">
        {usingFallback
          ? 'Core platform categories are available while live category data is being verified.'
          : `Explore our comprehensive collection across ${effectiveCategories.length} specialized categories`}
      </p>

      {error && usingFallback && (
        <div className="glass-panel rounded-xl p-4 mb-6 text-sm text-muted-foreground flex items-start gap-3">
          <AlertCircle className="h-4 w-4 mt-0.5 text-warning" />
          <span>Live categories could not be loaded right now, so the homepage is showing the core category set instead.</span>
        </div>
      )}

      {loading && !usingFallback ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="glass-panel rounded-xl p-4 animate-pulse h-52" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
          {effectiveCategories.map((category: any) => {
            const slug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, '');
            const href = `/category/${slug}`;
            const count = usingFallback || statsLoading ? '—' : formatCount(getCategoryCount(category.name));

            return (
              <Link
                key={category.id}
                to={href}
                className="group relative glass-panel rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border"
              >
                <div className="relative z-10">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 p-3 bg-primary/10 rounded-full text-primary">
                      {iconMap[category.icon] || <Coins className="w-6 h-6" />}
                    </div>
                    <h3 className="font-bold text-foreground mb-1 text-sm leading-tight">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
                      {category.description}
                    </p>
                    <div className="bg-secondary px-2 py-1 rounded-full">
                      <span className="text-foreground font-bold text-xs">
                        {count}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryNavigationFix;
