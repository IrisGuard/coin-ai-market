
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Coins, Star, Clock, Globe, Crown, Zap, 
  Trophy, Shield, Diamond, Heart, Target,
  Gem, Sparkles, Award, Medal, Gift,
  Bookmark, Flag, Map, Compass, Mountain
} from 'lucide-react';

// Icon mapping for categories
const iconMap: Record<string, any> = {
  'Ancient Coins': Clock,
  'Gold Coins': Crown,
  'Silver Coins': Star,
  'Bronze Coins': Medal,
  'Rare Coins': Diamond,
  'Error Coins': Zap,
  'Commemorative': Trophy,
  'World Coins': Globe,
  'US Coins': Flag,
  'European Coins': Map,
  'Asian Coins': Compass,
  'Modern Coins': Sparkles,
  'Medieval Coins': Shield,
  'Roman Coins': Mountain,
  'Greek Coins': Award,
  'Investment Grade': Target,
  'Bullion Coins': Gem,
  'Proof Coins': Heart,
  'Mint Sets': Gift,
  'Graded Coins': Bookmark,
  'Morgan Dollars': Coins,
  'Peace Dollars': Star,
  'Walking Liberty': Trophy,
  'Mercury Dimes': Zap,
  'Buffalo Nickels': Shield,
  'Wheat Pennies': Medal,
  'Liberty Dollars': Crown,
  'Seated Liberty': Diamond,
  'Barber Coins': Gem,
  'Franklin Half': Sparkles,
  default: Coins
};

const CategoryNavigationFromDatabase = () => {
  // Fetch categories from Supabase
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories-navigation'],
    queryFn: async () => {
      console.log('Fetching categories from Supabase...');
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      console.log(`✅ Loaded ${data?.length || 0} categories from database:`, data);
      
      // Add icons to database categories
      const categoriesWithIcons = (data || []).map((cat, index) => ({
        ...cat,
        icon: iconMap[cat.name] || iconMap.default
      }));

      return categoriesWithIcons;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Get coin counts per category
  const { data: categoryCounts = {} } = useQuery({
    queryKey: ['category-coin-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select('category')
        .not('category', 'is', null);
      
      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data?.forEach(coin => {
        if (coin.category) {
          counts[coin.category] = (counts[coin.category] || 0) + 1;
        }
      });
      
      return counts;
    }
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading categories from Supabase database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <p>Error loading categories: {error.message}</p>
        </div>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Retry Loading
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {categories.length} Live Categories from Supabase Database
        </h2>
        <div className="flex items-center justify-center gap-4">
          <Badge className="bg-green-600 text-white">
            ✅ {categories.length} Categories Loaded
          </Badge>
          <Badge className="bg-blue-600 text-white">
            🔴 LIVE DATABASE CONNECTION
          </Badge>
          <Badge className="bg-purple-600 text-white">
            🪙 {Object.values(categoryCounts).reduce((sum, count) => sum + count, 0)} Total Coins
          </Badge>
        </div>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="text-center py-8">
          <Coins className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Categories Found</h3>
          <p className="text-gray-500">No active categories in the database yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {categories.map((category, index) => {
            const IconComponent = category.icon || Coins;
            const coinCount = categoryCounts[category.name] || 0;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50 border-2 hover:border-blue-300">
                  <CardContent className="p-4 text-center">
                    <div className="mb-3">
                      <IconComponent className="h-8 w-8 mx-auto text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-sm text-gray-800 mb-1">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                        {category.description}
                      </p>
                    )}
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-xs">
                        #{category.display_order || index + 1}
                      </Badge>
                      {coinCount > 0 && (
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          {coinCount} coins
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Footer Actions */}
      <div className="text-center space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            🔄 Refresh Categories
          </Button>
          <Button 
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            📊 Category Statistics
          </Button>
          <Button 
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            ⚡ Browse All Coins
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          Live connection to Supabase • Real-time updates • Admin controls active
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigationFromDatabase;
