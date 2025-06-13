
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Plus, Edit, Search, Star, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ErrorKnowledgeBaseManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newError, setNewError] = useState({
    error_name: '',
    error_type: '',
    error_category: '',
    description: '',
    severity_level: 1,
    rarity_score: 1,
    detection_difficulty: 1,
    market_premium_multiplier: 1.0
  });

  const queryClient = useQueryClient();

  const { data: errorKnowledge, isLoading } = useQuery({
    queryKey: ['error-knowledge'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_coins_knowledge')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching error knowledge:', error);
        throw error;
      }
      
      console.log('✅ Error knowledge loaded:', data?.length);
      return data || [];
    }
  });

  const addErrorMutation = useMutation({
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
      queryClient.invalidateQueries({ queryKey: ['error-knowledge'] });
      setIsAddDialogOpen(false);
      setNewError({
        error_name: '',
        error_type: '',
        error_category: '',
        description: '',
        severity_level: 1,
        rarity_score: 1,
        detection_difficulty: 1,
        market_premium_multiplier: 1.0
      });
    }
  });

  const filteredErrors = errorKnowledge?.filter(error => {
    const matchesSearch = error.error_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         error.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || error.error_category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const getSeverityColor = (level: number) => {
    if (level >= 8) return 'bg-red-100 text-red-800';
    if (level >= 5) return 'bg-orange-100 text-orange-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getRarityColor = (score: number) => {
    if (score >= 8) return 'bg-purple-100 text-purple-800';
    if (score >= 5) return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
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
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              Error Coins Knowledge Base
              <Badge variant="outline">{filteredErrors.length} Entries</Badge>
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Error Type
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Error Type</DialogTitle>
                </DialogHeader>
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
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="die_error">Die Error</SelectItem>
                        <SelectItem value="planchet_error">Planchet Error</SelectItem>
                        <SelectItem value="striking_error">Striking Error</SelectItem>
                        <SelectItem value="post_mint_damage">Post-Mint Damage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      value={newError.error_category}
                      onChange={(e) => setNewError({...newError, error_category: e.target.value})}
                      placeholder="morgan_dollars"
                    />
                  </div>
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
                    <label className="text-sm font-medium">Market Premium Multiplier</label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={newError.market_premium_multiplier}
                      onChange={(e) => setNewError({...newError, market_premium_multiplier: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newError.description}
                      onChange={(e) => setNewError({...newError, description: e.target.value})}
                      placeholder="Detailed description of the error..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => addErrorMutation.mutate(newError)}>
                    Add Error Type
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search error types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="morgan_dollars">Morgan Dollars</SelectItem>
                <SelectItem value="peace_dollars">Peace Dollars</SelectItem>
                <SelectItem value="walking_liberty">Walking Liberty</SelectItem>
                <SelectItem value="lincoln_cents">Lincoln Cents</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Error Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Rarity</TableHead>
                <TableHead>Market Premium</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredErrors.map((error) => (
                <TableRow key={error.id}>
                  <TableCell>
                    <div className="font-medium">{error.error_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {error.description.substring(0, 100)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{error.error_type}</Badge>
                  </TableCell>
                  <TableCell>{error.error_category}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(error.severity_level)}>
                      {error.severity_level}/10
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Badge className={getRarityColor(error.rarity_score)}>
                        {error.rarity_score}/10
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono">
                      {error.market_premium_multiplier}x
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
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

export default ErrorKnowledgeBaseManager;
