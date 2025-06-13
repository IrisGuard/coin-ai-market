
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const ErrorCoinsKnowledgeManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newError, setNewError] = useState({
    error_name: '',
    error_type: '',
    error_category: '',
    description: '',
    severity_level: 1,
    rarity_score: 1,
    market_premium_multiplier: 1.0
  });

  const queryClient = useQueryClient();

  const { data: errorCoins, isLoading } = useQuery({
    queryKey: ['error-coins-knowledge'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_coins_knowledge')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const createErrorMutation = useMutation({
    mutationFn: async (errorData: any) => {
      const { data, error } = await supabase
        .from('error_coins_knowledge')
        .insert(errorData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['error-coins-knowledge'] });
      setIsCreateDialogOpen(false);
      setNewError({
        error_name: '',
        error_type: '',
        error_category: '',
        description: '',
        severity_level: 1,
        rarity_score: 1,
        market_premium_multiplier: 1.0
      });
      toast({
        title: "Success",
        description: "Error coin knowledge added successfully",
      });
    }
  });

  const deleteErrorMutation = useMutation({
    mutationFn: async (errorId: string) => {
      const { error } = await supabase
        .from('error_coins_knowledge')
        .delete()
        .eq('id', errorId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['error-coins-knowledge'] });
      toast({
        title: "Success",
        description: "Error coin knowledge deleted successfully",
      });
    }
  });

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return 'bg-red-100 text-red-800';
    if (severity >= 5) return 'bg-orange-100 text-orange-800';
    if (severity >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getRarityColor = (rarity: number) => {
    if (rarity >= 8) return 'bg-purple-100 text-purple-800';
    if (rarity >= 5) return 'bg-blue-100 text-blue-800';
    if (rarity >= 3) return 'bg-indigo-100 text-indigo-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = {
    total: errorCoins?.length || 0,
    highSeverity: errorCoins?.filter(e => e.severity_level >= 7).length || 0,
    rare: errorCoins?.filter(e => e.rarity_score >= 7).length || 0,
    categories: new Set(errorCoins?.map(e => e.error_category)).size || 0
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Error Types</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.highSeverity}</div>
            <p className="text-xs text-muted-foreground">High Severity</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{stats.rare}</div>
            <p className="text-xs text-muted-foreground">Rare Errors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.categories}</div>
            <p className="text-xs text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              Error Coins Knowledge Base
            </CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Error Type
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Error Coin Knowledge</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Error Name</label>
                      <Input
                        value={newError.error_name}
                        onChange={(e) => setNewError({...newError, error_name: e.target.value})}
                        placeholder="Double Die Obverse"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Error Type</label>
                      <Select onValueChange={(value) => setNewError({...newError, error_type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select error type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="die_error">Die Error</SelectItem>
                          <SelectItem value="planchet_error">Planchet Error</SelectItem>
                          <SelectItem value="striking_error">Striking Error</SelectItem>
                          <SelectItem value="off_center">Off Center</SelectItem>
                          <SelectItem value="wrong_planchet">Wrong Planchet</SelectItem>
                          <SelectItem value="broadstrike">Broadstrike</SelectItem>
                          <SelectItem value="clipped_planchet">Clipped Planchet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      value={newError.error_category}
                      onChange={(e) => setNewError({...newError, error_category: e.target.value})}
                      placeholder="Lincoln Cent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newError.description}
                      onChange={(e) => setNewError({...newError, description: e.target.value})}
                      placeholder="Detailed description of the error..."
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Severity Level (1-10)</label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={newError.severity_level}
                        onChange={(e) => setNewError({...newError, severity_level: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rarity Score (1-10)</label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={newError.rarity_score}
                        onChange={(e) => setNewError({...newError, rarity_score: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Premium Multiplier</label>
                      <Input
                        type="number"
                        step="0.1"
                        min="1"
                        value={newError.market_premium_multiplier}
                        onChange={(e) => setNewError({...newError, market_premium_multiplier: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => createErrorMutation.mutate(newError)}>
                    Add Error Type
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
                <TableHead>Error Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Rarity</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {errorCoins?.map((error) => (
                <TableRow key={error.id}>
                  <TableCell>
                    <div className="font-medium">{error.error_name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{error.error_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{error.error_category}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(error.severity_level)}>
                      {error.severity_level}/10
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRarityColor(error.rarity_score)}>
                      {error.rarity_score}/10
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{error.market_premium_multiplier}x</div>
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
                        onClick={() => deleteErrorMutation.mutate(error.id)}
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

export default ErrorCoinsKnowledgeManager;
