
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Store, 
  Users, 
  MapPin, 
  Star, 
  ExternalLink, 
  Edit, 
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Package
} from 'lucide-react';

const AdminStoresTab = () => {
  // Fetch stores with their profiles using the admin hook
  const { data: stores = [], isLoading, error, refetch } = useQuery({
    queryKey: ['admin-stores'],
    queryFn: async () => {
      console.log('🔄 Fetching admin stores data...');
      
      const { data, error } = await supabase
        .from('stores')
        .select(`
          *,
          profiles!user_id (
            id,
            full_name,
            email,
            username,
            avatar_url,
            verified_dealer,
            rating
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching stores:', error);
        throw error;
      }

      console.log(`✅ Loaded ${data?.length || 0} stores:`, data);
      return data || [];
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  // Calculate store statistics
  const storeStats = React.useMemo(() => {
    if (!stores) return { total: 0, active: 0, verified: 0, pending: 0 };
    
    return {
      total: stores.length,
      active: stores.filter(store => store.is_active).length,
      verified: stores.filter(store => store.verified).length,
      pending: stores.filter(store => !store.verified).length
    };
  }, [stores]);

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
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>Error loading stores: {error.message}</span>
            </div>
            <Button 
              onClick={() => refetch()} 
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              Retry Loading
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-purple-800 mb-2">
              🏪 DEALER STORES MANAGEMENT - {stores.length} Active Stores
            </h2>
            <p className="text-purple-600">
              Real-time store management • Live Supabase connection • Complete store oversight
            </p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-green-600">
              ✅ {storeStats.total} STORES LOADED
            </Badge>
            <Badge className="bg-blue-600">🔴 LIVE CONNECTION</Badge>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Store className="h-5 w-5" />
              Total Stores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{storeStats.total}</div>
            <div className="text-sm text-blue-500">All registered stores</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Active Stores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{storeStats.active}</div>
            <div className="text-sm text-green-500">Currently operational</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Star className="h-5 w-5" />
              Verified Stores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{storeStats.verified}</div>
            <div className="text-sm text-purple-500">Admin verified</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Clock className="h-5 w-5" />
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{storeStats.pending}</div>
            <div className="text-sm text-orange-500">Awaiting verification</div>
          </CardContent>
        </Card>
      </div>

      {/* Stores List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            All Dealer Stores ({stores.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stores.length === 0 ? (
            <div className="text-center py-8">
              <Store className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Stores Found</h3>
              <p className="text-gray-500">No dealer stores in the database yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stores.map((store) => {
                const profile = store.profiles;
                
                return (
                  <div key={store.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        {/* Store Avatar */}
                        <Avatar className="h-12 w-12">
                          <AvatarImage 
                            src={store.logo_url || profile?.avatar_url} 
                            alt={store.name} 
                          />
                          <AvatarFallback>
                            {store.name?.charAt(0)?.toUpperCase() || 'S'}
                          </AvatarFallback>
                        </Avatar>

                        {/* Store Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{store.name}</h3>
                            {store.verified && (
                              <Badge className="bg-green-100 text-green-700">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            {store.is_active ? (
                              <Badge className="bg-blue-100 text-blue-700">Active</Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </div>

                          {/* Store Description */}
                          {store.description && (
                            <p className="text-gray-600 mb-2">{store.description}</p>
                          )}

                          {/* Owner Information */}
                          {profile && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Owner:</span>
                                <div className="font-medium">{profile.full_name || 'No name'}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Email:</span>
                                <div className="font-medium">{profile.email || 'No email'}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Username:</span>
                                <div className="font-medium">@{profile.username || 'No username'}</div>
                              </div>
                            </div>
                          )}

                          {/* Store Address */}
                          {store.address && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{store.address}</span>
                            </div>
                          )}

                          {/* Store Metadata */}
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                            <span>Created: {new Date(store.created_at).toLocaleDateString()}</span>
                            {store.updated_at && (
                              <span>Updated: {new Date(store.updated_at).toLocaleDateString()}</span>
                            )}
                            <span>ID: {store.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {!store.verified && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                        )}
                      </div>
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
          <CardTitle>Store Management Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Bulk Verify
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Store Analytics
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Dealer Management
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => refetch()}
            >
              🔄 Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Status Footer */}
      <div className="text-center text-sm text-gray-500">
        🔴 Live connection to Supabase • Auto-refresh every 30 seconds • 
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default AdminStoresTab;
