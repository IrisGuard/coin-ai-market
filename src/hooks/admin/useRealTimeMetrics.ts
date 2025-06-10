
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealTimeMetrics {
  activeUsers: number;
  onlineDealer: number;
  liveAuctions: number;
  recentActivity: number;
  systemLoad: number;
  responseTime: number;
}

export const useRealTimeMetrics = () => {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    activeUsers: 0,
    onlineDealer: 0,
    liveAuctions: 0,
    recentActivity: 0,
    systemLoad: 45,
    responseTime: 120
  });

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const updateMetrics = async () => {
      try {
        // Get active users (profiles updated in last 15 minutes)
        const { data: activeProfiles } = await supabase
          .from('profiles')
          .select('id, role')
          .gte('updated_at', new Date(Date.now() - 15 * 60 * 1000).toISOString());

        // Get live auctions
        const { data: auctions } = await supabase
          .from('coins')
          .select('id')
          .eq('is_auction', true)
          .gte('auction_end', new Date().toISOString());

        // Get recent activity (last hour)
        const { data: recentCoins } = await supabase
          .from('coins')
          .select('id')
          .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

        const activeUsers = activeProfiles?.length || 0;
        const onlineDealer = activeProfiles?.filter(p => p.role === 'dealer').length || 0;
        const liveAuctions = auctions?.length || 0;
        const recentActivity = recentCoins?.length || 0;

        // Simulate system metrics
        const systemLoad = Math.random() * 30 + 40; // 40-70%
        const responseTime = Math.random() * 100 + 80; // 80-180ms

        setMetrics({
          activeUsers,
          onlineDealer,
          liveAuctions,
          recentActivity,
          systemLoad,
          responseTime
        });

        setIsConnected(true);
      } catch (error) {
        console.error('Failed to update real-time metrics:', error);
        setIsConnected(false);
      }
    };

    // Initial load
    updateMetrics();

    // Update every 30 seconds
    const interval = setInterval(updateMetrics, 30000);

    return () => clearInterval(interval);
  }, []);

  return { metrics, isConnected };
};
