import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Edit, Eye, DollarSign, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStore } from '@/contexts/AdminStoreContext';
import CoinImageManagerModal from './CoinImageManagerModal';

const MyCoinsTab: React.FC = () => {
  const [editingCoin, setEditingCoin] = useState<any>(null);
  const { user } = useAuth();
  const { selectedStoreId: adminSelectedStoreId, isAdminUser } = useAdminStore();
  const effectiveSelectedStoreId = isAdminUser ? adminSelectedStoreId : null;

  // Fetch user's coins
  const { data: myCoins = [], refetch: refetchCoins, isLoading } = useQuery({
    queryKey: ['my-coins', user?.id, effectiveSelectedStoreId],
    queryFn: async () => {
      if (!user?.id) return [];
      
      let query = supabase
        .from('coins')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (effectiveSelectedStoreId) {
        query = query.eq('store_id', effectiveSelectedStoreId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const getValidImages = (coin: any): string[] => {
    const allImages: string[] = [];
    
    if (coin.images && Array.isArray(coin.images) && coin.images.length > 0) {
      const validImages = coin.images.filter((img: string) => 
        img && typeof img === 'string' && img.trim() !== '' && !img.startsWith('blob:')
      );
      allImages.push(...validImages);
    }
    
    if (allImages.length === 0 && coin.image && !coin.image.startsWith('blob:')) {
      allImages.push(coin.image);
    }
    
    return allImages;
  };

  const handleImagesUpdated = () => {
    // Only refresh the data - don't close the modal
    refetchCoins();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            My Coins - Image Management
            <Badge variant="outline">
              {myCoins.length} coins
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myCoins.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No coins uploaded yet
              </h3>
              <p className="text-gray-500">
                Go to "Smart Upload" to add your first coin
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {myCoins.map((coin) => {
                const validImages = getValidImages(coin);
                return (
                  <div key={coin.id} className="group border rounded-lg p-4 hover:shadow-lg transition-all duration-200 bg-white">
                    <div className="relative mb-4">
                      <img 
                        src={validImages[0] || '/placeholder.svg'} 
                        alt={coin.name}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      
                      {/* Image count badge */}
                      <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                        <Camera className="h-3 w-3 mr-1" />
                        {validImages.length}
                      </Badge>
                      
                      {/* Featured badge */}
                      {coin.featured && (
                        <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                          ⭐ Featured
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-lg truncate">{coin.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{coin.year}</span>
                          <span>•</span>
                          <span>{coin.country}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-600">${coin.price}</span>
                        </div>
                        <Badge variant={coin.authentication_status === 'verified' ? 'default' : 'secondary'}>
                          {coin.authentication_status === 'verified' ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{coin.views || 0} views</span>
                        </div>
                        <span>Grade: {coin.grade}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <Button
                          onClick={() => setEditingCoin(coin)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                          Edit Images ({validImages.length})
                        </Button>
                        
                        <div className="text-xs text-center text-gray-500">
                          Bulk Upload • Replace • Delete
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Manager Modal - Enhanced with explicit close button */}
      <CoinImageManagerModal
        isOpen={!!editingCoin}
        onClose={() => setEditingCoin(null)}
        coin={editingCoin}
        onImagesUpdated={handleImagesUpdated}
      />
    </>
  );
};

export default MyCoinsTab;
