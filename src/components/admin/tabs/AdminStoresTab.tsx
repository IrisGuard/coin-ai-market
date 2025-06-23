import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, Store, CheckCircle, XCircle, Eye, Edit, Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UpdateStoreParams {
  storeId: string;
  updates: Record<string, any>;
}

const AdminStoresTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ['admin-stores'],
    queryFn: async () => {
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
            rating
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: storeStats } = useQuery({
    queryKey: ['admin-store-stats'],
    queryFn: async () => {
      const [totalStores, verifiedStores, activeStores] = await Promise.all([
        supabase.from('stores').select('id', { count: 'exact', head: true }),
        supabase.from('stores').select('id', { count: 'exact', head: true }).eq('verified', true),
        supabase.from('stores').select('id', { count: 'exact', head: true }).eq('is_active', true),
      ]);

      return {
        total: totalStores.count || 0,
        verified: verifiedStores.count || 0,
        active: activeStores.count || 0,
      };
    },
  });

  const updateStoreMutation = useMutation({
    mutationFn: async ({ storeId, updates }: UpdateStoreParams) => {
      const { error } = await supabase
        .from('stores')
        .update(updates)
        .eq('id', storeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] });
      queryClient.invalidateQueries({ queryKey: ['admin-store-stats'] });
      toast({
        title: "Success",
        description: "Store updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredStores = stores.filter(store => {
    const profile = Array.isArray(store.profiles) ? store.profiles[0] : store.profiles;
    return store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           profile?.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleVerifyStore = async (storeId: string, verified: boolean) => {
    updateStoreMutation.mutate({ storeId, updates: { verified } });
  };

  const handleToggleActive = async (storeId: string, isActive: boolean) => {
    updateStoreMutation.mutate({ storeId, updates: { is_active: isActive } });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storeStats?.total || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Stores</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storeStats?.verified || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storeStats?.active || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verification Rate</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {storeStats?.total ? ((storeStats.verified / storeStats.total) * 100).toFixed(1) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store Management</CardTitle>
          <CardDescription>Manage dealer stores, verification status, and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search stores by name, owner, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading stores...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store Info</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStores.map((store) => {
                  const profile = Array.isArray(store.profiles) ? store.profiles[0] : store.profiles;
                  
                  return (
                    <TableRow key={store.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{store.name}</div>
                          <div className="text-sm text-gray-500">{store.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{profile?.full_name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500">{profile?.email}</div>
                          <Badge variant="secondary" className="text-xs mt-1">Store Profile</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {store.verified ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </div>
                          <div>
                            {store.is_active ? (
                              <Badge variant="outline" className="text-green-600">Active</Badge>
                            ) : (
                              <Badge variant="outline" className="text-red-600">Inactive</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(store.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedStore(store)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Store Details: {store.name}</DialogTitle>
                                <DialogDescription>
                                  Manage store verification and settings
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Verification Status</Label>
                                    <div className="flex items-center space-x-2 mt-2">
                                      <Switch
                                        checked={store.verified}
                                        onCheckedChange={(checked) => handleVerifyStore(store.id, checked)}
                                      />
                                      <span>{store.verified ? 'Verified' : 'Unverified'}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Active Status</Label>
                                    <div className="flex items-center space-x-2 mt-2">
                                      <Switch
                                        checked={store.is_active}
                                        onCheckedChange={(checked) => handleToggleActive(store.id, checked)}
                                      />
                                      <span>{store.is_active ? 'Active' : 'Inactive'}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label>Store Description</Label>
                                  <Textarea
                                    value={store.description || ''}
                                    className="mt-2"
                                    rows={3}
                                    readOnly
                                  />
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant={store.verified ? "destructive" : "default"}
                            size="sm"
                            onClick={() => handleVerifyStore(store.id, !store.verified)}
                            disabled={updateStoreMutation.isPending}
                          >
                            {store.verified ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStoresTab;
