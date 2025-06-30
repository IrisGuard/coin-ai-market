import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStore } from '@/contexts/AdminStoreContext';
import { useStoreFilteredCoins } from '@/hooks/useStoreFilteredCoins';
import { toast } from 'sonner';
import { Coins, Edit, Trash2, Eye, Camera } from 'lucide-react';
import CoinImageEditor from './CoinImageEditor';

interface Coin {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  grade: string;
  year: number;
  category: string;
  authentication_status: string;
  sold: boolean;
  featured: boolean;
  created_at: string;
}

const DealerCoinsList = () => {
  const { user } = useAuth();
  const { isAdminUser, selectedStoreId } = useAdminStore();
  const queryClient = useQueryClient();
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [editingCoin, setEditingCoin] = useState<Coin | null>(null);

  const { data: coins = [], isLoading } = useStoreFilteredCoins();

  const deleteMutation = useMutation({
    mutationFn: async (coinId: string) => {
      const { error } = await supabase
        .from('coins')
        .delete()
        .eq('id', coinId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-filtered-coins'] });
      queryClient.invalidateQueries({ queryKey: ['dealer-coins', user?.id] });
      toast.success('Coin deleted successfully');
      setSelectedCoin(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete coin: ${error.message}`);
    }
  });

  const handleDelete = (coinId: string) => {
    deleteMutation.mutate(coinId);
  };

  const handleEdit = (coinId: string) => {
    // Navigate to upload page with edit parameter for photo editing and coin details
    window.open(`/upload?edit=${coinId}`, '_blank');
  };

  const handleEditImages = (coin: Coin) => {
    setEditingCoin(coin);
  };

  const handleImagesUpdated = (newImages: string[]) => {
    // Refresh the coins list to show updated images
    queryClient.invalidateQueries({ queryKey: ['store-filtered-coins'] });
    queryClient.invalidateQueries({ queryKey: ['dealer-coins', user?.id] });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getValidImages = (coin: Coin): string[] => {
    const allImages: string[] = [];
    
    if (coin.images && Array.isArray(coin.images) && coin.images.length > 0) {
      const validImages = coin.images.filter(img => 
        img && typeof img === 'string' && img.trim() !== '' && !img.startsWith('blob:')
      );
      allImages.push(...validImages);
    }
    
    if (allImages.length === 0 && coin.image && !coin.image.startsWith('blob:')) {
      allImages.push(coin.image);
    }
    
    return allImages;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading your inventory...</div>
        </CardContent>
      </Card>
    );
  }

  if (isAdminUser && !selectedStoreId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-6 w-6" />
            Store Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Please select a store first</p>
            <p className="text-sm">Go to the "Store Management" tab to select a store and view its inventory.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-6 w-6" />
            {isAdminUser ? 'Store Inventory' : 'My Inventory'} ({coins.length} coins)
            {isAdminUser && selectedStoreId && (
              <Badge variant="outline" className="ml-2">
                Store Scoped
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {coins.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No coins in this {isAdminUser ? 'store' : 'inventory'} yet.</p>
              <p className="text-sm">Upload your first coin to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coins.map((coin) => {
                const validImages = getValidImages(coin);
                
                return (
                  <Card key={coin.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      <img
                        src={validImages[0] || '/placeholder.svg'}
                        alt={coin.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      {coin.featured && (
                        <Badge className="absolute top-2 left-2 bg-yellow-500">
                          Featured
                        </Badge>
                      )}
                      {coin.sold && (
                        <Badge className="absolute top-2 right-2 bg-red-500">
                          Sold
                        </Badge>
                      )}
                      {validImages.length > 1 && (
                        <Badge className="absolute bottom-2 left-2 bg-blue-500">
                          {validImages.length} photos
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 truncate">{coin.name}</h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Year:</span>
                          <span className="font-medium">{coin.year}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Grade:</span>
                          <span className="font-medium">{coin.grade}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Price:</span>
                          <span className="font-bold text-green-600">${coin.price.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Status:</span>
                          <Badge className={getStatusColor(coin.authentication_status)}>
                            {coin.authentication_status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/coin/${coin.id}`, '_blank')}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditImages(coin)}
                          className="flex-1"
                        >
                          <Camera className="h-4 w-4 mr-1" />
                          Images
                        </Button>
                      </div>
                      
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(coin.id)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Coin</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{coin.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(coin.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Editor Modal */}
      {editingCoin && (
        <Dialog open={!!editingCoin} onOpenChange={() => setEditingCoin(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                Edit Images - {editingCoin.name}
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

export default DealerCoinsList;
