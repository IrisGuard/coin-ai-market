
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  RefreshCw
} from 'lucide-react';

const ErrorMarketDataManager = () => {
  const [selectedGrade, setSelectedGrade] = useState('all');

  // Mock market data
  const marketData = [
    {
      id: '1',
      knowledge_base_id: '1',
      error_name: 'Double Die Obverse',
      grade: 'MS-65',
      market_value_low: 850,
      market_value_avg: 1200,
      market_value_high: 1800,
      last_sale_price: 1150,
      premium_percentage: 340,
      market_trend: 'up',
      data_confidence: 0.92,
      updated_at: '2024-01-15'
    },
    {
      id: '2',
      knowledge_base_id: '1',
      error_name: 'Double Die Obverse',
      grade: 'AU-50',
      market_value_low: 450,
      market_value_avg: 650,
      market_value_high: 900,
      last_sale_price: 625,
      premium_percentage: 280,
      market_trend: 'up',
      data_confidence: 0.88,
      updated_at: '2024-01-14'
    },
    {
      id: '3',
      knowledge_base_id: '2',
      error_name: 'Off-Center Strike',
      grade: 'MS-63',
      market_value_low: 125,
      market_value_avg: 200,
      market_value_high: 350,
      last_sale_price: 185,
      premium_percentage: 150,
      market_trend: 'stable',
      data_confidence: 0.75,
      updated_at: '2024-01-12'
    }
  ];

  const grades = ['all', 'MS-65', 'MS-63', 'AU-50', 'XF-45', 'VF-20'];

  const filteredData = marketData.filter(entry => 
    selectedGrade === 'all' || entry.grade === selectedGrade
  );

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800';
    if (confidence >= 0.8) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Market Data Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketData.length}</div>
            <p className="text-xs text-muted-foreground">Market data points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Premium</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">256%</div>
            <p className="text-xs text-muted-foreground">Over face value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Confidence</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Average accuracy</p>
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

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Market Data Management
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
          </div>
        </CardContent>
      </Card>

      {/* Market Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Market Data Entries ({filteredData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Error Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Low Value</TableHead>
                <TableHead>Avg Value</TableHead>
                <TableHead>High Value</TableHead>
                <TableHead>Last Sale</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.error_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{entry.grade}</Badge>
                  </TableCell>
                  <TableCell>${entry.market_value_low}</TableCell>
                  <TableCell className="font-medium">${entry.market_value_avg}</TableCell>
                  <TableCell>${entry.market_value_high}</TableCell>
                  <TableCell>${entry.last_sale_price}</TableCell>
                  <TableCell>
                    <span className="font-medium text-green-600">
                      +{entry.premium_percentage}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(entry.market_trend)}
                      <span className={`text-sm capitalize ${getTrendColor(entry.market_trend)}`}>
                        {entry.market_trend}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getConfidenceColor(entry.data_confidence)}>
                      {Math.round(entry.data_confidence * 100)}%
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
