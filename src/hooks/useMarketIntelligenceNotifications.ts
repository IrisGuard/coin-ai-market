
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface MarketAlert {
  id: string;
  type: 'price_spike' | 'trend_change' | 'volume_surge' | 'new_opportunity';
  title: string;
  message: string;
  coin_id?: string;
  metadata: any;
  created_at: string;
  is_read: boolean;
}

export const useMarketIntelligenceNotifications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get market intelligence alerts
  const { data: alerts, isLoading } = useQuery({
    queryKey: ['market-intelligence-alerts'],
    queryFn: async (): Promise<MarketAlert[]> => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('type', 'market_intelligence')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      return data?.map(notification => ({
        id: notification.id,
        type: notification.metadata?.alert_type || 'new_opportunity',
        title: notification.message.split(':')[0] || 'Market Alert',
        message: notification.message,
        coin_id: notification.related_coin_id,
        metadata: notification.metadata || {},
        created_at: notification.created_at,
        is_read: notification.is_read
      })) || [];
    },
    refetchInterval: 60000 // Check for new alerts every minute
  });

  // Mark alert as read
  const markAsReadMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', alertId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market-intelligence-alerts'] });
    }
  });

  // Generate real-time market alerts based on actual data
  const generateMarketAlerts = async () => {
    try {
      // Check for price spikes in the last hour
      const { data: recentPriceChanges } = await supabase
        .from('coin_price_history')
        .select('coin_identifier, price, created_at')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (recentPriceChanges && recentPriceChanges.length > 0) {
        // Group by coin and check for significant price changes
        const pricesByGrain = recentPriceChanges.reduce((acc: any, price) => {
          if (!acc[price.coin_identifier]) {
            acc[price.coin_identifier] = [];
          }
          acc[price.coin_identifier].push(price);
          return acc;
        }, {});

        for (const [coinId, prices] of Object.entries(pricesByGrain) as [string, any[]][]) {
          if (prices.length >= 2) {
            const latest = prices[0];
            const previous = prices[prices.length - 1];
            const changePercent = ((latest.price - previous.price) / previous.price) * 100;

            if (Math.abs(changePercent) > 10) {
              // Create price spike alert
              await supabase.from('notifications').insert({
                type: 'market_intelligence',
                message: `Price Alert: ${coinId} ${changePercent > 0 ? 'increased' : 'decreased'} by ${Math.abs(changePercent).toFixed(1)}%`,
                metadata: {
                  alert_type: 'price_spike',
                  coin_identifier: coinId,
                  change_percent: changePercent,
                  old_price: previous.price,
                  new_price: latest.price
                },
                user_id: (await supabase.auth.getUser()).data.user?.id
              });
            }
          }
        }
      }

      // Check for volume surges
      const { data: recentTransactions } = await supabase
        .from('payment_transactions')
        .select('amount, created_at, metadata')
        .eq('status', 'completed')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const todayVolume = recentTransactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
      
      // Compare with historical average
      const { data: historicalTransactions } = await supabase
        .from('payment_transactions')
        .select('amount')
        .eq('status', 'completed')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .lte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const avgDailyVolume = historicalTransactions && historicalTransactions.length > 0
        ? historicalTransactions.reduce((sum, t) => sum + (t.amount || 0), 0) / 30
        : 0;

      if (avgDailyVolume > 0 && todayVolume > avgDailyVolume * 1.5) {
        await supabase.from('notifications').insert({
          type: 'market_intelligence',
          message: `Volume Surge: Trading volume is ${((todayVolume / avgDailyVolume) * 100).toFixed(0)}% above average`,
          metadata: {
            alert_type: 'volume_surge',
            today_volume: todayVolume,
            avg_volume: avgDailyVolume,
            surge_percent: ((todayVolume / avgDailyVolume - 1) * 100)
          },
          user_id: (await supabase.auth.getUser()).data.user?.id
        });
      }

    } catch (error) {
      console.error('Error generating market alerts:', error);
    }
  };

  // Show toast notification for new unread alerts
  React.useEffect(() => {
    if (alerts) {
      const unreadAlerts = alerts.filter(alert => !alert.is_read);
      if (unreadAlerts.length > 0) {
        unreadAlerts.slice(0, 3).forEach(alert => {
          toast({
            title: "Market Intelligence Alert",
            description: alert.message,
            duration: 5000,
          });
        });
      }
    }
  }, [alerts, toast]);

  return {
    alerts: alerts || [],
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    generateMarketAlerts,
    unreadCount: alerts?.filter(alert => !alert.is_read).length || 0
  };
};
