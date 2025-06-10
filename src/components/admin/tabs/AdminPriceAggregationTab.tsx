
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Settings,
  RefreshCw,
  Database,
  Activity
} from 'lucide-react';

const AdminPriceAggregationTab = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data for price aggregation
  const aggregationStats = {
    totalSources: 15,
    activeSources: 12,
    lastUpdate: new Date().toLocaleString(),
    averageConfidence: 85.5,
    pricesAggregated: 1247,
    errorRate: 2.3
  };

  const recentAggregations = [
    {
      id: '1',
      coinName: '1909-S VDB Lincoln Cent',
      grade: 'MS-65',
      sources: 5,
      avgPrice: 1250.00,
      priceRange: { low: 1100, high: 1400 },
      confidence: 88,
      lastUpdate: '2 hours ago'
    },
    {
      id: '2',
      coinName: '1916-D Mercury Dime',
      grade: 'MS-64',
      sources: 7,
      avgPrice: 3200.00,
      priceRange: { low: 2800, high: 3600 },
      confidence: 92,
      lastUpdate: '3 hours ago'
    },
    {
      id: '3',
      coinName: '1893-S Morgan Dollar',
      grade: 'AU-55',
      sources: 6,
      avgPrice: 15500.00,
      priceRange: { low: 14000, high: 17000 },
      confidence: 85,
      lastUpdate: '5 hours ago'
    }
  ];

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) return <Badge className="bg-green-100 text-green-800">High</Badge>;
    if (confidence >= 80) return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
    return <Badge className="bg-red-100 text-red-800">Low</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Price Aggregation System</h3>
          <p className="text-sm text-muted-foreground">
            Real-time price aggregation from multiple data sources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Sources</p>
                <p className="text-xl font-bold">{aggregationStats.totalSources}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Sources</p>
                <p className="text-xl font-bold">{aggregationStats.activeSources}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Prices Aggregated</p>
                <p className="text-xl font-bold">{aggregationStats.pricesAggregated.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Confidence</p>
                <p className="text-xl font-bold">{aggregationStats.averageConfidence}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Error Rate</p>
                <p className="text-xl font-bold">{aggregationStats.errorRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Last Update</p>
                <p className="text-xs font-medium">{aggregationStats.lastUpdate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="aggregations">Recent Aggregations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Aggregation Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Data Sources Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>PCGS Price Guide</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>NGC Price Guide</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Heritage Auctions</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>eBay Sold Listings</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Limited</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Aggregation Rules</h4>
                    <div className="space-y-2 text-sm">
                      <p>• Minimum 3 sources required</p>
                      <p>• Outliers removed (more than 2 standard deviations)</p>
                      <p>• Time-weighted averaging (recent data prioritized)</p>
                      <p>• Grade-specific aggregation</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aggregations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Price Aggregations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coin</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Sources</TableHead>
                    <TableHead>Average Price</TableHead>
                    <TableHead>Price Range</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAggregations.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.coinName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.grade}</Badge>
                      </TableCell>
                      <TableCell>{item.sources}</TableCell>
                      <TableCell className="font-medium">
                        ${item.avgPrice.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        ${item.priceRange.low.toLocaleString()} - ${item.priceRange.high.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getConfidenceBadge(item.confidence)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {item.lastUpdate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Aggregation Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Source Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">PCGS Price Guide</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                        <span className="text-sm">95%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">NGC Price Guide</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                        <span className="text-sm">92%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Heritage Auctions</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                        <span className="text-sm">88%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Aggregation Quality</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">High Confidence (90%+)</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Medium Confidence (80-90%)</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Low Confidence (less than 80%)</span>
                      <span className="text-sm font-medium">7%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPriceAggregationTab;
