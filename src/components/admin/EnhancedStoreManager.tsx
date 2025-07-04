import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Store, Search, Plus, Eye, Edit, Trash2, Users, Coins } from 'lucide-react';
import { useDealerStores } from '@/hooks/useDealerStores';
import { useAdminStore } from '@/contexts/AdminStoreContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const EnhancedStoreManager = () => {
  const { data: stores = [], isLoading, error } = useDealerStores();
  const { selectedStoreId, setSelectedStoreId, isAdminUser } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Get detailed coin data for stores
  const { data: storeCoins = {} } = useQuery({
    queryKey: ['admin-store-coins'],
    queryFn: async () => {
      const { data: coins, error } = await supabase
        .from('coins')
        .select('id, name, price, store_id, user_id, category, featured, is_auction');

      if (error) {
        console.error('❌ [EnhancedStoreManager] Error fetching coins:', error);
        return {};
      }

      // Group coins by store
      const grouped: Record<string, any[]> = {};
      coins?.forEach(coin => {
        const storeKey = coin.store_id || coin.user_id;
        if (storeKey) {
          if (!grouped[storeKey]) grouped[storeKey] = [];
          grouped[storeKey].push(coin);
        }
      });

      console.log('🏪 [EnhancedStoreManager] Coins grouped by store:', grouped);
      return grouped;
    },
    enabled: isAdminUser
  });

  const filteredStores = stores.filter(store => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      store.name?.toLowerCase().includes(searchLower) ||
      store.description?.toLowerCase().includes(searchLower) ||
      store.profiles?.username?.toLowerCase().includes(searchLower) ||
      store.profiles?.full_name?.toLowerCase().includes(searchLower)
    );
  });

  if (!isAdminUser) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-red-600">Access denied: Admin privileges required</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Enhanced Store Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading store data...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Enhanced Store Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            Error loading stores: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Enhanced Store Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Controls */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search stores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Store
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Total Stores</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{stores.length}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="font-medium">Admin Stores</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {stores.filter(s => s.isAdminStore).length}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-medium">User Stores</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {stores.filter(s => !s.isAdminStore).length}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-orange-600" />
                <span className="font-medium">Total Coins</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {Object.values(storeCoins).reduce((sum, coins) => sum + coins.length, 0)}
              </p>
            </div>
          </div>

          {/* Store List */}
          <div className="space-y-4">
            {filteredStores.length === 0 ? (
              <div className="text-center py-8">
                <Store className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {searchTerm ? 'No stores match your search' : 'No stores found'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search criteria.' : 'Create your first store to get started.'}
                </p>
              </div>
            ) : (
              filteredStores.map((store) => {
                const storeCoinsData = storeCoins[store.id] || storeCoins[store.user_id] || [];
                const isSelected = selectedStoreId === store.id;
                
                return (
                  <div
                    key={store.id}
                    className={`p-6 border rounded-lg transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedStoreId(isSelected ? null : store.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{store.name}</h3>
                          <div className="flex gap-2">
                            {store.isAdminStore && (
                              <Badge className="bg-blue-100 text-blue-800">
                                Admin Store
                              </Badge>
                            )}
                            {store.verified && (
                              <Badge className="bg-green-100 text-green-800">
                                Verified
                              </Badge>
                            )}
                            {store.is_active && (
                              <Badge className="bg-gray-100 text-gray-800">
                                Active
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{store.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Owner:</span>
                            <p className="font-medium">
                              {store.profiles?.username || store.profiles?.full_name || 'Unknown'}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Coins:</span>
                            <p className="font-medium">{storeCoinsData.length}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Featured:</span>
                            <p className="font-medium">
                              {storeCoinsData.filter(coin => coin.featured).length}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Created:</span>
                            <p className="font-medium">
                              {new Date(store.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    {isSelected && storeCoinsData.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium mb-2">Store Coins ({storeCoinsData.length})</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                          {storeCoinsData.slice(0, 12).map((coin) => (
                            <div key={coin.id} className="p-3 bg-white rounded border">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium text-sm truncate">{coin.name}</p>
                                  <p className="text-sm text-gray-600">${coin.price}</p>
                                  <div className="flex gap-1 mt-1">
                                    {coin.featured && (
                                      <Badge variant="outline" className="text-xs">
                                        Featured
                                      </Badge>
                                    )}
                                    {coin.is_auction && (
                                      <Badge variant="outline" className="text-xs">
                                        Auction
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {storeCoinsData.length > 12 && (
                            <div className="p-3 bg-gray-50 rounded border flex items-center justify-center">
                              <span className="text-sm text-gray-600">
                                +{storeCoinsData.length - 12} more coins
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedStoreManager;