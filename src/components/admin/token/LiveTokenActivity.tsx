
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, RefreshCw, Eye, Download } from 'lucide-react';
import { useAdminTokenActivity } from '@/hooks/useAdminTokenData';
import { supabase } from '@/integrations/supabase/client';

export const LiveTokenActivity = () => {
  const { data: activities = [], refetch } = useAdminTokenActivity();
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!isLive) return;

    const channel = supabase
      .channel('token-activity-live')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'token_activity'
        },
        () => refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLive, refetch]);

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'bg-green-100 text-green-800';
      case 'lock': return 'bg-orange-100 text-orange-800';
      case 'unlock': return 'bg-blue-100 text-blue-800';
      case 'referral': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'purchase': return '💰';
      case 'lock': return '🔒';
      case 'unlock': return '🔓';
      case 'referral': return '👥';
      default: return '📊';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Live Token Activity
          {isLive && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={isLive ? "destructive" : "default"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? 'Stop Live' : 'Start Live'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No recent activity found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.slice(0, 10).map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getActivityIcon(activity.activity_type)}</span>
                      <Badge className={getActivityColor(activity.activity_type)}>
                        {activity.activity_type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{activity.profiles?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{activity.profiles?.email || 'N/A'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">
                      {activity.token_amount?.toLocaleString() || '0'} GCAI
                    </span>
                    {activity.usd_value && (
                      <div className="text-sm text-gray-500">
                        ${activity.usd_value.toLocaleString()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={activity.transaction_status === 'completed' ? 'default' : 'secondary'}>
                      {activity.transaction_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(activity.created_at).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
