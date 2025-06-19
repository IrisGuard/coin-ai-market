
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Coins, TrendingUp, Star, Package } from 'lucide-react';

const CategoriesGrid = () => {
  // Fetch real categories from Supabase
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories-with-stats'],
    queryFn: async () => {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (categoriesError) throw categoriesError;

      // Get coin counts for each category
      const categoriesWithStats = await Promise.all(
        (categoriesData || []).map(async (category) => {
          const { count } = await supabase
            .from('coins')
            .select('*', { count: 'exact', head: true })
            .eq('category', category.name);
          
          return {
            ...category,
            coinCount: count || 0
          };
        })
      );

      return categoriesWithStats;
    }
  });

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Ancient Coins': <Coins className="w-6 h-6" />,
      'Modern Coins': <Star className="w-6 h-6" />,
      'Commemorative': <Package className="w-6 h-6" />,
      'Error Coins': <TrendingUp className="w-6 h-6" />
    };
    return iconMap[categoryName] || <Coins className="w-6 h-6" />;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Error loading categories. Please try again.</p>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8">
        <Coins className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Categories Available</h3>
        <p className="text-gray-600">Categories will appear here once they are added to the system.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={category.id} to={`/category/${encodeURIComponent(category.name)}`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-blue-600">
                    {getCategoryIcon(category.name)}
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <Badge variant="secondary">
                  {category.coinCount} coins
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {category.description || `Explore ${category.name.toLowerCase()} in our marketplace`}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Available listings
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CategoriesGrid;
