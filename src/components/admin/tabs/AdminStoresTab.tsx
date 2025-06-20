
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Store, Users, Search, Edit, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminStoresTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch all stores with user profiles
  const { data: stores = [], isLoading, error } = useQuery({
    queryKey: ['admin-stores'],
    queryFn: async () => {
      console.log('Fetching all stores for admin...');
      
      const { data, error } = await supabase
        .from('stores')
        .select(`
          *,
          profiles!stores_user_id_fkey (
            id,
            full_name,
            email,
            avatar_url,
            verified_dealer,
            rating,
            username
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching stores:', error);
        throw error;
      }

      console.log(`✅ Loaded ${data?.length || 0} stores:`, data);
      return data || [];
    },
    staleTime: 30000, // 30 seconds
  });

  // Get store coin counts
  const { data: storeCounts = {} } = useQuery({
    queryKey: ['admin-store-coin-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select('user_id, store_id')
        .not('store_id', 'is', null);
      
      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data?.forEach(coin => {
        if (coin.store_id) {
          counts[coin.store_id] = (counts[coin.store_id] || 0) + 1;
        }
        if (coin.user_id) {
          counts[coin.user_id] = (counts[coin.user_id] || 0) + 1;
        }
      });
      
      return counts;
    }
  });

  // Update store status mutation
  const updateStoreMutation = useMutation({
    mutationFn: async ({ storeId, updates }: { storeId: string; updates: any }) => {
      const { error } = await supabase
        .from('stores')
        .update(updates)
        .eq('id', storeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] });
      toast.success('Store updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update store: ' + error.message);
    },
  });

  // Filter stores based on search
  const filteredStores = stores.filter(store => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const profile = store.profiles;
    return (
      store.name?.toLowerCase().includes(searchLower) ||
      store.description?.toLowerCase().includes(searchLower) ||
      profile?.full_name?.toLowerCase().includes(searchLower) ||
      profile?.email?.toLowerCase().includes(searchLower) ||
      profile?.username?.toLowerCase().includes(searchLower)
    );
  });

  const handleToggleActive = (storeId: string, currentStatus: boolean) => {
    updateStoreMutation.mutate({
      storeId,
      updates: { is_active: !currentStatus }
    });
  };

  const handleToggleVerified = (storeId: string, currentStatus: boolean) => {
    updateStoreMutation.mutate({
      storeId,
      updates: { verified: !currentStatus }
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Store Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading stores from database...</p>
          </div>
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
            Store Management - ERROR
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            <p>Error loading stores: {error.message}</p>
            <Button 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-stores'] })}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {stores.length}
                </div>
                <p className="text-xs text-muted-foreground">Total Stores</p>
              </div>
              <Store className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stores.filter(s => s.verified).length}
                </div>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {stores.filter(s => s.is_active).length}
                </div>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {Object.values(storeCounts).reduce((sum, count) => sum + count, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Total Coins</p>
              </div>
              <Eye className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stores Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            All Stores ({filteredStores.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-stores'] })}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStores.length === 0 ? (
            <div className="text-center py-8">
              <Store className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {searchTerm ? 'No stores found' : 'No stores yet'}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Stores will appear here when users create them.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStores.map((store) => {
                const profile = store.profiles;
                const coinCount = storeCounts[store.id] || storeCounts[store.user_id] || 0;
                
                return (
                  <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={store.logo_url || profile?.avatar_url} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {store.name?.[0] || profile?.full_name?.[0] || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{store.name}</h3>
                          {store.verified && (
                            <Badge className="bg-green-100 text-green-700">Verified</Badge>
                          )}
                          {store.is_active ? (
                            <Badge className="bg-blue-100 text-blue-700">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{store.description}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>Owner: {profile?.full_name || profile?.email || 'Unknown'}</span>
                          <span>Coins: {coinCount}</span>
                          <span>Created: {new Date(store.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant={store.is_active ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleActive(store.id, store.is_active)}
                        disabled={updateStoreMutation.isPending}
                      >
                        {store.is_active ? <XCircle className="w-4 h-4 mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
                        {store.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      
                      <Button
                        variant={store.verified ? "secondary" : "default"}
                        size="sm"
                        onClick={() => handleToggleVerified(store.id, store.verified)}
                        disabled={updateStoreMutation.isPending}
                      >
                        {store.verified ? 'Unverify' : 'Verify'}
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStoresTab;
