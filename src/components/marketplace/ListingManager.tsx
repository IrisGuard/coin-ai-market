
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMarketplace } from '@/hooks/useMarketplace';
import { Edit, Trash2, Eye, DollarSign } from 'lucide-react';
import ListingEditor from './ListingEditor';

const ListingManager = () => {
  const [editingListing, setEditingListing] = useState<any>(null);
  const { deleteListing, isDeleting } = useMarketplace();

  const { data: userListings, isLoading } = useQuery({
    queryKey: ['user-listings'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return [];

      const { data, error } = await supabase
        .from('marketplace_listings')
        .select(`
          *,
          coins (*)
        `)
        .eq('seller_id', user.data.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (listing: any) => {
    setEditingListing(listing);
  };

  const handleDelete = (listingId: string) => {
    if (window.confirm('Are you sure you want to cancel this listing?')) {
      deleteListing(listingId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            My Listings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userListings && userListings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Coin</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userListings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {listing.coins?.image && (
                          <img 
                            src={listing.coins.image} 
                            alt={listing.coins.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{listing.coins?.name || 'Unknown'}</div>
                          <div className="text-sm text-muted-foreground">
                            {listing.coins?.year} • {listing.coins?.grade}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{listing.listing_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">${listing.current_price}</span>
                      {listing.buyout_price && (
                        <div className="text-sm text-muted-foreground">
                          Buy Now: ${listing.buyout_price}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(listing.status)}>
                        {listing.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(listing.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(listing)}
                          disabled={listing.status !== 'active'}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(listing.id)}
                          disabled={listing.status !== 'active' || isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No listings found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Create your first listing to get started selling
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {editingListing && (
        <ListingEditor
          listing={editingListing}
          onClose={() => setEditingListing(null)}
        />
      )}
    </div>
  );
};

export default ListingManager;
