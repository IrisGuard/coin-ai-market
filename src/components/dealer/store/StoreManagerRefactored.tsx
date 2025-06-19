import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Store, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import CreateStoreForm from './CreateStoreForm';
import StoreList from './StoreList';
import StoreActivityLogs from './StoreActivityLogs';
import { useLogStoreActivity } from '@/hooks/useStoreActivityLogs';

interface Store {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  banner_url?: string;
  is_active: boolean;
  verified: boolean;
  rating?: number;
  total_sales?: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: any;
  shipping_options?: any;
}

interface StoreManagerRefactoredProps {
  onStoreSelect: (storeId: string) => void;
  selectedStoreId?: string;
}

const StoreManagerRefactored: React.FC<StoreManagerRefactoredProps> = ({ 
  onStoreSelect, 
  selectedStoreId = '' 
}) => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('stores');
  const logActivity = useLogStoreActivity();

  const { data: stores = [], isLoading } = useQuery({
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

  const handleCreateSuccess = async (storeId: string) => {
    setShowCreateForm(false);
    onStoreSelect(storeId);
    
    // Log store creation activity
    await logActivity.mutateAsync({
      storeId,
      activityType: 'store_created',
      description: 'New store created successfully',
      data: { store_id: storeId },
      severity: 'info'
    });
  };

  const handleStoreEdit = async (store: Store) => {
    // Log store edit activity
    await logActivity.mutateAsync({
      storeId: store.id,
      activityType: 'store_edit_initiated',
      description: 'Store edit initiated',
      data: { store_name: store.name },
      severity: 'info'
    });
    
    console.log('Edit store:', store.id);
  };

  const handleStoreSelect = async (storeId: string) => {
    onStoreSelect(storeId);
    
    // Log store selection activity
    const selectedStore = stores.find(s => s.id === storeId);
    if (selectedStore) {
      await logActivity.mutateAsync({
        storeId,
        activityType: 'store_selected',
        description: `Store "${selectedStore.name}" selected for management`,
        data: { store_name: selectedStore.name },
        severity: 'info'
      });
    }
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Store className="w-5 h-5" />
          Store Management ({stores.length})
        </CardTitle>
        {!showCreateForm && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Store
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {showCreateForm ? (
          <CreateStoreForm
            onCancel={() => setShowCreateForm(false)}
            onSuccess={handleCreateSuccess}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stores" className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                My Stores
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Activity Logs
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="stores" className="mt-6">
              <StoreList
                stores={stores}
                selectedStoreId={selectedStoreId}
                onStoreSelect={handleStoreSelect}
                onStoreEdit={handleStoreEdit}
              />
            </TabsContent>
            
            <TabsContent value="activity" className="mt-6">
              {selectedStoreId ? (
                <StoreActivityLogs storeId={selectedStoreId} />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a store to view activity logs</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default StoreManagerRefactored;
