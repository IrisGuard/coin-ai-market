
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Store } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import CreateStoreForm from './CreateStoreForm';
import StoreList from './StoreList';

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

  const handleCreateSuccess = (storeId: string) => {
    setShowCreateForm(false);
    onStoreSelect(storeId);
  };

  const handleStoreEdit = (store: Store) => {
    console.log('Edit store:', store.id);
    // TODO: Implement edit functionality
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
          My Stores ({stores.length})
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
          <StoreList
            stores={stores}
            selectedStoreId={selectedStoreId}
            onStoreSelect={onStoreSelect}
            onStoreEdit={handleStoreEdit}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default StoreManagerRefactored;
