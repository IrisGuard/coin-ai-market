
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, Store, Package, TrendingUp } from 'lucide-react';
import CoinImageEditor from './CoinImageEditor';

interface StoreManagerProps {
  onStoreSelect?: (storeId: string) => void;
  selectedStoreId?: string;
}

const StoreManager: React.FC<StoreManagerProps> = ({ 
  onStoreSelect, 
  selectedStoreId 
}) => {
  const { user } = useAuth();
  const [editingCoin, setEditingCoin] = useState<any>(null);

  // Fetch user's coins for store management
  const { data: coins = [], refetch: refetchCoins } = useQuery({
    queryKey: ['store-coins', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch store info
  const { data: store } = useQuery({
    queryKey: ['user-store', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleEditImages = (coin: any) => {
    setEditingCoin(coin);
  };

  const handleImagesUpdated = () => {
    refetchCoins();
    setEditingCoin(null);
  };

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

  const totalValue = coins.reduce((sum, coin) => sum + (coin.price || 0), 0);
  const featuredCoins = coins.filter(coin => coin.featured).length;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Store className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Store Manager</h1>
            <p className="text-gray-600">Manage your coin store and inventory</p>
          </div>
        </div>

        {/* Store Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{coins.length}</div>
              <p className="text-xs text-muted-foreground">coins listed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured Items</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{featuredCoins}</div>
              <p className="text-xs text-muted-foreground">featured coins</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">inventory value</p>
            </CardContent>
          </Card>
        </div>

        {/* Store Information */}
        {store && (
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">{store.name}</h3>
                  <p className="text-gray-600 text-sm">{store.description}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <span className={`text-sm px-2 py-1 rounded ${store.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {store.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Verified:</span>
                    <span className={`text-sm px-2 py-1 rounded ${store.verified ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {store.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Management Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Inventory Image Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coins.map((coin) => {
                const validImages = getValidImages(coin);
                return (
                  <div key={coin.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={validImages[0] || '/placeholder.svg'} 
                        alt={coin.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{coin.name}</h4>
                        <p className="text-sm text-gray-500">
                          {coin.year} • {coin.country}
                        </p>
                        <p className="text-sm text-gray-500">
                          {validImages.length} image{validImages.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Price: ${coin.price}</span>
                        <span className={coin.featured ? 'text-yellow-600' : 'text-gray-500'}>
                          {coin.featured ? 'Featured' : 'Standard'}
                        </span>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditImages(coin)}
                        className="w-full"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Manage Images ({validImages.length})
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {coins.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No coins in your inventory yet.</p>
                <p className="text-sm">Upload your first coin to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Image Editor Modal */}
      {editingCoin && (
        <Dialog open={!!editingCoin} onOpenChange={() => setEditingCoin(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                Manage Images - {editingCoin.name}
              </DialogTitle>
            </DialogHeader>
            <CoinImageEditor
              coinId={editingCoin.id}
              coinName={editingCoin.name}
              currentImages={getValidImages(editingCoin)}
              onImagesUpdated={handleImagesUpdated}
              maxImages={10}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default StoreManager;
