
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CoinCard from '@/components/CoinCard';
import { COIN_CATEGORIES, CoinCategory } from '@/types/category';
import { Card, CardContent } from '@/components/ui/card';

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  
  const categoryInfo = COIN_CATEGORIES.find(cat => cat.id === categoryName);

  const { data: coins = [], isLoading } = useQuery({
    queryKey: ['coins', 'category', categoryName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles!coins_user_id_fkey (
            id,
            name,
            reputation,
            verified_dealer,
            avatar_url
          )
        `)
        .eq('category', categoryName as CoinCategory)
        .eq('authentication_status', 'verified')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!categoryName && !!categoryInfo,
  });

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
                <p className="text-gray-600">The requested category does not exist.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{categoryInfo.icon}</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {categoryInfo.name}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {categoryInfo.description}
            </p>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{coins.length}</div>
                <div className="text-sm text-gray-600">Available Coins</div>
              </div>
            </div>
          </div>

          {/* Coins Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : coins.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {coins.map((coin) => (
                <CoinCard key={coin.id} coin={coin} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Coins Found</h3>
                <p className="text-gray-600 mb-6">
                  No coins are currently available in this category.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
