
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  Plus, 
  ExternalLink, 
  Upload, 
  Verified, 
  AlertTriangle,
  User,
  Mail,
  Phone,
  Globe,
  Edit
} from 'lucide-react';
import { useRealAdminStores, useCreateStore, useUpdateStoreVerification } from '@/hooks/admin/useRealAdminStores';

const AdminStoresTab = () => {
  const { data: stores = [], isLoading } = useRealAdminStores();
  const createStore = useCreateStore();
  const updateVerification = useUpdateStoreVerification();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    website: ''
  });

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStore.name.trim()) return;
    
    await createStore.mutateAsync(newStore);
    setNewStore({ name: '', description: '', email: '', phone: '', website: '' });
    setShowCreateForm(false);
  };

  const openDealerPanel = (storeId?: string) => {
    const url = storeId ? `/dealer?store=${storeId}` : '/dealer';
    window.open(url, '_blank');
  };

  const openCoinUpload = (storeId: string) => {
    window.open(`/upload?store=${storeId}`, '_blank');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading REAL store data from Supabase...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Real Data Status */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              🔴 REAL STORES MANAGEMENT - LIVE DATA
            </h2>
            <p className="text-green-600">
              {stores.length} Active Stores • Direct Dealer Access • Unlimited Creation
            </p>
          </div>
          <div className="space-y-2">
            <Button 
              onClick={() => openDealerPanel()}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <Store className="h-4 w-4" />
              Open Dealer Panel
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create New Store
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="stores" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stores">My Stores ({stores.length})</TabsTrigger>
          <TabsTrigger value="create">Quick Create</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stores" className="space-y-4">
          {stores.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Store className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Stores Yet</h3>
                <p className="text-gray-500 mb-4">Create your first store to start uploading coins</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Store
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store) => {
                const profile = Array.isArray(store.profiles) ? store.profiles[0] : store.profiles;
                
                return (
                  <Card key={store.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {profile?.avatar_url ? (
                            <img 
                              src={profile.avatar_url} 
                              alt={store.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <Store className="w-6 h-6 text-white" />
                            </div>
                          )}
                          <div>
                            <CardTitle className="text-lg">{store.name}</CardTitle>
                            <div className="flex items-center gap-2">
                              {store.verified ? (
                                <Badge className="bg-green-600 text-white">
                                  <Verified className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-orange-600 border-orange-600">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Pending
                                </Badge>
                              )}
                              {store.is_active && (
                                <Badge className="bg-blue-600 text-white">Active</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {store.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">{store.description}</p>
                      )}
                      
                      <div className="space-y-2 text-sm">
                        {profile?.full_name && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{profile.full_name}</span>
                          </div>
                        )}
                        {profile?.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-xs">{profile.email}</span>
                          </div>
                        )}
                        {store.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{store.phone}</span>
                          </div>
                        )}
                        {store.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <span className="text-xs">{store.website}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => openCoinUpload(store.id)}
                          className="flex-1"
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          Upload Coins
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openDealerPanel(store.id)}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        {!store.verified && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateVerification.mutate({ storeId: store.id, verified: true })}
                          >
                            <Verified className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Store</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateStore} className="space-y-4">
                <div>
                  <Label htmlFor="name">Store Name *</Label>
                  <Input
                    id="name"
                    value={newStore.name}
                    onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                    placeholder="Enter store name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newStore.description}
                    onChange={(e) => setNewStore({ ...newStore, description: e.target.value })}
                    placeholder="Describe your store"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStore.email}
                      onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                      placeholder="store@example.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newStore.phone}
                      onChange={(e) => setNewStore({ ...newStore, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={newStore.website}
                    onChange={(e) => setNewStore({ ...newStore, website: e.target.value })}
                    placeholder="https://yourstore.com"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={createStore.isPending || !newStore.name.trim()}
                >
                  {createStore.isPending ? 'Creating...' : 'Create Store'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminStoresTab;
