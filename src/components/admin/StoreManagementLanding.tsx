
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, Upload, Plus, Coins, TrendingUp } from 'lucide-react';
import { useRealAdminStores } from '@/hooks/admin/useRealAdminStores';

const StoreManagementLanding = () => {
  const { data: stores = [], isLoading } = useRealAdminStores();

  const openCoinUpload = (storeId?: string) => {
    const url = storeId ? `/upload?store=${storeId}` : '/upload';
    window.open(url, '_blank');
  };

  const openDealerPanel = () => {
    window.open('/dealer', '_blank');
  };

  const openAdminPanel = () => {
    window.location.href = '/admin';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-blue-700">Loading your stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏪 Store Management Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Manage your {stores.length} stores • Upload coins instantly • Real-time data
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-green-600 text-white px-4 py-2">
              {stores.length} Active Stores
            </Badge>
            <Badge className="bg-blue-600 text-white px-4 py-2">
              🔴 LIVE DATA
            </Badge>
            <Badge className="bg-purple-600 text-white px-4 py-2">
              ADMIN ACCESS
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button 
            onClick={() => openCoinUpload()}
            className="h-20 bg-green-600 hover:bg-green-700 flex flex-col items-center gap-2"
          >
            <Upload className="h-6 w-6" />
            <span>Quick Upload Coins</span>
          </Button>
          
          <Button 
            onClick={openDealerPanel}
            className="h-20 bg-blue-600 hover:bg-blue-700 flex flex-col items-center gap-2"
          >
            <Store className="h-6 w-6" />
            <span>Dealer Panel</span>
          </Button>
          
          <Button 
            onClick={openAdminPanel}
            className="h-20 bg-purple-600 hover:bg-purple-700 flex flex-col items-center gap-2"
          >
            <TrendingUp className="h-6 w-6" />
            <span>Full Admin Panel</span>
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/marketplace'}
            className="h-20 bg-orange-600 hover:bg-orange-700 flex flex-col items-center gap-2"
          >
            <Coins className="h-6 w-6" />
            <span>View Marketplace</span>
          </Button>
        </div>

        {/* Stores Grid */}
        {stores.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent>
              <Store className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Stores Created Yet</h3>
              <p className="text-gray-500 mb-4">Create your first store to start uploading coins</p>
              <Button 
                onClick={openAdminPanel}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Store
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => {
              const profile = Array.isArray(store.profiles) ? store.profiles[0] : store.profiles;
              
              return (
                <Card key={store.id} className="hover:shadow-xl transition-all duration-200 border-2 hover:border-blue-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      {profile?.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt={store.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <Store className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{store.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600 text-white text-xs">
                            Active
                          </Badge>
                          {store.verified && (
                            <Badge className="bg-blue-600 text-white text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {store.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">{store.description}</p>
                    )}
                    
                    <div className="grid grid-cols-1 gap-2">
                      <Button 
                        onClick={() => openCoinUpload(store.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Coins to This Store
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={() => window.open(`/dealer?store=${store.id}`, '_blank')}
                      >
                        <Store className="w-4 h-4 mr-2" />
                        Manage Store
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreManagementLanding;
