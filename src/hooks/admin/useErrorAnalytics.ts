
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ErrorAnalytics {
  totalErrors: number;
  errorsByType: { type: string; count: number }[];
  errorsByDay: { date: string; count: number }[];
  topErrorPages: { page: string; count: number }[];
  errorTrends: {
    thisWeek: number;
    lastWeek: number;
    percentageChange: number;
  };
  // Add the properties that our mock data uses
  critical_24h: number;
  error_rate: number;
  avg_resolution_time: number;
  categories: { type: string; count: number }[];
}

export const useErrorAnalytics = () => {
  return useQuery({
    queryKey: ['error-analytics'],
    queryFn: async (): Promise<ErrorAnalytics> => {
      // Get all error logs from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: errorLogs, error } = await supabase
        .from('error_logs')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (error) throw error;

      const errors = errorLogs || [];

      // Calculate analytics
      const totalErrors = errors.length;

      // Errors by type
      const typeMap = new Map();
      errors.forEach(err => {
        const type = err.error_type || 'unknown';
        typeMap.set(type, (typeMap.get(type) || 0) + 1);
      });
      const errorsByType = Array.from(typeMap.entries()).map(([type, count]) => ({
        type,
        count
      }));

      // Errors by day
      const dayMap = new Map();
      errors.forEach(err => {
        const date = new Date(err.created_at).toISOString().split('T')[0];
        dayMap.set(date, (dayMap.get(date) || 0) + 1);
      });
      const errorsByDay = Array.from(dayMap.entries()).map(([date, count]) => ({
        date,
        count
      }));

      // Top error pages
      const pageMap = new Map();
      errors.forEach(err => {
        const page = err.page_url || 'unknown';
        pageMap.set(page, (pageMap.get(page) || 0) + 1);
      });
      const topErrorPages = Array.from(pageMap.entries())
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Error trends
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      const thisWeek = errors.filter(err => 
        new Date(err.created_at) >= oneWeekAgo
      ).length;
      const lastWeek = errors.filter(err => 
        new Date(err.created_at) >= twoWeeksAgo && 
        new Date(err.created_at) < oneWeekAgo
      ).length;

      const percentageChange = lastWeek > 0 
        ? ((thisWeek - lastWeek) / lastWeek) * 100 
        : 0;

      // Calculate critical errors from last 24h
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const criticalErrors24h = errors.filter(err => 
        new Date(err.created_at) >= oneDayAgo && 
        (err.error_type === 'critical' || err.error_type === 'error')
      ).length;

      return {
        totalErrors,
        errorsByType,
        errorsByDay,
        topErrorPages,
        errorTrends: {
          thisWeek,
          lastWeek,
          percentageChange
        },
        critical_24h: criticalErrors24h,
        error_rate: totalErrors > 0 ? (criticalErrors24h / totalErrors) * 100 : 0,
        avg_resolution_time: 15, // Mock average resolution time in minutes
        categories: errorsByType
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
