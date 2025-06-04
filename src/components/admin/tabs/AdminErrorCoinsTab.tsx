import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useErrorCoins } from '@/hooks/useEnhancedDataSources';
import { 
  AlertTriangle, 
  Plus, 
  Star, 
  TrendingUp,
  Eye,
  Search,
  BookOpen,
  DollarSign,
  Database,
  Brain
} from 'lucide-react';
import ErrorKnowledgeManager from '../enhanced/ErrorKnowledgeManager';
import ErrorMarketDataManager from '../enhanced/ErrorMarketDataManager';

const AdminErrorCoinsTab = () => {
  const { data: errorCoins } = useErrorCoins();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

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
          <h2 className="text-2xl font-bold">Enhanced Error Coins System</h2>
          <p className="text-muted-foreground">
            Comprehensive error coin knowledge base and market intelligence
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Brain className="h-4 w-4 mr-2" />
            AI Training Status
          </Button>
          <Button variant="outline" size="sm">
            <Database className="h-4 w-4 mr-2" />
            Import Sources
          </Button>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="market" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Market Data
          </TabsTrigger>
          <TabsTrigger value="legacy" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Legacy Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Error Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">+12 this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Market Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">489</div>
                <p className="text-xs text-muted-foreground">+23 this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">+5% improvement</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Source Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4/6</div>
                <p className="text-xs text-muted-foreground">Sources connected</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('knowledge')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Knowledge Base
                </CardTitle>
                <CardDescription>
                  Manage technical identification guides and error classifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Knowledge Entries →
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('market')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Market Intelligence
                </CardTitle>
                <CardDescription>
                  Track pricing trends and market values for error coins
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Market Data →
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI Training
                </CardTitle>
                <CardDescription>
                  Monitor and improve AI recognition accuracy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Training Dashboard →
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="knowledge">
          <ErrorKnowledgeManager />
        </TabsContent>

        <TabsContent value="market">
          <ErrorMarketDataManager />
        </TabsContent>

        <TabsContent value="legacy" className="space-y-6">
          {/* Legacy Error Coins Management */}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminErrorCoinsTab;
