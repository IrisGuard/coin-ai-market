
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAdminDealerStores, useStoreStatistics, useUpdateStoreStatus } from '@/hooks/admin/useAdminStores';
import { MarketplaceStore } from '@/types/marketplace';
import { 
  Store, 
  Users, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MapPin, 
  Mail, 
  Globe,
  Phone,
  Calendar,
  Activity,
  TrendingUp,
  Star
} from 'lucide-react';

const AdminStoresTab = () => {
  const { data: stores = [], isLoading, error } = useAdminDealerStores();
  const { data: stats } = useStoreStatistics();
  const updateStoreStatus = useUpdateStoreStatus();

  const handleVerifyStore = async (storeId: string, verified: boolean) => {
    try {
      await updateStoreStatus.mutateAsync({
        storeId,
        updates: { verified }
      });
    } catch (error) {
      console.error('Error updating store status:', error);
    }
  };

  const handleToggleActive = async (storeId: string, isActive: boolean) => {
    try {
      await updateStoreStatus.mutateAsync({
        storeId,
        updates: { is_active: isActive }
      });
    } catch (error) {
      console.error('Error updating store status:', error);
    }
  };

  const formatAddress = (address: any) => {
    if (!address) return 'No address provided';
    if (typeof address === 'string') return address;
    if (typeof address === 'object') {
      return Object.values(address).filter(Boolean).join(', ') || 'Address data available';
    }
    return 'Address data available';
  };

  const formatShippingOptions = (options: any) => {
    if (!options) return 'Standard shipping';
    if (typeof options === 'string') return options;
    if (typeof options === 'object') {
      return Object.keys(options).join(', ') || 'Shipping available';
    }
    return 'Shipping available';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stores from Supabase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Stores</h3>
              <p className="text-red-600">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              🏪 Dealer Stores Management - Live Supabase Data
            </h2>
            <p className="text-blue-600">
              Real-time store management • Direct database connection • {stores.length} stores loaded
            </p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-green-600 text-white">
              ✅ {stores.length} Stores
            </Badge>
            <Badge className="bg-blue-600 text-white">
              🔴 LIVE DATA
            </Badge>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Stores</p>
                  <p className="text-2xl font-bold">{stats.totalStores}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Verified</p>
                  <p className="text-2xl font-bold text-green-600">{stats.verifiedStores}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.activeStores}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Listings</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalListings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stores List */}
      <div className="space-y-4">
        {stores.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Store className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Stores Found</h3>
              <p className="text-gray-500">No dealer stores are currently registered in the system.</p>
            </CardContent>
          </Card>
        ) : (
          stores.map((store: MarketplaceStore) => {
            const profile = store.profiles;
            
            return (
              <Card key={store.id} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={profile?.avatar_url || store.logo_url || ''} />
                        <AvatarFallback>
                          {store.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">{store.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            className={store.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                          >
                            {store.verified ? 'Verified' : 'Pending'}
                          </Badge>
                          <Badge 
                            className={store.is_active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}
                          >
                            {store.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={store.verified ? "outline" : "default"}
                        onClick={() => handleVerifyStore(store.id, !store.verified)}
                        disabled={updateStoreStatus.isPending}
                      >
                        {store.verified ? 'Unverify' : 'Verify'}
                      </Button>
                      <Button
                        size="sm"
                        variant={store.is_active ? "outline" : "default"}
                        onClick={() => handleToggleActive(store.id, !store.is_active)}
                        disabled={updateStoreStatus.isPending}
                      >
                        {store.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Store Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">Store Information</h4>
                      
                      {store.description && (
                        <div className="flex items-start gap-2">
                          <Eye className="h-4 w-4 text-gray-500 mt-1" />
                          <div>
                            <p className="text-sm text-gray-600">Description</p>
                            <p className="text-sm">{store.description}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="text-sm">{formatAddress(store.address)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-gray-500 mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">Created</p>
                          <p className="text-sm">{new Date(store.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Owner Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">Owner Information</h4>
                      
                      {profile && (
                        <>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Owner</p>
                              <p className="text-sm font-medium">{profile.full_name || 'Not specified'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Email</p>
                              <p className="text-sm">{profile.email || 'Not specified'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Username</p>
                              <p className="text-sm">{profile.username || 'Not specified'}</p>
                            </div>
                          </div>
                          
                          {profile.verified_dealer && (
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-gold-500" />
                              <Badge className="bg-gold-100 text-gold-700">Verified Dealer</Badge>
                            </div>
                          )}
                        </>
                      )}
                      
                      {/* Contact Information */}
                      {(store.email || store.phone || store.website) && (
                        <div className="pt-2 border-t border-gray-200">
                          {store.email && (
                            <div className="flex items-center gap-2 mb-2">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <p className="text-sm">{store.email}</p>
                            </div>
                          )}
                          {store.phone && (
                            <div className="flex items-center gap-2 mb-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <p className="text-sm">{store.phone}</p>
                            </div>
                          )}
                          {store.website && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-gray-500" />
                              <a href={store.website} target="_blank" rel="noopener noreferrer" 
                                 className="text-sm text-blue-600 hover:underline">
                                {store.website}
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Shipping Options */}
                      <div className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-gray-500 mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">Shipping</p>
                          <p className="text-sm">{formatShippingOptions(store.shipping_options)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminStoresTab;
