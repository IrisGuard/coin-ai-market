
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, Plus, ArrowRight, Globe, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStore } from '@/contexts/AdminStoreContext';
import CreateStoreModal from '@/components/dealer/store/CreateStoreModal';
import { useToast } from '@/hooks/use-toast';

// Country flag mapping for common countries
const countryFlags: Record<string, string> = {
  'US': '🇺🇸',
  'GB': '🇬🇧', 
  'CA': '🇨🇦',
  'DE': '🇩🇪',
  'FR': '🇫🇷',
  'IT': '🇮🇹',
  'ES': '🇪🇸',
  'JP': '🇯🇵',
  'AU': '🇦🇺',
  'NZ': '🇳🇿',
  'CH': '🇨🇭',
  'AT': '🇦🇹',
  'NL': '🇳🇱',
  'BE': '🇧🇪',
  'DK': '🇩🇰',
  'SE': '🇸🇪',
  'NO': '🇳🇴',
  'FI': '🇫🇮',
  'GR': '🇬🇷',
  'IN': '🇮🇳',
  'GI': '🇬🇮'
};

const countryNames: Record<string, string> = {
  'US': 'United States',
  'GB': 'United Kingdom',
  'CA': 'Canada',
  'DE': 'Germany',
  'FR': 'France',
  'IT': 'Italy',
  'ES': 'Spain',
  'JP': 'Japan',
  'AU': 'Australia',
  'NZ': 'New Zealand',
  'CH': 'Switzerland',
  'AT': 'Austria',
  'NL': 'Netherlands',
  'BE': 'Belgium',
  'DK': 'Denmark',
  'SE': 'Sweden',
  'NO': 'Norway',
  'FI': 'Finland',
  'GR': 'Greece',
  'IN': 'India',
  'GI': 'Gibraltar'
};

const AdminOpenStoreTab = () => {
  const { user } = useAuth();
  const { setSelectedStoreId } = useAdminStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isCreateStoreModalOpen, setIsCreateStoreModalOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<string | null>(null);

  // Fetch ALL admin stores
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
    enabled: !!user?.id,
  });

  // Delete store mutation
  const deleteStoreMutation = useMutation({
    mutationFn: async (storeId: string) => {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', storeId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['dealer-stores'] });
      toast({
        title: "Store Deleted",
        description: "The store has been successfully deleted.",
      });
      setStoreToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'Failed to delete store',
        variant: "destructive",
      });
      setStoreToDelete(null);
    },
  });

  const handleCreateNewStore = () => {
    setIsCreateStoreModalOpen(true);
  };

  const handleAccessStore = (storeId: string) => {
    setSelectedStoreId(storeId);
    navigate('/dealer');
  };

  const handleDeleteStore = (storeId: string) => {
    setStoreToDelete(storeId);
  };

  const confirmDeleteStore = () => {
    if (storeToDelete) {
      deleteStoreMutation.mutate(storeToDelete);
    }
  };

  const handleStoreCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-stores', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['dealer-stores'] });
  };

  const getCountryDisplay = (address: any) => {
    if (!address || typeof address !== 'object') return null;
    
    const countryCode = address.country;
    if (!countryCode) return null;
    
    const flag = countryFlags[countryCode];
    const name = countryNames[countryCode] || countryCode;
    
    return { flag, name, code: countryCode };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading stores...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="w-6 h-6 text-green-600" />
              🏪 Open Store - Unlimited Store Creation
            </div>
            <Button 
              onClick={handleCreateNewStore}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              Create New Store
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Create unlimited stores and access the complete Dealer Panel with full AI-powered features, 
            global market intelligence, and multi-country capabilities.
          </p>
        </CardContent>
      </Card>

      {/* Admin Stores List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Your Stores ({stores?.length || 0}) - Unlimited Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stores && stores.length > 0 ? (
            <div className="space-y-3">
              {stores.map((store) => {
                const countryInfo = getCountryDisplay(store.address);
                
                return (
                  <div 
                    key={store.id}
                    className="flex items-center justify-between p-4 border rounded-lg transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Store className="w-5 h-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">{store.name}</h4>
                        <p className="text-sm text-gray-600">{store.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {store.verified && (
                            <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                              Verified
                            </Badge>
                          )}
                          {store.is_active && (
                            <Badge variant="outline" className="text-xs">
                              Active
                            </Badge>
                          )}
                          {countryInfo && (
                            <Badge variant="secondary" className="text-xs flex items-center gap-1">
                              {countryInfo.flag && <span>{countryInfo.flag}</span>}
                              <Globe className="w-3 h-3" />
                              {countryInfo.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAccessStore(store.id)}
                        className="flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Open Dealer Panel
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteStore(store.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Store className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No stores created yet</p>
              <p className="text-sm mb-4">Create your first store to start managing coins with the full Dealer Panel</p>
              <Button 
                onClick={handleCreateNewStore}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create First Store
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Access Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <h4 className="font-medium text-green-800">Unlimited Dealer Panel Access</h4>
              <p className="text-sm text-gray-600 mt-1">
                Each store gives you access to the complete Dealer Panel with 10 photo slots, 
                30+ categories, AI analysis, global price intelligence, error detection, 
                visual matching, and multi-country management capabilities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Store Modal */}
      <CreateStoreModal 
        isOpen={isCreateStoreModalOpen}
        onClose={() => setIsCreateStoreModalOpen(false)}
        onStoreCreated={handleStoreCreated}
      />

      {/* Delete Confirmation Modal */}
      {storeToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Delete Store</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this store? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setStoreToDelete(null)}
                  disabled={deleteStoreMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeleteStore}
                  disabled={deleteStoreMutation.isPending}
                >
                  {deleteStoreMutation.isPending ? 'Deleting...' : 'Delete Store'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminOpenStoreTab;
