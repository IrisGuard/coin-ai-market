
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search } from 'lucide-react';

const SearchAnalyticsCard: React.FC = () => {
  const { data: searchAnalytics, isLoading: searchLoading } = useQuery({
    queryKey: ['search-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('search_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
  });

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
          {searchLoading ? (
            <div className="text-center py-8">Loading search analytics...</div>
          ) : searchAnalytics?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No search data found
            </div>
          ) : (
            searchAnalytics?.map((search) => (
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchAnalyticsCard;
