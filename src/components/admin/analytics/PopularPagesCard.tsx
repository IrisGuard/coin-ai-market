
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Eye } from 'lucide-react';

const PopularPagesCard: React.FC = () => {
  const { data: pageViews, isLoading: viewsLoading } = useQuery({
    queryKey: ['page-views'],
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Popular Pages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {viewsLoading ? (
            <div className="text-center py-8">Loading page views...</div>
          ) : pageViews?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No page view data found
            </div>
          ) : (
            pageViews?.map((page) => (
              <div key={page.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{page.page_path}</div>
                  <div className="text-sm text-muted-foreground">
                    Last viewed: {new Date(page.last_viewed).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{page.view_count}</div>
                  <div className="text-xs text-muted-foreground">views</div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularPagesCard;
