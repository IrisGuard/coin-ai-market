
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Store, Upload, Wallet, Receipt, BarChart3, Settings, TrendingUp, Plus, Loader2, Camera } from 'lucide-react';

import DealerCoinsList from './DealerCoinsList';
import WalletManagementTab from './WalletManagementTab';
import DealerSubscriptionUpgrade from './DealerSubscriptionUpgrade';
import TransactionHistory from './TransactionHistory';
import AdvancedDealerUploadPanelRefactored from './AdvancedDealerUploadPanelRefactored';
import StoreCustomizationSection from './StoreCustomizationSection';
import CreateStoreForm from './store/CreateStoreForm';
import CoinImageEditor from './CoinImageEditor';
import { useAdminStore } from '@/contexts/AdminStoreContext';

const EnhancedDealerPanel = () => {
  const { user } = useAuth();
  const { isAdminUser, selectedStoreId, setSelectedStoreId } = useAdminStore();
  const [activeTab, setActiveTab] = useState('upload');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCoin, setEditingCoin] = useState<any>(null);

  // Fetch stores for admin users
  const { data: adminStores = [] } = useQuery({
    queryKey: ['admin-stores'],
    queryFn: async () => {
      if (!isAdminUser) return [];
      
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: isAdminUser,
  });

  // Fetch coins for image editing
  const { data: coins = [], refetch: refetchCoins } = useQuery({
    queryKey: ['dealer-coins', user?.id, selectedStoreId],
    queryFn: async () => {
      if (!user?.id) return [];
      
      let query = supabase
        .from('coins')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (selectedStoreId) {
        query = query.eq('store_id', selectedStoreId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const handleCreateSuccess = (storeId: string) => {
    setShowCreateForm(false);
    setSelectedStoreId(storeId);
  };

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

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Store className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isAdminUser ? 'Admin Dealer Panel' : 'Dealer Panel'}
              </h1>
              <p className="text-gray-600">
                {isAdminUser ? 'Manage multiple coin stores and inventory (Admin Mode)' : 'Manage your coin store and inventory'}
              </p>
            </div>
            
            {/* Admin Store Selector */}
            {isAdminUser && (
              <div className="ml-auto flex items-center gap-3">
                {selectedStoreId === null ? (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading store selection...</span>
                  </div>
                ) : (
                  <Select value={selectedStoreId || ''} onValueChange={setSelectedStoreId}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select a store..." />
                    </SelectTrigger>
                    <SelectContent>
                      {adminStores.map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                          <div className="flex items-center gap-2">
                            <Store className="h-4 w-4" />
                            <span>{store.name}</span>
                            {store.verified && (
                              <Badge variant="secondary" className="text-xs">Verified</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Button onClick={() => setShowCreateForm(true)} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Store
                </Button>
              </div>
            )}
          </div>
          
          {!isAdminUser && (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              Enhanced Dashboard
            </Badge>
          )}
          
          {isAdminUser && selectedStoreId && (
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              Admin Multi-Store Dashboard
            </Badge>
          )}
        </div>

        {/* Create Store Form Modal for Admin */}
        {isAdminUser && showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Store</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateStoreForm
                onCancel={() => setShowCreateForm(false)}
                onSuccess={handleCreateSuccess}
              />
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              My Inventory
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="upgrade" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {isAdminUser ? 'Store Manager' : 'Upgrade'}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Store Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <AdvancedDealerUploadPanelRefactored />
          </TabsContent>

          <TabsContent value="inventory">
            <div className="space-y-6">
              <DealerCoinsList />
              
              {/* Enhanced Image Management Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Quick Image Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coins.slice(0, 6).map((coin) => {
                      const validImages = getValidImages(coin);
                      return (
                        <div key={coin.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <img 
                              src={validImages[0] || '/placeholder.svg'} 
                              alt={coin.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{coin.name}</h4>
                              <p className="text-sm text-gray-500">
                                {validImages.length} image{validImages.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditImages(coin)}
                            className="w-full"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Edit Images
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionHistory />
          </TabsContent>

          <TabsContent value="wallet">
            <WalletManagementTab />
          </TabsContent>

          <TabsContent value="upgrade">
            {isAdminUser ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-6 w-6" />
                    Admin Store Manager
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    As an admin, you can create and manage multiple stores. Use the store selector in the header to switch between stores.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Total Stores</h3>
                      <p className="text-2xl font-bold text-blue-600">{adminStores.length}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Active Store</h3>
                      <p className="text-sm text-gray-600">
                        {selectedStoreId ? 
                          adminStores.find(s => s.id === selectedStoreId)?.name || 'Unknown Store'
                          : 'No store selected'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <DealerSubscriptionUpgrade />
            )}
          </TabsContent>

          <TabsContent value="settings">
            <StoreCustomizationSection />
          </TabsContent>
        </Tabs>
      </div>

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

export default EnhancedDealerPanel;
