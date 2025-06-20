
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useUnlimitedStores } from '@/hooks/admin/useUnlimitedStores';
import { Store, Plus, Upload, ExternalLink, Activity, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminStoresTab = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStoreData, setNewStoreData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    website: ''
  });

  const { stores, isLoading, createStore, totalStores, activeStores, verifiedStores } = useUnlimitedStores();

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreData.name.trim()) return;
    
    try {
      await createStore.mutateAsync(newStoreData);
      setNewStoreData({ name: '', description: '', email: '', phone: '', website: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Store creation error:', error);
    }
  };

  const openDealerPanel = (storeId: string) => {
    // Navigate to dealer panel with store context
    navigate(`/dealer?store=${storeId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalStores}</div>
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
                <div className="text-2xl font-bold text-green-600">{activeStores}</div>
                <p className="text-xs text-muted-foreground">Active Stores</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{verifiedStores}</div>
                <p className="text-xs text-muted-foreground">Verified Stores</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {stores.reduce((sum, store) => sum + (store.coins?.length || 0), 0)}
                </div>
                <p className="text-xs text-muted-foreground">Total Coins</p>
              </div>
              <Upload className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Store Management Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Store className="w-6 h-6" />
              Store Management - UNLIMITED STORES
            </CardTitle>
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Store
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Search stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* Create Store Form */}
          {showCreateForm && (
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Create New Store</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateStore} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Store Name *"
                      value={newStoreData.name}
                      onChange={(e) => setNewStoreData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={newStoreData.email}
                      onChange={(e) => setNewStoreData(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <Input
                      placeholder="Phone"
                      value={newStoreData.phone}
                      onChange={(e) => setNewStoreData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                    <Input
                      placeholder="Website"
                      value={newStoreData.website}
                      onChange={(e) => setNewStoreData(prev => ({ ...prev, website: e.target.value }))}
                    />
                  </div>
                  <Input
                    placeholder="Description"
                    value={newStoreData.description}
                    onChange={(e) => setNewStoreData(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" disabled={createStore.isPending}>
                      {createStore.isPending ? 'Creating...' : 'Create Store'}
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
              </CardContent>
            </Card>
          )}

          {/* Stores Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStores.map((store) => (
              <Card key={store.id} className="border-blue-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold truncate">
                      {store.name}
                    </CardTitle>
                    <div className="flex gap-1">
                      {store.verified && (
                        <Badge className="bg-green-600">Verified</Badge>
                      )}
                      {store.is_active && (
                        <Badge className="bg-blue-600">Active</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {store.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {store.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Coins: {store.coins?.length || 0}</span>
                      <span className="text-gray-500">
                        Owner: {store.profiles?.full_name || store.profiles?.username || 'Unknown'}
                      </span>
                    </div>

                    {store.email && (
                      <p className="text-xs text-gray-500">📧 {store.email}</p>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => openDealerPanel(store.id)}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Upload Coins
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`/dealer?store=${store.id}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Dealer Panel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStores.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Store className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">No stores found</p>
              <p className="text-sm">Create your first store to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStoresTab;
