import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Monitor, 
  Users, 
  Eye, 
  Activity, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Zap
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DealerActivity {
  id: string;
  dealer_id: string;
  dealer_name: string;
  activity_type: 'upload' | 'analysis' | 'listing' | 'sale';
  activity_data: any;
  timestamp: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  confidence_score?: number;
}

interface AdminConnectionProps {
  onDealerActivityUpdate?: (activity: DealerActivity) => void;
}

const RealTimeAdminConnection: React.FC<AdminConnectionProps> = ({ 
  onDealerActivityUpdate 
}) => {
  const [connectedDealers, setConnectedDealers] = useState<string[]>([]);
  const [recentActivities, setRecentActivities] = useState<DealerActivity[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Query for live dealer activities
  const { data: liveActivities, refetch } = useQuery({
    queryKey: ['admin-live-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_activity_logs')
        .select(`
          *,
          stores!inner(
            name,
            user_id,
            profiles!inner(name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    refetchInterval: isMonitoring ? 3000 : false,
    enabled: isMonitoring
  });

  // Real-time subscription for dealer activities
  useEffect(() => {
    if (!isMonitoring) return;

    const channel = supabase
      .channel('admin-dealer-activities')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'store_activity_logs'
        },
        (payload) => {
          console.log('🔴 LIVE: New dealer activity:', payload.new);
          
          const newActivity: DealerActivity = {
            id: payload.new.id,
            dealer_id: payload.new.store_id,
            dealer_name: 'Processing...',
            activity_type: payload.new.activity_type,
            activity_data: payload.new.activity_data,
            timestamp: payload.new.created_at,
            status: 'completed'
          };

          setRecentActivities(prev => [newActivity, ...prev.slice(0, 19)]);
          
          if (onDealerActivityUpdate) {
            onDealerActivityUpdate(newActivity);
          }

          toast.success(`🔴 Live Activity: ${payload.new.activity_type} by dealer`);
          refetch();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'coins'
        },
        (payload) => {
          console.log('🟡 LIVE: New coin upload:', payload.new);
          toast.info(`🟡 New Coin Listed: ${payload.new.name}`);
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isMonitoring, onDealerActivityUpdate, refetch]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'analysis':
        return <Eye className="h-4 w-4 text-purple-500" />;
      case 'listing':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'sale':
        return <Activity className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" />
              Real-Time Dealer Connection
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isMonitoring ? "default" : "secondary"}>
                {isMonitoring ? "🟢 Live" : "⚫ Paused"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMonitoring(!isMonitoring)}
              >
                {isMonitoring ? "Pause" : "Resume"} Monitoring
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">{connectedDealers.length}</p>
              <p className="text-sm text-blue-600">Active Dealers</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Activity className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">{liveActivities?.length || 0}</p>
              <p className="text-sm text-green-600">Recent Activities</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Eye className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-purple-600">Live</p>
              <p className="text-sm text-purple-600">AI Monitoring</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Activities Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-500" />
            Live Dealer Activities
            <Badge variant="outline" className="ml-auto">
              Updates every 3s
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {liveActivities?.slice(0, 10).map((activity, index) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                {getActivityIcon(activity.activity_type)}
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">
                      {Array.isArray(activity.stores?.profiles) ? activity.stores.profiles[0]?.name || 'Dealer' : 'Dealer'}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {activity.activity_type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Store: {activity.stores?.name || 'Unknown'}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {getTimeAgo(activity.created_at)}
                  </p>
                  {activity.activity_data && typeof activity.activity_data === 'object' && 'confidence' in activity.activity_data && (
                    <Badge variant="secondary" className="text-xs">
                      {Math.round((activity.activity_data as any).confidence * 100)}%
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            
            {(!liveActivities || liveActivities.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent dealer activities</p>
                <p className="text-sm">Activities will appear here in real-time</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Admin Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="justify-start">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Pending Listings
            </Button>
            
            <Button variant="outline" size="sm" className="justify-start">
              <Eye className="h-4 w-4 mr-2" />
              Review AI Predictions
            </Button>
            
            <Button variant="outline" size="sm" className="justify-start">
              <Users className="h-4 w-4 mr-2" />
              Manage Dealer Access
            </Button>
            
            <Button variant="outline" size="sm" className="justify-start">
              <Activity className="h-4 w-4 mr-2" />
              System Performance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeAdminConnection;