
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, Plus, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStore } from '@/contexts/AdminStoreContext';

const AdminStoreManagerTab = () => {
  const { user } = useAuth();
  const { setSelectedStoreId } = useAdminStore();
  const navigate = useNavigate();

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
    enabled: !!user?.id,
  });

  const handleCreateNewStore = () => {
    // Navigate to the real Dealer Panel for store creation
    navigate('/dealer');
  };

  const handleAccessStore = (storeId: string) => {
    // Set the selected store and navigate to the real Dealer Panel
    setSelectedStoreId(storeId);
    navigate('/dealer');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading admin stores...</div>
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
              Admin Store Manager
            </div>
            <Button 
              onClick={handleCreateNewStore}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              Create New Store
              <ExternalLink className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Access the complete Dealer Panel to create and manage stores with full AI-powered features, 
            global market intelligence, and multi-country capabilities.
          </p>
        </CardContent>
      </Card>

      {/* Admin Stores List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Your Admin Stores ({stores?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stores && stores.length > 0 ? (
            <div className="space-y-3">
              {stores.map((store) => (
                <div 
                  key={store.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleAccessStore(store.id)}
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
                        {store.address && typeof store.address === 'object' && (store.address as any).country && (
                          <Badge variant="secondary" className="text-xs">
                            {(store.address as any).country}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
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
                <ExternalLink className="w-4 h-4" />
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
              <h4 className="font-medium text-green-800">Direct Access to Dealer Panel</h4>
              <p className="text-sm text-gray-600 mt-1">
                Each store gives you access to the complete "brain" of the Dealer Panel with AI analysis, 
                global price intelligence, error detection, visual matching, and multi-country management.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStoreManagerTab;
