
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MapPin, Globe, Plus, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface RegionData {
  name: string;
  code: string;
  continent: string;
}

interface UpdateRegionParams {
  id: string;
  updates: Partial<RegionData>;
}

const AdminGeographyTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState(null);
  const [newRegion, setNewRegion] = useState<RegionData>({
    name: '',
    code: '',
    continent: ''
  });

  const queryClient = useQueryClient();

  // Geographic Regions Query
  const { data: regions = [], isLoading } = useQuery({
    queryKey: ['admin-geographic-regions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('geographic_regions')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Geographic Statistics
  const { data: geoStats } = useQuery({
    queryKey: ['admin-geography-stats'],
    queryFn: async () => {
      const totalRegions = regions.length;
      const continents = [...new Set(regions.map(r => r.continent).filter(Boolean))].length;
      
      return {
        totalRegions,
        continents,
        activeRegions: totalRegions // All regions are considered active for now
      };
    },
    enabled: regions.length > 0
  });

  // Create Region Mutation
  const createRegionMutation = useMutation({
    mutationFn: async (regionData: RegionData) => {
      const { error } = await supabase
        .from('geographic_regions')
        .insert([regionData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-geographic-regions'] });
      setIsAddDialogOpen(false);
      setNewRegion({ name: '', code: '', continent: '' });
      toast({
        title: "Success",
        description: "Geographic region created successfully.",
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

  // Update Region Mutation
  const updateRegionMutation = useMutation({
    mutationFn: async (params: UpdateRegionParams) => {
      const { error } = await supabase
        .from('geographic_regions')
        .update(params.updates)
        .eq('id', params.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-geographic-regions'] });
      setEditingRegion(null);
      toast({
        title: "Success",
        description: "Geographic region updated successfully.",
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

  // Delete Region Mutation
  const deleteRegionMutation = useMutation({
    mutationFn: async (regionId: string) => {
      const { error } = await supabase
        .from('geographic_regions')
        .delete()
        .eq('id', regionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-geographic-regions'] });
      toast({
        title: "Success",
        description: "Geographic region deleted successfully.",
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

  const filteredRegions = regions.filter(region =>
    region.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    region.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    region.continent?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRegion = () => {
    createRegionMutation.mutate(newRegion);
  };

  const handleUpdateRegion = (updates: Partial<RegionData>) => {
    if (editingRegion) {
      updateRegionMutation.mutate({ id: editingRegion.id, updates });
    }
  };

  return (
    <div className="space-y-6">
      {/* Geography Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Regions</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{geoStats?.totalRegions || 0}</div>
            <p className="text-xs text-muted-foreground">Geographic regions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Continents</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{geoStats?.continents || 0}</div>
            <p className="text-xs text-muted-foreground">Unique continents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Regions</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{geoStats?.activeRegions || 0}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Regions Management */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic Regions</CardTitle>
          <CardDescription>Manage geographic regions and locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Input
              placeholder="Search regions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Region
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Geographic Region</DialogTitle>
                  <DialogDescription>Create a new geographic region</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Region Name</Label>
                    <Input
                      id="name"
                      value={newRegion.name}
                      onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
                      placeholder="Enter region name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="code">Region Code</Label>
                    <Input
                      id="code"
                      value={newRegion.code}
                      onChange={(e) => setNewRegion({ ...newRegion, code: e.target.value })}
                      placeholder="Enter region code (e.g., US, EU)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="continent">Continent</Label>
                    <Input
                      id="continent"
                      value={newRegion.continent}
                      onChange={(e) => setNewRegion({ ...newRegion, continent: e.target.value })}
                      placeholder="Enter continent"
                    />
                  </div>
                  <Button 
                    onClick={handleCreateRegion}
                    disabled={createRegionMutation.isPending}
                    className="w-full"
                  >
                    Create Region
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">Loading geographic regions...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Continent</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegions.map((region) => (
                  <TableRow key={region.id}>
                    <TableCell className="font-medium">{region.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{region.code}</Badge>
                    </TableCell>
                    <TableCell>{region.continent || 'N/A'}</TableCell>
                    <TableCell>
                      {new Date(region.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingRegion(region)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteRegionMutation.mutate(region.id)}
                          disabled={deleteRegionMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Region Dialog */}
      {editingRegion && (
        <Dialog open={!!editingRegion} onOpenChange={() => setEditingRegion(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Geographic Region</DialogTitle>
              <DialogDescription>Update geographic region details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Region Name</Label>
                <Input
                  id="edit-name"
                  defaultValue={editingRegion.name}
                  onChange={(e) => setEditingRegion({ ...editingRegion, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-code">Region Code</Label>
                <Input
                  id="edit-code"
                  defaultValue={editingRegion.code}
                  onChange={(e) => setEditingRegion({ ...editingRegion, code: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-continent">Continent</Label>
                <Input
                  id="edit-continent"
                  defaultValue={editingRegion.continent}
                  onChange={(e) => setEditingRegion({ ...editingRegion, continent: e.target.value })}
                />
              </div>
              <Button 
                onClick={() => handleUpdateRegion({
                  name: editingRegion.name,
                  code: editingRegion.code,
                  continent: editingRegion.continent
                })}
                disabled={updateRegionMutation.isPending}
                className="w-full"
              >
                Update Region
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminGeographyTab;
