import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Gem, Search, Eye, Trash2, Star, DollarSign, Camera, Scale } from 'lucide-react';
import CoinImageEditor from '@/components/dealer/CoinImageEditor';

const AdminBullionTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBullion, setEditingBullion] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: bullionBars, isLoading } = useQuery({
    queryKey: ['admin-bullion', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('bullion_bars')
        .select(`
          *,
          profiles!bullion_bars_user_id_fkey (
            id,
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,refinery.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const toggleFeatured = useMutation({
    mutationFn: async ({ bullionId, featured }: { bullionId: string; featured: boolean }) => {
      const { error } = await supabase
        .from('bullion_bars')
        .update({ featured })
        .eq('id', bullionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bullion'] });
      toast({
        title: "Bullion Updated",
        description: "Bullion featured status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'Failed to update bullion',
        variant: "destructive",
      });
    },
  });

  const deleteBullion = useMutation({
    mutationFn: async (bullionId: string) => {
      const { error } = await supabase
        .from('bullion_bars')
        .delete()
        .eq('id', bullionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bullion'] });
      toast({
        title: "Bullion Deleted",
        description: "Bullion has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'Failed to delete bullion',
        variant: "destructive",
      });
    },
  });

  const handleDelete = (bullionId: string) => {
    deleteBullion.mutate(bullionId);
  };

  const handleEditImages = (bullion: any) => {
    setEditingBullion(bullion);
  };

  const handleImagesUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-bullion'] });
    setEditingBullion(null);
  };

  const getValidImages = (bullion: any): string[] => {
    const allImages: string[] = [];
    
    if (bullion.images && Array.isArray(bullion.images) && bullion.images.length > 0) {
      const validImages = bullion.images.filter((img: string) => 
        img && typeof img === 'string' && img.trim() !== '' && !img.startsWith('blob:')
      );
      allImages.push(...validImages);
    }
    
    if (allImages.length === 0 && bullion.image && !bullion.image.startsWith('blob:')) {
      allImages.push(bullion.image);
    }
    
    return allImages;
  };

  const totalBullion = bullionBars?.length || 0;
  const featuredBullion = bullionBars?.filter(bullion => bullion.featured)?.length || 0;
  const totalValue = bullionBars?.reduce((sum, bullion) => sum + (bullion.price || 0), 0) || 0;
  const totalWeight = bullionBars?.reduce((sum, bullion) => sum + (bullion.weight || 0), 0) || 0;
  const goldBars = bullionBars?.filter(bullion => bullion.metal_type === 'gold')?.length || 0;
  const silverBars = bullionBars?.filter(bullion => bullion.metal_type === 'silver')?.length || 0;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Bullion Management</h3>
            <p className="text-sm text-muted-foreground">Manage all precious metal bars, ingots, and rounds</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bullion</CardTitle>
              <Gem className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBullion}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gold Bars</CardTitle>
              <div className="h-4 w-4 bg-yellow-400 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{goldBars}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Silver Bars</CardTitle>
              <div className="h-4 w-4 bg-gray-300 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{silverBars}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Weight</CardTitle>
              <Scale className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWeight.toFixed(2)} oz</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{featuredBullion}</div>
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
            placeholder="Search bullion by name, brand, or refinery..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bullion Bars & Rounds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-b-2 border-coin-purple mx-auto mb-4"></div>
                  <p>Loading bullion...</p>
                </div>
              ) : bullionBars?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No bullion found
                </div>
              ) : (
                bullionBars?.map((bullion: any) => {
                  const validImages = getValidImages(bullion);
                  
                  return (
                    <div key={bullion.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={validImages[0] || '/placeholder.svg'} 
                          alt={bullion.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                        <div>
                          <div className="font-medium">{bullion.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {bullion.metal_type.toUpperCase()} • {bullion.weight} oz • {(bullion.purity * 100).toFixed(1)}% Pure
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {bullion.brand && `Brand: ${bullion.brand}`} {bullion.refinery && `• Refinery: ${bullion.refinery}`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Owner: {bullion.profiles?.name || 'Unknown'}
                          </div>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">${bullion.price}</Badge>
                            <Badge variant={bullion.metal_type === 'gold' ? 'default' : 'secondary'}>
                              {bullion.metal_type.toUpperCase()}
                            </Badge>
                            {bullion.featured && <Badge variant="default">Featured</Badge>}
                            {bullion.assay_certificate && <Badge variant="secondary">Certified</Badge>}
                            {bullion.serial_number && <Badge variant="outline">S/N: {bullion.serial_number}</Badge>}
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
                          onClick={() => window.open(`/coin/${bullion.id}`, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditImages(bullion)}
                        >
                          <Camera className="h-4 w-4" />
                          Images
                        </Button>
                        <Button
                          variant={bullion.featured ? "destructive" : "default"}
                          size="sm"
                          onClick={() => toggleFeatured.mutate({ 
                            bullionId: bullion.id, 
                            featured: !bullion.featured 
                          })}
                          disabled={toggleFeatured.isPending}
                        >
                          <Star className="h-4 w-4" />
                          {bullion.featured ? 'Unfeature' : 'Feature'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this bullion item?')) {
                              handleDelete(bullion.id);
                            }
                          }}
                          disabled={deleteBullion.isPending}
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

      {editingBullion && (
        <Dialog open={!!editingBullion} onOpenChange={() => setEditingBullion(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                Edit Images - {editingBullion.name}
              </DialogTitle>
            </DialogHeader>
            <CoinImageEditor
              coinId={editingBullion.id}
              coinName={editingBullion.name}
              currentImages={getValidImages(editingBullion)}
              onImagesUpdated={handleImagesUpdated}
              maxImages={10}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AdminBullionTab;