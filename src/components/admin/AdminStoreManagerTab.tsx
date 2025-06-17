
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, Plus, ArrowRight, ExternalLink, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStore } from '@/contexts/AdminStoreContext';
import CreateStoreModal from './CreateStoreModal';

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

const AdminStoreManagerTab = () => {
  const { user } = useAuth();
  const { setSelectedStoreId } = useAdminStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch ALL admin stores (no verified filter for admin panel)
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
    setShowCreateModal(true);
  };

  const handleStoreCreated = (storeId: string) => {
    // Refresh the stores list
    queryClient.invalidateQueries({ queryKey: ['admin-stores', user?.id] });
    
    // Set the selected store and navigate to the Dealer Panel
    setSelectedStoreId(storeId);
    navigate('/dealer');
  };

  const handleAccessStore = (storeId: string) => {
    // Set the selected store and navigate to the Dealer Panel
    setSelectedStoreId(storeId);
    navigate('/dealer');
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
        <div className="text-center py-8">Loading admin stores...</div>
      </div>
    );
  }

  return (
    <>
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
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Create and access complete Dealer Panel stores with full AI-powered features, 
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
                {stores.map((store) => {
                  const countryInfo = getCountryDisplay(store.address);
                  
                  return (
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
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <ExternalLink className="w-4 h-4 text-gray-400" />
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

      <CreateStoreModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onStoreCreated={handleStoreCreated}
      />
    </>
  );
};

export default AdminStoreManagerTab;
