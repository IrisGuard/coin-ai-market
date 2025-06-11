
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealAnalyticsData = () => {
  return useQuery({
    queryKey: ['real-analytics-data'],
    queryFn: async () => {
      // Get user growth data from profiles
      const { data: userGrowthData } = await supabase
        .from('profiles')
        .select('created_at')
        .order('created_at', { ascending: true });

      // Get revenue data from transactions
      const { data: revenueData } = await supabase
        .from('payment_transactions')
        .select('amount, created_at, status')
        .eq('status', 'completed')
        .order('created_at', { ascending: true });

      // Get system performance from error logs
      const { data: errorData } = await supabase
        .from('error_logs')
        .select('created_at, error_type')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Process user growth by month
      const userGrowthByMonth = userGrowthData?.reduce((acc: any[], user) => {
        const month = new Date(user.created_at).toLocaleString('default', { month: 'short' });
        const existing = acc.find(item => item.month === month);
        if (existing) {
          existing.users += 1;
          existing.newUsers += 1;
        } else {
          acc.push({ month, users: 1, newUsers: 1 });
        }
        return acc;
      }, []) || [];

      // Process revenue by month
      const revenueByMonth = revenueData?.reduce((acc: any[], transaction) => {
        const month = new Date(transaction.created_at).toLocaleString('default', { month: 'short' });
        const existing = acc.find(item => item.month === month);
        if (existing) {
          existing.revenue += Number(transaction.amount);
          existing.transactions += 1;
        } else {
          acc.push({ 
            month, 
            revenue: Number(transaction.amount), 
            transactions: 1 
          });
        }
        return acc;
      }, []) || [];

      // Process error data for performance metrics
      const performanceByTime = Array.from({ length: 6 }, (_, i) => {
        const hour = i * 4;
        const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
        const errorsInSlot = errorData?.filter(error => {
          const errorHour = new Date(error.created_at).getHours();
          return errorHour >= hour && errorHour < hour + 4;
        }).length || 0;
        
        return {
          time: timeSlot,
          response: Math.max(100, 300 - errorsInSlot * 10), // Simulate response time
          errors: errorsInSlot
        };
      });

      return {
        userGrowth: userGrowthByMonth.slice(-6), // Last 6 months
        revenue: revenueByMonth.slice(-6), // Last 6 months
        performance: performanceByTime
      };
    },
    refetchInterval: 60000 // Update every minute
  });
};
