
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Store, Plus, Eye, Edit, Trash2, DollarSign } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const MarketplaceListingsManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newListing, setNewListing] = useState({
    listing_type: '',
    starting_price: '',
    buyout_price: '',
    coin_id: '',
    seller_id: ''
  });

  const queryClient = useQueryClient();

  const { data: listings, isLoading } = useQuery({
    queryKey: ['marketplace-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select(`
          *,
          coins:coin_id(name, image, grade),
          profiles:seller_id(name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: coins } = useQuery({
    queryKey: ['available-coins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select('id, name, image')
        .limit(50);
      
      if (error) throw error;
      return data || [];
    }
  });

  const createListingMutation = useMutation({
    mutationFn: async (listingData: any) => {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .insert({
          ...listingData,
          starting_price: parseFloat(listingData.starting_price),
          buyout_price: listingData.buyout_price ? parseFloat(listingData.buyout_price) : null,
          current_price: parseFloat(listingData.starting_price)
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      setIsCreateDialogOpen(false);
      setNewListing({
        listing_type: '',
        starting_price: '',
        buyout_price: '',
        coin_id: '',
        seller_id: ''
      });
      toast({
        title: "Success",
        description: "Marketplace listing created successfully",
      });
    }
  });

  const deleteListingMutation = useMutation({
    mutationFn: async (listingId: string) => {
      const { error } = await supabase
        .from('marketplace_listings')
        .delete()
        .eq('id', listingId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      toast({
        title: "Success",
        description: "Marketplace listing deleted successfully",
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getListingTypeColor = (type: string) => {
    switch (type) {
      case 'auction': return 'bg-purple-100 text-purple-800';
      case 'fixed_price': return 'bg-blue-100 text-blue-800';
      case 'make_offer': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = {
    total: listings?.length || 0,
    active: listings?.filter(l => l.status === 'active').length || 0,
    sold: listings?.filter(l => l.status === 'sold').length || 0,
    totalValue: listings?.reduce((sum, l) => sum + (l.current_price || 0), 0) || 0
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.sold}</div>
            <p className="text-xs text-muted-foreground">Sold</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Store className="h-6 w-6 text-blue-600" />
              Marketplace Listings Management
            </CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Listing
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Marketplace Listing</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Listing Type</label>
                    <Select onValueChange={(value) => setNewListing({...newListing, listing_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select listing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auction">Auction</SelectItem>
                        <SelectItem value="fixed_price">Fixed Price</SelectItem>
                        <SelectItem value="make_offer">Make Offer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Coin</label>
                    <Select onValueChange={(value) => setNewListing({...newListing, coin_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select coin" />
                      </SelectTrigger>
                      <SelectContent>
                        {coins?.map((coin) => (
                          <SelectItem key={coin.id} value={coin.id}>
                            {coin.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Starting Price</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newListing.starting_price}
                        onChange={(e) => setNewListing({...newListing, starting_price: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Buyout Price (Optional)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newListing.buyout_price}
                        onChange={(e) => setNewListing({...newListing, buyout_price: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => createListingMutation.mutate(newListing)}>
                    Create Listing
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coin</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Buyout Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings?.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {listing.coins?.image && (
                        <img 
                          src={listing.coins.image} 
                          alt={listing.coins?.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium">{listing.coins?.name}</div>
                        <div className="text-sm text-muted-foreground">{listing.coins?.grade}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getListingTypeColor(listing.listing_type)}>
                      {listing.listing_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">${listing.current_price?.toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {listing.buyout_price ? `$${listing.buyout_price.toLocaleString()}` : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(listing.status)}>
                      {listing.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{listing.profiles?.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteListingMutation.mutate(listing.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketplaceListingsManager;
