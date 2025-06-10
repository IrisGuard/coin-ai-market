
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Settings,
  RefreshCw,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const EnhancedAdminPriceAggregationTab = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [realTimeData, setRealTimeData] = useState(false);

  // Real-time data simulation
  useEffect(() => {
    if (realTimeData) {
      const interval = setInterval(() => {
        // Simulate real-time updates
        console.log('Real-time price data updated');
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [realTimeData]);

  const aggregationStats = {
    totalSources: 18,
    activeSources: 15,
    lastUpdate: new Date().toLocaleString(),
    averageConfidence: 87.2,
    pricesAggregated: 1847,
    errorRate: 1.8,
    processingSpeed: 2.3,
    dataFreshness: 94.5
  };

  const recentAggregations = [
    {
      id: '1',
      coinName: '1909-S VDB Lincoln Cent',
      grade: 'MS-65',
      sources: 6,
      avgPrice: 1350.00,
      priceRange: { low: 1200, high: 1500 },
      confidence: 91,
      lastUpdate: '15 minutes ago',
      trend: 'up',
      changePercent: 2.4
    },
    {
      id: '2',
      coinName: '1916-D Mercury Dime',
      grade: 'MS-64',
      sources: 8,
      avgPrice: 3350.00,
      priceRange: { low: 3000, high: 3700 },
      confidence: 94,
      lastUpdate: '22 minutes ago',
      trend: 'stable',
      changePercent: 0.8
    },
    {
      id: '3',
      coinName: '1893-S Morgan Dollar',
      grade: 'AU-55',
      sources: 7,
      avgPrice: 16200.00,
      priceRange: { low: 15000, high: 17500 },
      confidence: 88,
      lastUpdate: '35 minutes ago',
      trend: 'down',
      changePercent: -1.2
    }
  ];

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 3000);
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (confidence >= 80) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Review</Badge>;
  };

  const getTrendIcon = (trend: string, changePercent: number) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <BarChart3 className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Enhanced Price Aggregation System</h3>
          <p className="text-sm text-muted-foreground">
            Real-time price intelligence from {aggregationStats.totalSources} premium data sources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={realTimeData ? "default" : "outline"} 
            size="sm" 
            onClick={() => setRealTimeData(!realTimeData)}
          >
            <Activity className="w-4 h-4 mr-2" />
            {realTimeData ? 'Live' : 'Static'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Sources</p>
                <p className="text-lg font-bold">{aggregationStats.activeSources}/{aggregationStats.totalSources}</p>
                <Progress value={(aggregationStats.activeSources / aggregationStats.totalSources) * 100} className="h-1 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Aggregated</p>
                <p className="text-lg font-bold">{aggregationStats.pricesAggregated.toLocaleString()}</p>
                <p className="text-xs text-green-600">+127 today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Confidence</p>
                <p className="text-lg font-bold">{aggregationStats.averageConfidence}%</p>
                <Progress value={aggregationStats.averageConfidence} className="h-1 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-xs text-gray-600">Error Rate</p>
                <p className="text-lg font-bold">{aggregationStats.errorRate}%</p>
                <p className="text-xs text-orange-600">-0.3% today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-600" />
              <div>
                <p className="text-xs text-gray-600">Speed</p>
                <p className="text-lg font-bold">{aggregationStats.processingSpeed}s</p>
                <p className="text-xs text-cyan-600">avg response</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-xs text-gray-600">Freshness</p>
                <p className="text-lg font-bold">{aggregationStats.dataFreshness}%</p>
                <Progress value={aggregationStats.dataFreshness} className="h-1 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Last Update</p>
                <p className="text-xs font-medium">{aggregationStats.lastUpdate}</p>
                {realTimeData && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mt-1"></div>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-xs text-gray-600">Status</p>
                <p className="text-xs font-medium text-emerald-600">Optimal</p>
                <div className="flex gap-1 mt-1">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Live Overview</TabsTrigger>
          <TabsTrigger value="aggregations">Recent Aggregations</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          <TabsTrigger value="management">Source Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Aggregation Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Active Data Sources</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'PCGS Price Guide', status: 'active', reliability: 98 },
                      { name: 'NGC Price Guide', status: 'active', reliability: 96 },
                      { name: 'Heritage Auctions', status: 'active', reliability: 94 },
                      { name: 'eBay Sold Listings', status: 'limited', reliability: 87 },
                      { name: 'Stack\'s Bowers', status: 'active', reliability: 95 }
                    ].map((source) => (
                      <div key={source.name} className="flex justify-between items-center p-2 border rounded">
                        <span className="text-sm">{source.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{source.reliability}%</span>
                          <Badge variant={source.status === 'active' ? 'default' : 'secondary'}>
                            {source.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Aggregation Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Processing Speed</span>
                      <div className="flex items-center gap-2">
                        <Progress value={85} className="w-20 h-2" />
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Accuracy</span>
                      <div className="flex items-center gap-2">
                        <Progress value={94} className="w-20 h-2" />
                        <span className="text-sm font-medium">94%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Coverage Rate</span>
                      <div className="flex items-center gap-2">
                        <Progress value={91} className="w-20 h-2" />
                        <span className="text-sm font-medium">91%</span>
                      </div>
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
              <CardTitle>Latest Price Aggregations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coin</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Sources</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Range</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Trend</TableHead>
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
                      <TableCell>
                        <Badge variant="secondary">{item.sources} sources</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${item.avgPrice.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        ${item.priceRange.low.toLocaleString()} - ${item.priceRange.high.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getConfidenceBadge(item.confidence)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(item.trend, item.changePercent)}
                          <span className={`text-sm ${
                            item.trend === 'up' ? 'text-green-600' : 
                            item.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {item.changePercent > 0 ? '+' : ''}{item.changePercent}%
                          </span>
                        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Source Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'PCGS Price Guide', performance: 98, uptime: '99.9%' },
                    { name: 'NGC Price Guide', performance: 96, uptime: '99.7%' },
                    { name: 'Heritage Auctions', performance: 94, uptime: '98.5%' },
                    { name: 'eBay Sold Listings', performance: 87, uptime: '97.2%' }
                  ].map((source) => (
                    <div key={source.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{source.name}</span>
                        <span>{source.performance}% (Uptime: {source.uptime})</span>
                      </div>
                      <Progress value={source.performance} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">A+</div>
                    <p className="text-sm text-gray-600">Overall Grade</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">High Confidence (90%+)</span>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Medium Confidence (80-90%)</span>
                      <span className="text-sm font-medium">23%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Low Confidence (&lt;80%)</span>
                      <span className="text-sm font-medium">5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Source Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Active Sources Configuration</h4>
                  <Button size="sm">Add Source</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Premium APIs', count: 8, status: 'active' },
                    { name: 'Web Scrapers', count: 7, status: 'active' },
                    { name: 'Manual Feeds', count: 3, status: 'limited' }
                  ].map((category) => (
                    <Card key={category.name}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-medium">{category.name}</h5>
                            <p className="text-sm text-gray-600">{category.count} sources</p>
                          </div>
                          <Badge variant={category.status === 'active' ? 'default' : 'secondary'}>
                            {category.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAdminPriceAggregationTab;
