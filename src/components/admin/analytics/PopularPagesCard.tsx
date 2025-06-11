
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

const PopularPagesCard: React.FC = () => {
  // Mock page views data
  const mockPageViews = [
    {
      id: '1',
      page_path: '/coins/search',
      view_count: 15742,
      last_viewed: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      page_path: '/marketplace',
      view_count: 12894,
      last_viewed: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      page_path: '/coin-recognition',
      view_count: 8765,
      last_viewed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      page_path: '/auctions',
      view_count: 6543,
      last_viewed: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    {
      id: '5',
      page_path: '/coin/morgan-dollar',
      view_count: 4321,
      last_viewed: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    }
  ];

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
          {mockPageViews.map((page) => (
            <div key={page.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{page.page_path}</div>
                <div className="text-sm text-muted-foreground">
                  Last viewed: {new Date(page.last_viewed).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{page.view_count.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">views</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularPagesCard;
