
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

const SearchAnalyticsCard: React.FC = () => {
  // Mock search analytics data
  const mockSearchAnalytics = [
    {
      id: '1',
      search_query: 'morgan silver dollar 1921',
      results_count: 156,
      search_duration_ms: 245,
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      search_query: 'error coin double strike',
      results_count: 23,
      search_duration_ms: 312,
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      search_query: 'lincoln penny 1943 steel',
      results_count: 78,
      search_duration_ms: 189,
      created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      search_query: 'walking liberty half dollar',
      results_count: 234,
      search_duration_ms: 156,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '5',
      search_query: 'indian head penny',
      results_count: 89,
      search_duration_ms: 298,
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Recent Search Queries
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockSearchAnalytics.map((search) => (
            <div key={search.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium">"{search.search_query}"</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(search.created_at).toLocaleString()}
                  {search.search_duration_ms && ` • ${search.search_duration_ms}ms`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  {search.results_count || 0} results
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchAnalyticsCard;
