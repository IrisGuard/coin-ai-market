
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDealerStores } from '@/hooks/useDealerStores';
import { useAdminCoins } from '@/hooks/useAdminData';
import { Store, Eye, Edit, Trash2, Users, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminStoreManagementTab = () => {
  const { data: stores, isLoading: storesLoading } = useDealerStores();
  const { data: coins } = useAdminCoins();
  const [selectedStore, setSelectedStore] = useState<any>(null);

  const getStoreCoins = (storeId: string) => {
    return coins?.filter(coin => coin.store_id === storeId) || [];
  };

  const getStoreStats = (storeId: string) => {
    const storeCoins = getStoreCoins(storeId);
    return {
      totalListings: storeCoins.length,
      activeListings: storeCoins.filter(coin => !coin.sold).length,
      soldItems: storeCoins.filter(coin => coin.sold).length,
      totalValue: storeCoins.reduce((sum, coin) => sum + (coin.price || 0), 0)
    };
  };

  const handleVerifyStore = async (storeId: string, verified: boolean) => {
    // This would typically call an API to update store verification
    toast({
      title: verified ? "Store Verified" : "Store Unverified",
      description: `Store has been ${verified ? 'verified' : 'unverified'} successfully`
    });
  };

  const handleToggleStoreStatus = async (storeId: string, isActive: boolean) => {
    // This would typically call an API to update store status
    toast({
      title: isActive ? "Store Activated" : "Store Deactivated",
      description: `Store has been ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  };

  if (storesLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading stores...</p>
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
            Store Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Stores</p>
                    <p className="text-2xl font-bold">{stores?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Verified Stores</p>
                    <p className="text-2xl font-bold">
                      {stores?.filter(store => store.verified).length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Active Stores</p>
                    <p className="text-2xl font-bold">
                      {stores?.filter(store => store.is_active).length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Pending Review</p>
                    <p className="text-2xl font-bold">
                      {stores?.filter(store => !store.verified && store.is_active).length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stores List */}
          <div className="space-y-4">
            {stores?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Store className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No stores found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stores?.map((store) => {
                  const stats = getStoreStats(store.id);
                  const storeCoins = getStoreCoins(store.id);
                  
                  return (
                    <Card key={store.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={store.logo_url} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {store.name?.[0] || 'S'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-medium">{store.name}</h3>
                              <Badge variant={store.verified ? 'default' : 'secondary'}>
                                {store.verified ? 'Verified' : 'Unverified'}
                              </Badge>
                              <Badge variant={store.is_active ? 'default' : 'destructive'}>
                                {store.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            
                            <p className="text-gray-600 mb-3">{store.description}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Total Listings:</span>
                                <span className="ml-1 font-medium">{stats.totalListings}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Active:</span>
                                <span className="ml-1 font-medium text-green-600">{stats.activeListings}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Sold:</span>
                                <span className="ml-1 font-medium text-blue-600">{stats.soldItems}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Total Value:</span>
                                <span className="ml-1 font-medium">${stats.totalValue.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedStore(store)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>{store.name} - Store Details</DialogTitle>
                              </DialogHeader>
                              {selectedStore && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-medium mb-2">Store Information</h4>
                                      <div className="space-y-2 text-sm">
                                        <p><span className="font-medium">Owner:</span> {selectedStore.profiles?.full_name}</p>
                                        <p><span className="font-medium">Email:</span> {selectedStore.profiles?.email}</p>
                                        <p><span className="font-medium">Phone:</span> {selectedStore.phone || 'Not provided'}</p>
                                        <p><span className="font-medium">Website:</span> {selectedStore.website || 'Not provided'}</p>
                                        <p><span className="font-medium">Created:</span> {new Date(selectedStore.created_at).toLocaleDateString()}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-medium mb-2">Recent Listings</h4>
                                      <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {storeCoins.slice(0, 5).map((coin) => (
                                          <div key={coin.id} className="flex items-center gap-2 p-2 border rounded text-sm">
                                            <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded" />
                                            <div className="flex-1">
                                              <p className="font-medium">{coin.name}</p>
                                              <p className="text-gray-500">${coin.price}</p>
                                            </div>
                                            <Badge variant={coin.sold ? 'secondary' : 'default'}>
                                              {coin.sold ? 'Sold' : 'Active'}
                                            </Badge>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVerifyStore(store.id, !store.verified)}
                            className={store.verified ? 'text-orange-600' : 'text-green-600'}
                          >
                            {store.verified ? 'Unverify' : 'Verify'}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStoreStatus(store.id, !store.is_active)}
                            className={store.is_active ? 'text-red-600' : 'text-green-600'}
                          >
                            {store.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStoreManagementTab;
