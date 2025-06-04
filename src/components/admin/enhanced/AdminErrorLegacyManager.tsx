
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useErrorCoins } from '@/hooks/useEnhancedDataSources';
import { 
  AlertTriangle, 
  Plus, 
  Star, 
  TrendingUp,
  Eye,
  Search
} from 'lucide-react';

const AdminErrorLegacyManager = () => {
  const { data: errorCoins } = useErrorCoins();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const [newError, setNewError] = useState({
    error_type: 'die_crack',
    error_description: '',
    rarity_multiplier: 1.0,
    value_premium_percent: 0,
    identification_markers: []
  });

  const getErrorTypeColor = (type: string) => {
    const colors = {
      'double_strike': 'bg-red-100 text-red-800',
      'off_center': 'bg-orange-100 text-orange-800',
      'die_crack': 'bg-yellow-100 text-yellow-800',
      'clipped_planchet': 'bg-blue-100 text-blue-800',
      'broad_strike': 'bg-purple-100 text-purple-800',
      'weak_strike': 'bg-gray-100 text-gray-800',
      'die_break': 'bg-red-200 text-red-900',
      'cuds': 'bg-green-100 text-green-800',
      'lamination': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getRarityStars = (multiplier: number) => {
    const stars = Math.min(5, Math.max(1, Math.round(multiplier)));
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-3 w-3 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const filteredErrorCoins = errorCoins?.filter(coin => {
    const matchesSearch = coin.error_description.toLowerCase().includes(searchFilter.toLowerCase()) ||
                         coin.error_type.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesType = typeFilter === 'all' || coin.error_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const errorTypes = [
    'die_crack', 'double_strike', 'off_center', 'clipped_planchet', 
    'broad_strike', 'weak_strike', 'die_break', 'cuds', 'lamination',
    'striking_error', 'planchet_error', 'die_error'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Legacy Error Coins Database</h3>
          <p className="text-sm text-muted-foreground">
            Original error coin database - will be migrated to new system
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Error Type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Error Coin Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="error_type">Error Type</Label>
                  <Select value={newError.error_type} onValueChange={(value) => setNewError({...newError, error_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {errorTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.replace('_', ' ').toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rarity_multiplier">Rarity Multiplier</Label>
                  <Input
                    id="rarity_multiplier"
                    type="number"
                    step="0.1"
                    value={newError.rarity_multiplier}
                    onChange={(e) => setNewError({...newError, rarity_multiplier: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="error_description">Error Description</Label>
                <Textarea
                  id="error_description"
                  value={newError.error_description}
                  onChange={(e) => setNewError({...newError, error_description: e.target.value})}
                  placeholder="Detailed description of the error type..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="value_premium">Value Premium (%)</Label>
                <Input
                  id="value_premium"
                  type="number"
                  value={newError.value_premium_percent}
                  onChange={(e) => setNewError({...newError, value_premium_percent: parseInt(e.target.value)})}
                  placeholder="0"
                />
              </div>

              <Button className="w-full">
                Add Error Type
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search error types..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {errorTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type.replace('_', ' ').toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Legacy Error Coins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredErrorCoins?.map((errorCoin) => (
          <Card key={errorCoin.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge className={getErrorTypeColor(errorCoin.error_type)}>
                  {errorCoin.error_type.replace('_', ' ').toUpperCase()}
                </Badge>
                <div className="flex items-center">
                  {getRarityStars(errorCoin.rarity_multiplier)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="font-medium mb-1">{errorCoin.error_description}</h3>
                {errorCoin.static_coins_db && (
                  <p className="text-sm text-muted-foreground">
                    Base coin: {errorCoin.static_coins_db.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Rarity:</span>
                  <span className="ml-1">{errorCoin.rarity_multiplier}x</span>
                </div>
                <div>
                  <span className="font-medium">Premium:</span>
                  <span className="ml-1 text-green-600">+{errorCoin.value_premium_percent}%</span>
                </div>
              </div>

              {errorCoin.identification_markers && errorCoin.identification_markers.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Markers:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {errorCoin.identification_markers.slice(0, 3).map((marker, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {marker}
                      </Badge>
                    ))}
                    {errorCoin.identification_markers.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{errorCoin.identification_markers.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Migrate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredErrorCoins?.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="mb-2">No Error Coins Found</CardTitle>
            <CardDescription className="mb-4">
              {searchFilter || typeFilter !== 'all' 
                ? 'No error coins match your current filters'
                : 'Add error coin types to help the AI identify valuable errors'
              }
            </CardDescription>
            {!searchFilter && typeFilter === 'all' && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Error Type
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminErrorLegacyManager;
