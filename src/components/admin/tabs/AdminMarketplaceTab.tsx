
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, Users, TrendingUp, Globe, Plus, RefreshCw, Settings, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface MarketplaceTenant {
  id: string;
  name: string;
  domain: string;
  is_active: boolean;
  settings: any;
  created_at: string;
}

interface CreateTenantParams {
  name: string;
  domain: string;
  settings: any;
}

const AdminMarketplaceTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTenant, setNewTenant] = useState<CreateTenantParams>({
    name: '',
    domain: '',
    settings: {}
  });

  const queryClient = useQueryClient();

  // Marketplace Listings Query
  const { data: listings = [], isLoading: listingsLoading } = useQuery({
    queryKey: ['admin-marketplace-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select(`
          *,
          profiles!marketplace_listings_seller_id_fkey (
            id,
            name,
            email
          ),
          coins (
            id,
            name,
            image,
            year
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Marketplace Stats Query
  const { data: marketplaceStats = [] } = useQuery({
    queryKey: ['admin-marketplace-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_stats')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Marketplace Tenants Query
  const { data: tenants = [] } = useQuery({
    queryKey: ['admin-marketplace-tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_tenants')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Current Marketplace Overview Stats
  const { data: overviewStats } = useQuery({
    queryKey: ['admin-marketplace-overview'],
    queryFn: async () => {
      const totalListings = listings.length;
      const activeListings = listings.filter(listing => listing.status === 'active').length;
      const totalVolume = listings.reduce((sum, listing) => sum + Number(listing.current_price || 0), 0);
      const avgPrice = activeListings > 0 ? totalVolume / activeListings : 0;
      
      // Today's stats
      const today = new Date().toDateString();
      const todaysListings = listings.filter(listing => 
        new Date(listing.created_at).toDateString() === today
      ).length;
      
      const activeTenants = tenants.filter(tenant => tenant.is_active).length;
      
      return {
        totalListings,
        activeListings,
        totalVolume,
        avgPrice,
        todaysListings,
        totalTenants: tenants.length,
        activeTenants
      };
    },
    enabled: listings.length > 0 || tenants.length > 0
  });

  // Create Tenant Mutation
  const createTenantMutation = useMutation({
    mutationFn: async (tenantData: CreateTenantParams) => {
      const { error } = await supabase
        .from('marketplace_tenants')
        .insert([{
          ...tenantData,
          is_active: true
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-marketplace-tenants'] });
      setIsCreateDialogOpen(false);
      setNewTenant({ name: '', domain: '', settings: {} });
      toast({
        title: "Success",
        description: "Marketplace tenant created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Toggle Tenant Status Mutation
  const toggleTenantMutation = useMutation({
    mutationFn: async ({ tenantId, isActive }: { tenantId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('marketplace_tenants')
        .update({ is_active: isActive })
        .eq('id', tenantId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-marketplace-tenants'] });
      toast({
        title: "Success",
        description: "Tenant status updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const getListingStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredListings = listings.filter(listing =>
    listing.listing_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.coins?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTenants = tenants.filter(tenant =>
    tenant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.domain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTenant = () => {
    createTenantMutation.mutate(newTenant);
  };

  return (
    <div className="space-y-6">
      {/* Marketplace Overview Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats?.totalListings || 0}</div>
            <p className="text-xs text-muted-foreground">
              {overviewStats?.activeListings || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(overviewStats?.totalVolume || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(overviewStats?.avgPrice || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Average listing price</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats?.activeTenants || 0}</div>
            <p className="text-xs text-muted-foreground">
              of {overviewStats?.totalTenants || 0} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Marketplace Management Tabs */}
      <Tabs defaultValue="listings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="listings">Marketplace Listings</TabsTrigger>
          <TabsTrigger value="tenants">Marketplace Tenants</TabsTrigger>
          <TabsTrigger value="stats">Performance Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Listings</CardTitle>
              <CardDescription>Manage all marketplace listings and auctions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Input
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Button
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-marketplace-listings'] })}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              
              {listingsLoading ? (
                <div className="text-center py-8">Loading marketplace listings...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Coin</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Starting Price</TableHead>
                      <TableHead>Current Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ends</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredListings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell>
                          {listing.coins ? (
                            <div className="flex items-center gap-2">
                              {listing.coins.image && (
                                <img 
                                  src={listing.coins.image} 
                                  alt={listing.coins.name}
                                  className="w-8 h-8 object-cover rounded"
                                />
                              )}
                              <div>
                                <div className="text-sm font-medium">{listing.coins.name}</div>
                                <div className="text-xs text-muted-foreground">{listing.coins.year}</div>
                              </div>
                            </div>
                          ) : (
                            'Unknown Coin'
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {listing.profiles?.name || 'Unknown Seller'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {listing.profiles?.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{listing.listing_type}</Badge>
                        </TableCell>
                        <TableCell>${Number(listing.starting_price || 0).toFixed(2)}</TableCell>
                        <TableCell className="font-medium">
                          ${Number(listing.current_price || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getListingStatusColor(listing.status)}>
                            {listing.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {listing.ends_at 
                            ? new Date(listing.ends_at).toLocaleDateString()
                            : 'No end date'
                          }
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Tenants</CardTitle>
              <CardDescription>Manage marketplace tenants and domains</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Input
                  placeholder="Search tenants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-marketplace-tenants'] })}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Tenant
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Marketplace Tenant</DialogTitle>
                        <DialogDescription>Add a new marketplace tenant</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Tenant Name</Label>
                          <Input
                            id="name"
                            value={newTenant.name}
                            onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                            placeholder="Enter tenant name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="domain">Domain</Label>
                          <Input
                            id="domain"
                            value={newTenant.domain}
                            onChange={(e) => setNewTenant({ ...newTenant, domain: e.target.value })}
                            placeholder="Enter domain (e.g., example.com)"
                          />
                        </div>
                        <Button 
                          onClick={handleCreateTenant}
                          disabled={createTenantMutation.isPending}
                          className="w-full"
                        >
                          Create Tenant
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          {tenant.domain}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tenant.is_active ? 'default' : 'secondary'}>
                          {tenant.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(tenant.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleTenantMutation.mutate({ 
                              tenantId: tenant.id, 
                              isActive: !tenant.is_active 
                            })}
                            disabled={toggleTenantMutation.isPending}
                          >
                            {tenant.is_active ? 'Disable' : 'Enable'}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Performance Statistics</CardTitle>
              <CardDescription>Historical marketplace performance data</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Listed Coins</TableHead>
                    <TableHead>Active Auctions</TableHead>
                    <TableHead>Weekly Transactions</TableHead>
                    <TableHead>Total Volume</TableHead>
                    <TableHead>Registered Users</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketplaceStats.map((stat) => (
                    <TableRow key={stat.id}>
                      <TableCell>
                        {new Date(stat.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{stat.listed_coins || 0}</TableCell>
                      <TableCell>{stat.active_auctions || 0}</TableCell>
                      <TableCell>{stat.weekly_transactions || 0}</TableCell>
                      <TableCell>
                        ${Number(stat.total_volume || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>{stat.registered_users || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMarketplaceTab;
