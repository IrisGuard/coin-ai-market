
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  DollarSign, 
  Plus, 
  Search, 
  TrendingUp, 
  TrendingDown,
  TrendingUpIcon,
  BarChart3,
  Calendar,
  Percent
} from 'lucide-react';
import { useErrorCoinsMarketData, useErrorCoinsKnowledge, useAddErrorMarketData } from '@/hooks/useErrorCoinsKnowledge';

const ErrorMarketDataManager = () => {
  const { data: marketData } = useErrorCoinsMarketData();
  const { data: knowledge } = useErrorCoinsKnowledge();
  const addMarketData = useAddErrorMarketData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [trendFilter, setTrendFilter] = useState('all');

  const [newMarketData, setNewMarketData] = useState({
    knowledge_base_id: '',
    base_coin_id: '',
    grade: 'MS-60',
    market_value_low: 0,
    market_value_high: 0,
    market_value_avg: 0,
    premium_percentage: 0,
    last_sale_price: 0,
    market_trend: 'stable',
    source_references: [],
    data_confidence: 0.8
  });

  const gradeOptions = [
    'Poor-1', 'Fair-2', 'About Good-3', 'Good-4', 'Very Good-8', 'Fine-12',
    'Very Fine-20', 'Extremely Fine-40', 'About Uncirculated-50', 'About Uncirculated-53',
    'About Uncirculated-55', 'About Uncirculated-58', 'MS-60', 'MS-61', 'MS-62',
    'MS-63', 'MS-64', 'MS-65', 'MS-66', 'MS-67', 'MS-68', 'MS-69', 'MS-70'
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <TrendingUpIcon className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising': return 'bg-green-100 text-green-800';
      case 'declining': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const filteredMarketData = marketData?.filter(item => {
    const knowledgeItem = item.error_coins_knowledge;
    const matchesSearch = knowledgeItem?.error_name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
                         item.grade.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesTrend = trendFilter === 'all' || item.market_trend === trendFilter;
    return matchesSearch && matchesTrend;
  });

  const handleAddMarketData = () => {
    addMarketData.mutate(newMarketData);
    setIsAddDialogOpen(false);
    setNewMarketData({
      knowledge_base_id: '',
      base_coin_id: '',
      grade: 'MS-60',
      market_value_low: 0,
      market_value_high: 0,
      market_value_avg: 0,
      premium_percentage: 0,
      last_sale_price: 0,
      market_trend: 'stable',
      source_references: [],
      data_confidence: 0.8
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Error Coins Market Data
          </h3>
          <p className="text-sm text-muted-foreground">
            Market values, trends, and pricing data for error coins
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Market Data
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Market Data Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="knowledge_base">Error Knowledge Entry</Label>
                  <Select value={newMarketData.knowledge_base_id} onValueChange={(value) => setNewMarketData({...newMarketData, knowledge_base_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select error type" />
                    </SelectTrigger>
                    <SelectContent>
                      {knowledge?.map(item => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.error_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="grade">Grade</Label>
                  <Select value={newMarketData.grade} onValueChange={(value) => setNewMarketData({...newMarketData, grade: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeOptions.map(grade => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="market_value_low">Low Value ($)</Label>
                  <Input
                    id="market_value_low"
                    type="number"
                    value={newMarketData.market_value_low}
                    onChange={(e) => setNewMarketData({...newMarketData, market_value_low: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="market_value_avg">Average Value ($)</Label>
                  <Input
                    id="market_value_avg"
                    type="number"
                    value={newMarketData.market_value_avg}
                    onChange={(e) => setNewMarketData({...newMarketData, market_value_avg: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="market_value_high">High Value ($)</Label>
                  <Input
                    id="market_value_high"
                    type="number"
                    value={newMarketData.market_value_high}
                    onChange={(e) => setNewMarketData({...newMarketData, market_value_high: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="premium_percentage">Premium %</Label>
                  <Input
                    id="premium_percentage"
                    type="number"
                    value={newMarketData.premium_percentage}
                    onChange={(e) => setNewMarketData({...newMarketData, premium_percentage: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="last_sale_price">Last Sale Price ($)</Label>
                  <Input
                    id="last_sale_price"
                    type="number"
                    value={newMarketData.last_sale_price}
                    onChange={(e) => setNewMarketData({...newMarketData, last_sale_price: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="market_trend">Market Trend</Label>
                  <Select value={newMarketData.market_trend} onValueChange={(value) => setNewMarketData({...newMarketData, market_trend: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rising">Rising</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="declining">Declining</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="data_confidence">Data Confidence</Label>
                  <Select value={newMarketData.data_confidence.toString()} onValueChange={(value) => setNewMarketData({...newMarketData, data_confidence: parseFloat(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.9">90% - Very High</SelectItem>
                      <SelectItem value="0.8">80% - High</SelectItem>
                      <SelectItem value="0.7">70% - Good</SelectItem>
                      <SelectItem value="0.6">60% - Moderate</SelectItem>
                      <SelectItem value="0.5">50% - Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddMarketData} className="flex-1">
                  Add Market Data
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
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
              placeholder="Search market data..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={trendFilter} onValueChange={setTrendFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by trend" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Trends</SelectItem>
            <SelectItem value="rising">Rising</SelectItem>
            <SelectItem value="stable">Stable</SelectItem>
            <SelectItem value="declining">Declining</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Market Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMarketData?.map((item) => (
          <Card key={item.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">
                    {item.error_coins_knowledge?.error_name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{item.grade}</Badge>
                    <Badge className={getTrendColor(item.market_trend)}>
                      {getTrendIcon(item.market_trend)}
                      {item.market_trend}
                    </Badge>
                  </div>
                </div>
                <Badge className={getConfidenceColor(item.data_confidence)}>
                  {Math.round(item.data_confidence * 100)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price Range */}
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm font-medium mb-2">Market Value Range</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-muted-foreground">Low</div>
                    <div className="font-medium">{formatCurrency(item.market_value_low || 0)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">Avg</div>
                    <div className="font-medium text-lg">{formatCurrency(item.market_value_avg || 0)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">High</div>
                    <div className="font-medium">{formatCurrency(item.market_value_high || 0)}</div>
                  </div>
                </div>
              </div>

              {/* Market Stats */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {item.last_sale_price && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground text-xs">Last Sale</div>
                      <div className="font-medium">{formatCurrency(item.last_sale_price)}</div>
                    </div>
                  </div>
                )}
                {item.premium_percentage && (
                  <div className="flex items-center gap-2">
                    <Percent className="h-3 w-3 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground text-xs">Premium</div>
                      <div className="font-medium text-green-600">+{item.premium_percentage}%</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Base Coin Info */}
              {item.static_coins_db && (
                <div className="text-xs text-muted-foreground">
                  Base: {item.static_coins_db.name}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  History
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMarketData?.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Market Data Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchFilter || trendFilter !== 'all' 
                ? 'No market data matches your current filters'
                : 'Add market data to track pricing trends for error coins'
              }
            </p>
            {!searchFilter && trendFilter === 'all' && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Market Data
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ErrorMarketDataManager;
