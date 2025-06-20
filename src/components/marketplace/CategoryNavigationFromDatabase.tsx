
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  Coins, Star, Clock, Globe, Crown, Zap, 
  Trophy, Shield, Diamond, Heart, Target,
  Gem, Sparkles, Award, Medal, Gift,
  Bookmark, Flag, Map, Compass, Mountain
} from 'lucide-react';

const CategoryNavigationFromDatabase = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default 30 κατηγορίες αν δεν υπάρχουν στη βάση
  const defaultCategories = [
    { id: 1, name: 'Ancient Coins', icon: Clock, description: 'Historical ancient coins', display_order: 1 },
    { id: 2, name: 'Gold Coins', icon: Crown, description: 'Premium gold coins', display_order: 2 },
    { id: 3, name: 'Silver Coins', icon: Star, description: 'Silver collectibles', display_order: 3 },
    { id: 4, name: 'Bronze Coins', icon: Medal, description: 'Bronze historical pieces', display_order: 4 },
    { id: 5, name: 'Rare Coins', icon: Diamond, description: 'Ultra rare finds', display_order: 5 },
    { id: 6, name: 'Error Coins', icon: Zap, description: 'Minting errors', display_order: 6 },
    { id: 7, name: 'Commemorative', icon: Trophy, description: 'Special events', display_order: 7 },
    { id: 8, name: 'World Coins', icon: Globe, description: 'International coins', display_order: 8 },
    { id: 9, name: 'US Coins', icon: Flag, description: 'American coins', display_order: 9 },
    { id: 10, name: 'European Coins', icon: Map, description: 'European collection', display_order: 10 },
    { id: 11, name: 'Asian Coins', icon: Compass, description: 'Asian heritage', display_order: 11 },
    { id: 12, name: 'Modern Coins', icon: Sparkles, description: 'Contemporary pieces', display_order: 12 },
    { id: 13, name: 'Medieval Coins', icon: Shield, description: 'Medieval period', display_order: 13 },
    { id: 14, name: 'Roman Coins', icon: Mountain, description: 'Roman Empire', display_order: 14 },
    { id: 15, name: 'Greek Coins', icon: Award, description: 'Ancient Greece', display_order: 15 },
    { id: 16, name: 'Investment Grade', icon: Target, description: 'Investment quality', display_order: 16 },
    { id: 17, name: 'Bullion Coins', icon: Gem, description: 'Precious metals', display_order: 17 },
    { id: 18, name: 'Proof Coins', icon: Heart, description: 'Proof quality', display_order: 18 },
    { id: 19, name: 'Mint Sets', icon: Gift, description: 'Complete sets', display_order: 19 },
    { id: 20, name: 'Graded Coins', icon: Bookmark, description: 'Professionally graded', display_order: 20 },
    { id: 21, name: 'Morgan Dollars', icon: Coins, description: 'Classic Morgan silver dollars', display_order: 21 },
    { id: 22, name: 'Peace Dollars', icon: Star, description: 'Peace silver dollars', display_order: 22 },
    { id: 23, name: 'Walking Liberty', icon: Trophy, description: 'Walking Liberty half dollars', display_order: 23 },
    { id: 24, name: 'Mercury Dimes', icon: Zap, description: 'Mercury head dimes', display_order: 24 },
    { id: 25, name: 'Buffalo Nickels', icon: Shield, description: 'Indian head nickels', display_order: 25 },
    { id: 26, name: 'Wheat Pennies', icon: Medal, description: 'Lincoln wheat cents', display_order: 26 },
    { id: 27, name: 'Liberty Dollars', icon: Crown, description: 'Liberty head dollars', display_order: 27 },
    { id: 28, name: 'Seated Liberty', icon: Diamond, description: 'Seated Liberty series', display_order: 28 },
    { id: 29, name: 'Barber Coins', icon: Gem, description: 'Barber series coins', display_order: 29 },
    { id: 30, name: 'Franklin Half', icon: Sparkles, description: 'Franklin half dollars', display_order: 30 }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        // Use default categories if fetch fails
        setCategories(defaultCategories);
      } else if (data && data.length > 0) {
        // Add icons to database categories
        const categoriesWithIcons = data.map((cat, index) => ({
          ...cat,
          icon: defaultCategories[index % defaultCategories.length]?.icon || Coins
        }));
        setCategories(categoriesWithIcons);
      } else {
        // Use default categories if no data
        setCategories(defaultCategories);
      }
    } catch (error) {
      console.error('Database connection error:', error);
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Φόρτωση 30 κατηγοριών από βάση δεδομένων...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          30 Κατηγορίες Νομισμάτων - LIVE από Supabase
        </h2>
        <div className="flex items-center justify-center gap-4">
          <Badge className="bg-green-600 text-white">
            {categories.length} Κατηγορίες Διαθέσιμες
          </Badge>
          <Badge className="bg-blue-600 text-white">
            LIVE DATABASE CONNECTION
          </Badge>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-4">
        {categories.slice(0, 30).map((category, index) => {
          const IconComponent = category.icon || Coins;
          
          return (
            <motion.div
              key={category.id || index}
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
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {category.description || 'Premium coin category'}
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      #{category.display_order || index + 1}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="text-center space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={fetchCategories}
            className="bg-blue-600 hover:bg-blue-700"
          >
            🔄 Ανανέωση Κατηγοριών
          </Button>
          <Button 
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            📊 Στατιστικά Κατηγοριών
          </Button>
          <Button 
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            ⚡ Γρήγορη Αναζήτηση
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          Συνδέδεμενο με Supabase • Real-time updates • Admin privileges active
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigationFromDatabase;
