
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Store, Globe, Check } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStore } from '@/contexts/AdminStoreContext';
import { toast } from '@/hooks/use-toast';

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

interface AdminStoreManagerProps {
  className?: string;
}

const AdminStoreManager: React.FC<AdminStoreManagerProps> = ({ className }) => {
  const { user } = useAuth();
  const { selectedStoreId, setSelectedStoreId, isAdminUser } = useAdminStore();
  const queryClient = useQueryClient();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    description: '',
    country: ''
  });

  // Only show for admin users
  if (!isAdminUser) {
    return null;
  }

  // Fetch admin's stores
  const { data: stores, isLoading } = useQuery({
    queryKey: ['admin-stores', user?.id],
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
    enabled: !!user?.id && isAdminUser,
  });

  // Auto-select first store if none selected
  React.useEffect(() => {
    if (stores && stores.length > 0 && !selectedStoreId) {
      setSelectedStoreId(stores[0].id);
    }
  }, [stores, selectedStoreId, setSelectedStoreId]);

  // Create store mutation with admin privileges
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
          verified: true // Auto-verify for admin users
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] });
      queryClient.invalidateQueries({ queryKey: ['dealer-stores'] });
      setShowCreateForm(false);
      setNewStore({ name: '', description: '', country: '' });
      setSelectedStoreId(data.id);
      toast({
        title: "Store Created Successfully",
        description: `${data.name} has been created and verified automatically.`,
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

  const selectedStore = stores?.find(store => store.id === selectedStoreId);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">Loading stores...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="w-5 h-5" />
          Admin Store Management ({stores?.length || 0} stores)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Store Selector */}
        {stores && stores.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block">Active Store</label>
            <Select value={selectedStoreId || ''} onValueChange={setSelectedStoreId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a store" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
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
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <Check className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                    <Badge variant="outline">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Create New Store Form */}
        {showCreateForm ? (
          <form onSubmit={handleCreateStore} className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create New Store
            </h3>
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
            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={createStoreMutation.isPending}
                className="flex-1"
              >
                {createStoreMutation.isPending ? 'Creating...' : 'Create Verified Store'}
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
            Create New Store
          </Button>
        )}

        {stores?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Store className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No stores created yet. Create your first store above!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminStoreManager;
