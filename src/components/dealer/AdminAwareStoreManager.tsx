import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Store, Edit, Settings, Globe, Check } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStore } from '@/contexts/AdminStoreContext';
import { toast } from '@/hooks/use-toast';
import VerifiedStoreBadge from '@/components/admin/enhanced/VerifiedStoreBadge';

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'JP', name: 'Japan' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'DK', name: 'Denmark' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'FI', name: 'Finland' },
];

interface Store {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  address: any;
  is_active: boolean;
  created_at: string;
  email: string;
  phone: string;
  shipping_options: any;
  updated_at: string;
  user_id: string;
  verified: boolean;
  website: string;
}

interface AdminAwareStoreManagerProps {
  onStoreSelect: (storeId: string) => void;
  selectedStoreId?: string;
}

const AdminAwareStoreManager: React.FC<AdminAwareStoreManagerProps> = ({ onStoreSelect, selectedStoreId }) => {
  const { user } = useAuth();
  const { selectedStoreId: adminSelectedStoreId, setSelectedStoreId: setAdminSelectedStoreId, isAdminUser } = useAdminStore();
  const queryClient = useQueryClient();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    description: '',
    country: ''
  });

  // Use admin store context if user is admin, otherwise use regular store selection
  const effectiveSelectedStoreId = isAdminUser ? adminSelectedStoreId : selectedStoreId;
  const effectiveOnStoreSelect = isAdminUser ? setAdminSelectedStoreId : onStoreSelect;

  // Fetch user's stores
  const { data: stores, isLoading } = useQuery({
    queryKey: ['user-stores', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Auto-select first store if none selected and user is admin
  React.useEffect(() => {
    if (isAdminUser && stores && stores.length > 0 && !adminSelectedStoreId) {
      setAdminSelectedStoreId(stores[0].id);
    }
  }, [isAdminUser, stores, adminSelectedStoreId, setAdminSelectedStoreId]);

  // Create store mutation - AUTO-VERIFY for admin users
  const createStoreMutation = useMutation({
    mutationFn: async (storeData: typeof newStore) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('stores')
        .insert({
          user_id: user.id,
          name: storeData.name,
          description: storeData.description,
          address: storeData.country ? { country: storeData.country } : null,
          is_active: true,
          verified: isAdminUser // AUTO-VERIFY ADMIN STORES
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-stores'] });
      queryClient.invalidateQueries({ queryKey: ['dealer-stores'] });
      setShowCreateForm(false);
      setNewStore({ name: '', description: '', country: '' });
      effectiveOnStoreSelect(data.id);
      toast({
        title: "Store Created",
        description: `${data.name} has been created${isAdminUser ? ' and verified automatically' : ''}!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || 'Failed to create store',
        variant: "destructive",
      });
    },
  });

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStore.name.trim()) {
      toast({
        title: "Error",
        description: "Store name is required",
        variant: "destructive",
      });
      return;
    }
    createStoreMutation.mutate(newStore);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading stores...</div>
        </CardContent>
      </Card>
    );
  }

  const selectedStore = stores?.find(store => store.id === effectiveSelectedStoreId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="w-5 h-5" />
          {isAdminUser ? 'Admin Store Management' : 'My Stores'} ({stores?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stores && stores.length > 0 ? (
          <div>
            {/* Admin gets a dropdown selector, regular users get click cards */}
            {isAdminUser ? (
              <>
                <label className="text-sm font-medium mb-2 block">Active Store</label>
                <Select value={effectiveSelectedStoreId || ''} onValueChange={effectiveOnStoreSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store: Store) => (
                      <SelectItem key={store.id} value={store.id}>
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4" />
                          <span>{store.name}</span>
                          {store.verified && <Check className="w-3 h-3 text-green-600" />}
                          {store.address && typeof store.address === 'object' && (store.address as any).country && (
                            <Globe className="w-3 h-3 text-blue-600" />
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedStore && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{selectedStore.name}</h4>
                        <p className="text-sm text-gray-600">{selectedStore.description}</p>
                        {selectedStore.address && typeof selectedStore.address === 'object' && (selectedStore.address as any).country && (
                          <p className="text-xs text-blue-600 mt-1">
                            Country: {COUNTRIES.find(c => c.code === (selectedStore.address as any).country)?.name || (selectedStore.address as any).country}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <VerifiedStoreBadge isVerified={selectedStore.verified} size="sm" />
                        <Badge variant={selectedStore.is_active ? "default" : "secondary"}>
                          {selectedStore.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Regular user interface - existing functionality with verified badges
              <div className="grid gap-3">
                {stores.map((store: Store) => (
                  <div
                    key={store.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      effectiveSelectedStoreId === store.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => effectiveOnStoreSelect(store.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{store.name}</h3>
                        {store.description && (
                          <p className="text-sm text-gray-600">{store.description}</p>
                        )}
                        {store.address && (
                          <p className="text-xs text-gray-500 mt-1">
                            {typeof store.address === 'string' ? store.address : 'Address on file'}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <VerifiedStoreBadge isVerified={store.verified} size="sm" />
                          <Badge variant={store.is_active ? "default" : "secondary"}>
                            {store.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No stores yet. Create your first store to start selling coins!</p>
          </div>
        )}

        {showCreateForm ? (
          <form onSubmit={handleCreateStore} className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold">Create New Store</h3>
            <Input
              placeholder="Store Name"
              value={newStore.name}
              onChange={(e) => setNewStore(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <Textarea
              placeholder="Store Description"
              value={newStore.description}
              onChange={(e) => setNewStore(prev => ({ ...prev, description: e.target.value }))}
            />
            {/* Country selection for admin users */}
            {isAdminUser && (
              <Select value={newStore.country} onValueChange={(value) => setNewStore(prev => ({ ...prev, country: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Country (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        {country.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={createStoreMutation.isPending}
                className="flex-1"
              >
                {createStoreMutation.isPending ? 'Creating...' : `Create ${isAdminUser ? 'Verified ' : ''}Store`}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="w-full flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {isAdminUser ? 'Create New Store' : 'Create New Store'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAwareStoreManager;
