
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const PopularPagesCard = () => {
  const { data: pageViews, isLoading } = useQuery({
    queryKey: ['popular-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('*')
        .order('view_count', { ascending: false })
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
            <TrendingUp className="h-5 w-5" />
            Popular Pages
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
          <TrendingUp className="h-5 w-5" />
          Popular Pages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pageViews?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No page view data available
            </div>
          ) : (
            pageViews?.map((page, index) => (
              <div key={page.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    #{index + 1}
                  </span>
                  <span className="text-sm">{page.page_path}</span>
                </div>
                <span className="text-sm font-medium">{page.view_count} views</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularPagesCard;
