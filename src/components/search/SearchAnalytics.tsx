import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Search, BarChart3, Users } from 'lucide-react';
import { getPopularSearches, getSearchTrends } from '@/utils/searchAnalyticsUtils';

interface SearchAnalyticsData {
  totalSearches: number;
  uniqueUsers: number;
  topQueries: Array<{ query: string; count: number }>;
  searchTrends: Array<{ date: string; searches: number }>;
}

// Fix: Add interface for component props
interface SearchAnalyticsProps {
  searchQuery?: string;
  searchResults?: any[];
  searchTime?: number;
}

const SearchAnalytics: React.FC<SearchAnalyticsProps> = ({ 
  searchQuery = '', 
  searchResults = [], 
  searchTime = 0 
}) => {
  const [analyticsData, setAnalyticsData] = useState<SearchAnalyticsData>({
    totalSearches: 0,
    uniqueUsers: 0,
    topQueries: [],
    searchTrends: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7days');

  useEffect(() => {
    generateSearchAnalytics();
  }, [timeRange]);

  const generateSearchAnalytics = async () => {
    setIsLoading(true);
    try {
      const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 1;
      
      const [popularSearches, trends] = await Promise.all([
        getPopularSearches(10, days),
        getSearchTrends(days)
      ]);

      setAnalyticsData({
        totalSearches: trends.reduce((sum, day) => sum + day.searches, 0),
        uniqueUsers: Math.floor(trends.length * 0.7), // Estimate unique users
        topQueries: popularSearches.map((item: any) => ({
          query: item.search_query,
          count: item.count || 1
        })),
        searchTrends: trends
      });
    } catch (error) {
      console.error('Error generating search analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Search Analytics
            <Badge variant="outline">Live Data</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={timeRange === '1day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('1day')}
            >
              24h
            </Button>
            <Button
              variant={timeRange === '7days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('7days')}
            >
              7 days
            </Button>
            <Button
              variant={timeRange === '30days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('30days')}
            >
              30 days
            </Button>
          </div>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Search className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">{analyticsData.totalSearches}</p>
                  <p className="text-sm text-muted-foreground">Total Searches</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold">{analyticsData.uniqueUsers}</p>
                  <p className="text-sm text-muted-foreground">Unique Users</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold">{analyticsData.topQueries.length}</p>
                  <p className="text-sm text-muted-foreground">Unique Queries</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <BarChart3 className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                  <p className="text-2xl font-bold">
                    {analyticsData.totalSearches > 0 ? Math.round(analyticsData.totalSearches / Math.max(analyticsData.searchTrends.length, 1)) : 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Per Day</p>
                </div>
              </div>

              {/* Top Queries */}
              <div>
                <h4 className="font-medium mb-3">Popular Search Queries</h4>
                <div className="space-y-2">
                  {analyticsData.topQueries.slice(0, 5).map((query, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{query.query}</span>
                      <Badge variant="outline">{query.count} searches</Badge>
                    </div>
                  ))}
                  
                  {analyticsData.topQueries.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No search data available for the selected time range
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchAnalytics;
