
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  BookOpen, 
  DollarSign, 
  TrendingUp,
  Database,
  CheckCircle
} from 'lucide-react';

const AdminErrorStatsOverview = () => {
  const errorStats = {
    totalKnowledgeEntries: 245,
    marketDataEntries: 1320,
    accuracyRate: 94.2,
    newEntriesThisWeek: 18,
    averageMarketValue: 850,
    topErrorCategories: [
      { name: 'Double Die', count: 45, trend: 'up' },
      { name: 'Off Center', count: 38, trend: 'stable' },
      { name: 'Clipped Planchet', count: 29, trend: 'up' },
      { name: 'Die Crack', count: 22, trend: 'down' }
    ]
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Knowledge Base</CardTitle>
          <BookOpen className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{errorStats.totalKnowledgeEntries}</div>
          <p className="text-xs text-muted-foreground">
            +{errorStats.newEntriesThisWeek} this week
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Market Data</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{errorStats.marketDataEntries.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Avg. ${errorStats.averageMarketValue}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
          <CheckCircle className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{errorStats.accuracyRate}%</div>
          <p className="text-xs text-muted-foreground">
            Detection accuracy
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
          <Database className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {errorStats.topErrorCategories.slice(0, 2).map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <span className="text-sm truncate">{category.name}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium">{category.count}</span>
                  <TrendingUp className={`h-3 w-3 ${
                    category.trend === 'up' ? 'text-green-500' : 
                    category.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminErrorStatsOverview;
