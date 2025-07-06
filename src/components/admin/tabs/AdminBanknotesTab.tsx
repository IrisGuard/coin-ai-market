import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Banknote, Search, Eye, Trash2, Star, DollarSign, Camera } from 'lucide-react';
import CoinImageEditor from '@/components/dealer/CoinImageEditor';

const AdminBanknotesTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBanknote, setEditingBanknote] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: banknotes, isLoading } = useQuery({
    queryKey: ['admin-banknotes', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('banknotes')
        .select(`
          *,
          profiles!banknotes_user_id_fkey (
            id,
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const toggleFeatured = useMutation({
    mutationFn: async ({ banknoteId, featured }: { banknoteId: string; featured: boolean }) => {
      const { error } = await supabase
        .from('banknotes')
        .update({ featured })
        .eq('id', banknoteId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banknotes'] });
      toast({
        title: "Banknote Updated",
        description: "Banknote featured status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'Failed to update banknote',
        variant: "destructive",
      });
    },
  });

  const deleteBanknote = useMutation({
    mutationFn: async (banknoteId: string) => {
      const { error } = await supabase
        .from('banknotes')
        .delete()
        .eq('id', banknoteId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banknotes'] });
      toast({
        title: "Banknote Deleted",
        description: "Banknote has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'Failed to delete banknote',
        variant: "destructive",
      });
    },
  });

  const handleDelete = (banknoteId: string) => {
    deleteBanknote.mutate(banknoteId);
  };

  const handleEditImages = (banknote: any) => {
    setEditingBanknote(banknote);
  };

  const handleImagesUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-banknotes'] });
    setEditingBanknote(null);
  };

  const getValidImages = (banknote: any): string[] => {
    const allImages: string[] = [];
    
    if (banknote.images && Array.isArray(banknote.images) && banknote.images.length > 0) {
      const validImages = banknote.images.filter((img: string) => 
        img && typeof img === 'string' && img.trim() !== '' && !img.startsWith('blob:')
      );
      allImages.push(...validImages);
    }
    
    if (allImages.length === 0 && banknote.image && !banknote.image.startsWith('blob:')) {
      allImages.push(banknote.image);
    }
    
    return allImages;
  };

  const totalBanknotes = banknotes?.length || 0;
  const featuredBanknotes = banknotes?.filter(banknote => banknote.featured)?.length || 0;
  const totalValue = banknotes?.reduce((sum, banknote) => sum + (banknote.price || 0), 0) || 0;
  const errorBanknotes = banknotes?.filter(banknote => banknote.error_type)?.length || 0;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Banknote Management</h3>
            <p className="text-sm text-muted-foreground">Manage all banknote listings including error notes</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Banknotes</CardTitle>
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBanknotes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured Notes</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{featuredBanknotes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Notes</CardTitle>
              <Badge className="h-4 w-4" variant="destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{errorBanknotes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search banknotes by name, country, or series..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Banknotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-b-2 border-coin-purple mx-auto mb-4"></div>
                  <p>Loading banknotes...</p>
                </div>
              ) : banknotes?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No banknotes found
                </div>
              ) : (
                banknotes?.map((banknote: any) => {
                  const validImages = getValidImages(banknote);
                  
                  return (
                    <div key={banknote.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={validImages[0] || '/placeholder.svg'} 
                          alt={banknote.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                        <div>
                          <div className="font-medium">{banknote.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {banknote.year} • {banknote.country} • {banknote.denomination}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Owner: {banknote.profiles?.name || 'Unknown'}
                          </div>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">${banknote.price}</Badge>
                            {banknote.featured && <Badge variant="default">Featured</Badge>}
                            {banknote.error_type && <Badge variant="destructive">Error: {banknote.error_type}</Badge>}
                            {banknote.serial_number && <Badge variant="secondary">S/N: {banknote.serial_number}</Badge>}
                            {validImages.length > 1 && (
                              <Badge variant="outline">{validImages.length} photos</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/coin/${banknote.id}`, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditImages(banknote)}
                        >
                          <Camera className="h-4 w-4" />
                          Images
                        </Button>
                        <Button
                          variant={banknote.featured ? "destructive" : "default"}
                          size="sm"
                          onClick={() => toggleFeatured.mutate({ 
                            banknoteId: banknote.id, 
                            featured: !banknote.featured 
                          })}
                          disabled={toggleFeatured.isPending}
                        >
                          <Star className="h-4 w-4" />
                          {banknote.featured ? 'Unfeature' : 'Feature'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this banknote?')) {
                              handleDelete(banknote.id);
                            }
                          }}
                          disabled={deleteBanknote.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {editingBanknote && (
        <Dialog open={!!editingBanknote} onOpenChange={() => setEditingBanknote(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                Edit Images - {editingBanknote.name}
              </DialogTitle>
            </DialogHeader>
            <CoinImageEditor
              coinId={editingBanknote.id}
              coinName={editingBanknote.name}
              currentImages={getValidImages(editingBanknote)}
              onImagesUpdated={handleImagesUpdated}
              maxImages={10}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AdminBanknotesTab;