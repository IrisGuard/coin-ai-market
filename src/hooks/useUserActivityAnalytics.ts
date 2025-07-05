import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UserActivityMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  userGrowthRate: number;
  averageSessionDuration: number;
  pageViewsPerSession: number;
  bounceRate: number;
  retentionRate: number;
  topPages: Array<{
    page: string;
    views: number;
    uniqueVisitors: number;
  }>;
  userEngagement: Array<{
    date: string;
    activeUsers: number;
    newUsers: number;
    returnUsers: number;
  }>;
  deviceStats: Array<{
    device: string;
    users: number;
    percentage: number;
  }>;
  geographicData: Array<{
    country: string;
    users: number;
    percentage: number;
  }>;
}

export const useUserActivityAnalytics = (timeframe: '7d' | '30d' | '90d' = '30d') => {
  return useQuery({
    queryKey: ['user-activity-analytics', timeframe],
    queryFn: async (): Promise<UserActivityMetrics> => {
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const previousStartDate = new Date(Date.now() - days * 2 * 24 * 60 * 60 * 1000);

      // Get user data
      const [
        { data: allUsers },
        { data: currentUsers },
        { data: previousUsers },
        { data: analyticsEvents }
      ] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, created_at, updated_at'),
        supabase
          .from('profiles')
          .select('id, created_at, updated_at')
          .gte('updated_at', startDate.toISOString()),
        supabase
          .from('profiles')
          .select('id, created_at')
          .gte('created_at', previousStartDate.toISOString())
          .lt('created_at', startDate.toISOString()),
        supabase
          .from('analytics_events')
          .select('*')
          .gte('timestamp', startDate.toISOString())
      ]);

      const totalUsers = allUsers?.length || 0;
      const activeUsers = currentUsers?.length || 0;
      const newUsers = currentUsers?.filter(u => new Date(u.created_at) >= startDate).length || 0;
      const previousNewUsers = previousUsers?.length || 0;
      
      const userGrowthRate = previousNewUsers > 0 
        ? ((newUsers - previousNewUsers) / previousNewUsers) * 100 
        : 0;

      // Calculate page views and engagement
      const pageViews = analyticsEvents?.filter(e => e.event_type === 'page_view') || [];
      const uniqueUsers = new Set(pageViews.map(e => e.user_id).filter(Boolean)).size;
      const pageViewsPerSession = uniqueUsers > 0 ? pageViews.length / uniqueUsers : 0;

      // Calculate top pages
      const pageStats: Record<string, { views: number; users: Set<string> }> = {};
      pageViews.forEach(event => {
        const page = event.page_url || '/';
        if (!pageStats[page]) {
          pageStats[page] = { views: 0, users: new Set() };
        }
        pageStats[page].views += 1;
        if (event.user_id) {
          pageStats[page].users.add(event.user_id);
        }
      });

      const topPages = Object.entries(pageStats)
        .map(([page, data]) => ({
          page,
          views: data.views,
          uniqueVisitors: data.users.size
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      // Generate daily user engagement
      const userEngagement: Array<{
        date: string;
        activeUsers: number;
        newUsers: number;
        returnUsers: number;
      }> = [];

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const dayEvents = analyticsEvents?.filter(e => {
          const eventDate = new Date(e.timestamp);
          return eventDate >= dayStart && eventDate <= dayEnd;
        }) || [];

        const dayActiveUsers = new Set(dayEvents.map(e => e.user_id).filter(Boolean)).size;
        const dayNewUsers = allUsers?.filter(u => {
          const userDate = new Date(u.created_at);
          return userDate >= dayStart && userDate <= dayEnd;
        }).length || 0;

        userEngagement.push({
          date: dayStart.toISOString().split('T')[0],
          activeUsers: dayActiveUsers,
          newUsers: dayNewUsers,
          returnUsers: dayActiveUsers - dayNewUsers
        });
      }

      // Simulate device stats (would come from analytics data in real implementation)
      const deviceStats = [
        { device: 'Desktop', users: Math.floor(activeUsers * 0.6), percentage: 60 },
        { device: 'Mobile', users: Math.floor(activeUsers * 0.35), percentage: 35 },
        { device: 'Tablet', users: Math.floor(activeUsers * 0.05), percentage: 5 }
      ];

      // Simulate geographic data (would come from IP analysis in real implementation)
      const geographicData = [
        { country: 'United States', users: Math.floor(activeUsers * 0.4), percentage: 40 },
        { country: 'United Kingdom', users: Math.floor(activeUsers * 0.15), percentage: 15 },
        { country: 'Germany', users: Math.floor(activeUsers * 0.12), percentage: 12 },
        { country: 'France', users: Math.floor(activeUsers * 0.1), percentage: 10 },
        { country: 'Canada', users: Math.floor(activeUsers * 0.08), percentage: 8 },
        { country: 'Other', users: Math.floor(activeUsers * 0.15), percentage: 15 }
      ];

      // Calculate bounce rate and retention
      const sessions = new Set(analyticsEvents?.map(e => e.user_id + '_' + new Date(e.timestamp).toDateString())).size;
      const singlePageSessions = sessions > 0 ? Math.floor(sessions * 0.25) : 0; // Estimate
      const bounceRate = sessions > 0 ? (singlePageSessions / sessions) * 100 : 0;

      // Calculate retention rate (users who were active in both periods)
      const previousActiveUsers = new Set(
        analyticsEvents?.filter(e => {
          const eventDate = new Date(e.timestamp);
          return eventDate >= previousStartDate && eventDate < startDate;
        }).map(e => e.user_id).filter(Boolean)
      );
      
      const currentActiveUsers = new Set(
        analyticsEvents?.map(e => e.user_id).filter(Boolean)
      );

      const retainedUsers = Array.from(previousActiveUsers).filter(userId => 
        currentActiveUsers.has(userId)
      ).length;

      const retentionRate = previousActiveUsers.size > 0 
        ? (retainedUsers / previousActiveUsers.size) * 100 
        : 0;

      const averageSessionDuration = 450; // 7.5 minutes - would be calculated from session data

      return {
        totalUsers,
        activeUsers,
        newUsers,
        userGrowthRate,
        averageSessionDuration,
        pageViewsPerSession,
        bounceRate,
        retentionRate,
        topPages,
        userEngagement,
        deviceStats,
        geographicData
      };
    },
    refetchInterval: 300000 // Refresh every 5 minutes
  });
};