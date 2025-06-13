
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Search, TrendingUp, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const QuickActions = () => {
  const { data: quickStats, isLoading } = useQuery({
    queryKey: ['quick-action-stats'],
    queryFn: async () => {
      const [
        { count: newListings },
        { count: endingSoonAuctions },
        { count: totalCategories }
      ] = await Promise.all([
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .eq('is_auction', true)
          .lte('auction_end', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
          .gt('auction_end', new Date().toISOString()),
        supabase
          .from('coins')
          .select('category', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      return {
        newListings: newListings || 0,
        endingSoonAuctions: endingSoonAuctions || 0,
        hotCategories: Math.floor((totalCategories || 0) / 10)
      };
    }
  });

  const actions = [
    {
      icon: Camera,
      title: 'AI Coin Recognition',
      description: 'Upload a photo to identify your coin',
      action: 'Scan Now',
      color: 'bg-blue-500',
      stats: 'Real-time analysis'
    },
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Find specific coins with filters',
      action: 'Search',
      color: 'bg-green-500',
      stats: `${quickStats?.newListings || 0} new today`
    },
    {
      icon: TrendingUp,
      title: 'Market Trends',
      description: 'View trending categories and prices',
      action: 'View Trends',
      color: 'bg-purple-500',
      stats: `${quickStats?.hotCategories || 0} hot categories`
    },
    {
      icon: AlertCircle,
      title: 'Auction Alerts',
      description: 'Get notified about ending auctions',
      action: 'Set Alerts',
      color: 'bg-orange-500',
      stats: `${quickStats?.endingSoonAuctions || 0} ending soon`
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{action.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{action.description}</p>
                <Badge variant="outline" className="text-xs mb-3 w-full justify-center">
                  {isLoading ? 'Loading...' : action.stats}
                </Badge>
                <Button size="sm" className="w-full">
                  {action.action}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
