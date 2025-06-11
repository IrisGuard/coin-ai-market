
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SearchAnalyticsCard = () => {
  const { data: searchData, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin h-8 w-8 border-b-2 border-coin-purple"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {searchData?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No search data available
            </div>
          ) : (
            searchData?.map((search) => (
              <div key={search.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{search.search_query}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(search.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {search.results_count || 0} results
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
