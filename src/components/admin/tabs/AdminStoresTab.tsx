
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Store, ExternalLink, Eye, Edit, Users, Plus } from 'lucide-react';
import { useAdminDealerStores, useStoreStatistics } from '@/hooks/admin/useAdminStores';

const AdminStoresTab = () => {
  const { data: stores = [], isLoading: storesLoading } = useAdminDealerStores();
  const { data: stats } = useStoreStatistics();

  const handleOpenDealerPanel = (storeId: string) => {
    // Direct navigation to the original dealer panel with store context
    window.open(`/dealer?store=${storeId}`, '_blank');
  };

  const handleViewStore = (storeId: string) => {
    window.open(`/store/${storeId}`, '_blank');
  };

  if (storesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="text-purple-600">Loading stores...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-purple-800 mb-2">
              🏪 Store Management - Live Production
            </h2>
            <p className="text-purple-600">
              Διαχείριση καταστημάτων • Direct access to Original Dealer Panel
            </p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-green-600">
              {stats?.activeStores || 0} ACTIVE
            </Badge>
            <Badge className="bg-blue-600">
              {stats?.verifiedStores || 0} VERIFIED
            </Badge>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStores || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Stores</CardTitle>
            <Badge className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.verifiedStores || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
            <Badge className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.activeStores || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalListings || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Stores List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Active Dealer Stores ({stores.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stores.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Store className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No Stores Found</h3>
              <p>No active dealer stores available.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stores.map((store) => {
                // Handle different store data structures from Supabase
                const profile = Array.isArray(store.profiles) ? store.profiles[0] : store.profiles;
                const storeName = store.name || profile?.full_name || 'Unknown Store';
                const storeDescription = store.description || profile?.bio || 'No description available';
                const isVerified = store.verified || profile?.verified_dealer || false;
                const avatarUrl = store.logo_url || profile?.avatar_url;

                return (
                  <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={storeName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <Store className="w-6 h-6 text-purple-600" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{storeName}</h3>
                          {isVerified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              Verified
                            </Badge>
                          )}
                          {store.is_active && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {storeDescription}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>ID: {store.id.slice(0, 8)}...</span>
                          <span>Created: {new Date(store.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewStore(store.user_id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Store
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenDealerPanel(store.id)}
                        className="bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Open Dealer Panel
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => window.open('/dealer', '_blank')}
            >
              <Store className="w-6 h-6" />
              <span>Access Original Dealer Panel</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => window.open('/marketplace', '_blank')}
            >
              <Eye className="w-6 h-6" />
              <span>View Public Marketplace</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => window.location.reload()}
            >
              <Users className="w-6 h-6" />
              <span>Refresh Store Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStoresTab;
