
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Star, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const PersonalizedRecommendations = () => {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['personalized-recommendations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get user's favorites to understand preferences
      const { data: favorites } = await supabase
        .from('favorites')
        .select(`
          coins (
            category,
            rarity,
            country,
            year
          )
        `)
        .eq('user_id', user.id);

      // Extract categories from user's favorites
      const preferredCategories = [...new Set(
        favorites?.map(fav => fav.coins?.category).filter(Boolean) || []
      )];

      // Get recommended coins based on preferences
      const { data: coins, error } = await supabase
        .from('coins')
        .select('*')
        .in('category', preferredCategories.length > 0 ? preferredCategories : ['american', 'european'])
        .eq('authentication_status', 'verified')
        .neq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return coins || [];
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          Personalized Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations?.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-muted-foreground">
              Add some coins to your favorites to get personalized recommendations
            </div>
          ) : (
            recommendations?.map((coin) => (
              <div key={coin.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img 
                    src={coin.image} 
                    alt={coin.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-sm mb-2">{coin.name}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-purple-600">${coin.price}</span>
                  <Badge variant="outline" className="text-xs">
                    {coin.rarity}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <Star className="h-3 w-3" />
                  <span>Based on your favorites</span>
                </div>
                <Button size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedRecommendations;
