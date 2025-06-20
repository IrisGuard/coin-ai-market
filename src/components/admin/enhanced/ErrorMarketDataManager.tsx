
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Upload,
  Download,
  RefreshCw,
  Globe,
  BarChart3,
  Percent,
  Target
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ErrorMarketDataManager = () => {
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const { data: marketData, isLoading } = useQuery({
    queryKey: ['error-market-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_coins_market_data')
        .select(`
          *,
          error_coins_knowledge!knowledge_base_id (
            error_name,
            error_type
          )
        `);
      
      if (error) {
        console.error('Error fetching market data:', error);
        return [];
      }
      
      return data || [];
    }
  });

  const grades = ['all', 'MS-70', 'MS-69', 'MS-68', 'MS-67', 'MS-66', 'MS-65', 'MS-64', 'MS-63', 'AU-58', 'AU-55', 'AU-50'];
  const regions = ['all', 'north_america', 'europe', 'asia', 'australia'];

  const filteredData = marketData?.filter(entry => {
    const matchesGrade = selectedGrade === 'all' || entry.grade === selectedGrade;
    const matchesRegion = selectedRegion === 'all' || 
      (entry.regional_pricing && Object.keys(entry.regional_pricing).includes(selectedRegion));
    return matchesGrade && matchesRegion;
  }) || [];

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'bg-gray-100 text-gray-800';
    if (confidence >= 0.9) return 'bg-green-100 text-green-800';
    if (confidence >= 0.8) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Calculate enhanced statistics
  const avgConfidence = marketData ? 
    marketData.reduce((sum, entry) => sum + (entry.data_confidence || 0), 0) / marketData.length : 0;
  
  const avgPremium = marketData ? 
    marketData.reduce((sum, entry) => sum + (entry.premium_percentage || 0), 0) / marketData.length : 0;

  const regionsCount = marketData ? 
    new Set(marketData.flatMap(entry => 
      entry.regional_pricing ? Object.keys(entry.regional_pricing) : []
    )).size : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-coin-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Market Data Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Market data points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Premium</CardTitle>
            <Percent className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgPremium)}%</div>
            <p className="text-xs text-muted-foreground">Over face value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Confidence</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgConfidence * 100)}%</div>
            <p className="text-xs text-muted-foreground">Average accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regions</CardTitle>
            <Globe className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regionsCount}</div>
            <p className="text-xs text-muted-foreground">Geographic markets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h</div>
            <p className="text-xs text-muted-foreground">ago</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Enhanced Market Data Management
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Grade:</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>
                    {grade === 'all' ? 'All Grades' : grade}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Region:</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region === 'all' ? 'All Regions' : region.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Market Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Market Data Entries ({filteredData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Error Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Value Range</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Impact Factor</TableHead>
                <TableHead>A/R Ratio</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    {entry.error_coins_knowledge?.error_name || 'Unknown Error'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{entry.grade}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">${entry.market_value_avg || 0}</div>
                      <div className="text-muted-foreground">
                        ${entry.market_value_low || 0} - ${entry.market_value_high || 0}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-green-600">
                      +{entry.premium_percentage || 0}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(entry.market_trend)}
                      <span className={`text-sm capitalize ${getTrendColor(entry.market_trend)}`}>
                        {entry.market_trend || 'stable'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getConfidenceColor(entry.data_confidence)}>
                      {Math.round((entry.data_confidence || 0) * 100)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {entry.grade_impact_factor || 1.0}x
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-blue-600">
                      {entry.auction_vs_retail_ratio || 1.0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.updated_at).toLocaleDateString()}
                    </span>
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

export default ErrorMarketDataManager;
