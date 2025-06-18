
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, Edit, Trash2, Eye, Camera, Plus, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import AdminFinalCompletionTab from './AdminFinalCompletionTab';
import CoinImageEditor from '../../dealer/CoinImageEditor';
import type { CoinCategory } from '@/types/coin';

const AdminCoinsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | CoinCategory>('all');
  const [editingCoin, setEditingCoin] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch all coins
  const { data: coins = [], isLoading } = useQuery({
    queryKey: ['admin-coins', searchTerm, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('coins')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Delete coin mutation
  const deleteCoinMutation = useMutation({
    mutationFn: async (coinId: string) => {
      const { error } = await supabase
        .from('coins')
        .delete()
        .eq('id', coinId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Coin deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-coins'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete coin: ${error.message}`);
    }
  });

  const handleEditImages = (coin: any) => {
    setEditingCoin(coin);
  };

  const handleImagesUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-coins'] });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="management" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="management">Coin Management</TabsTrigger>
          <TabsTrigger value="completion">Final Completion</TabsTrigger>
        </TabsList>
        
        <TabsContent value="management" className="space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Coin Management
                <Badge variant="outline">{coins.length} coins</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search coins by name, country, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as 'all' | CoinCategory)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">All Categories</option>
                    <option value="modern">Modern</option>
                    <option value="ancient">Ancient</option>
                    <option value="error_coin">Error Coins</option>
                    <option value="commemorative">Commemorative</option>
                    <option value="american">American Coins</option>
                    <option value="european">European Coins</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coins Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coins.map((coin) => {
              const validImages = getValidImages(coin);
              return (
                <Card key={coin.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
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
                        {validImages.length} {validImages.length === 1 ? 'image' : 'images'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium truncate">{coin.name}</h4>
                        <p className="text-sm text-gray-500">
                          {coin.year} • {coin.country}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-green-600">${coin.price}</span>
                        <Badge variant={coin.category === 'error_coin' ? 'destructive' : 'secondary'}>
                          {coin.category}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{coin.views || 0} views</span>
                        <span>{coin.featured ? 'Featured' : 'Standard'}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditImages(coin)}
                          className="flex-1"
                        >
                          <Camera className="h-4 w-4 mr-1" />
                          Images ({validImages.length})
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteCoinMutation.mutate(coin.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {coins.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No coins found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search criteria' : 'No coins have been added yet'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completion">
          <AdminFinalCompletionTab />
        </TabsContent>
      </Tabs>

      {/* Image Editor Modal */}
      {editingCoin && (
        <Dialog open={!!editingCoin} onOpenChange={() => setEditingCoin(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
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
    </div>
  );
};

export default AdminCoinsTab;
