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

      const [
        { data: allUsers },
        { data: currentUsers },
        { data: previousUsers },
        { data: analyticsEvents }
      ] = await Promise.all([
        supabase.from('profiles').select('id, created_at, updated_at'),
        supabase.from('profiles').select('id, created_at, updated_at').gte('updated_at', startDate.toISOString()),
        supabase.from('profiles').select('id, created_at').gte('created_at', previousStartDate.toISOString()).lt('created_at', startDate.toISOString()),
        supabase.from('analytics_events').select('*').gte('timestamp', previousStartDate.toISOString())
      ]);

      const totalUsers = allUsers?.length || 0;
      const activeUsers = currentUsers?.length || 0;
      const newUsers = currentUsers?.filter(u => new Date(u.created_at) >= startDate).length || 0;
      const previousNewUsers = previousUsers?.length || 0;
      const userGrowthRate = previousNewUsers > 0 ? ((newUsers - previousNewUsers) / previousNewUsers) * 100 : 0;

      const currentPeriodEvents = (analyticsEvents || []).filter(e => new Date(e.timestamp) >= startDate);
      const pageViews = currentPeriodEvents.filter(e => e.event_type === 'page_view');
      const uniqueUsers = new Set(pageViews.map(e => e.user_id).filter(Boolean)).size;
      const pageViewsPerSession = uniqueUsers > 0 ? pageViews.length / uniqueUsers : 0;

      const pageStats: Record<string, { views: number; users: Set<string> }> = {};
      pageViews.forEach(event => {
        const page = event.page_url || '/';
        if (!pageStats[page]) pageStats[page] = { views: 0, users: new Set() };
        pageStats[page].views += 1;
        if (event.user_id) pageStats[page].users.add(event.user_id);
      });

      const topPages = Object.entries(pageStats)
        .map(([page, data]) => ({ page, views: data.views, uniqueVisitors: data.users.size }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      const userEngagement: UserActivityMetrics['userEngagement'] = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));

        const dayEvents = currentPeriodEvents.filter(e => {
          const eventDate = new Date(e.timestamp);
          return eventDate >= dayStart && eventDate <= dayEnd;
        });

        const dayActiveUsers = new Set(dayEvents.map(e => e.user_id).filter(Boolean)).size;
        const dayNewUsers = allUsers?.filter(u => {
          const userDate = new Date(u.created_at);
          return userDate >= dayStart && userDate <= dayEnd;
        }).length || 0;

        userEngagement.push({
          date: dayStart.toISOString().split('T')[0],
          activeUsers: dayActiveUsers,
          newUsers: dayNewUsers,
          returnUsers: Math.max(0, dayActiveUsers - dayNewUsers),
        });
      }

      const previousActiveUsers = new Set(
        (analyticsEvents || [])
          .filter(e => {
            const eventDate = new Date(e.timestamp);
            return eventDate >= previousStartDate && eventDate < startDate;
          })
          .map(e => e.user_id)
          .filter(Boolean)
      );

      const currentActiveUsers = new Set(currentPeriodEvents.map(e => e.user_id).filter(Boolean));
      const retainedUsers = Array.from(previousActiveUsers).filter(userId => currentActiveUsers.has(userId)).length;
      const retentionRate = previousActiveUsers.size > 0 ? (retainedUsers / previousActiveUsers.size) * 100 : 0;

      const sessionDurations = currentPeriodEvents
        .map(event => {
          if (typeof event.metadata === 'object' && event.metadata !== null) {
            const metadata = event.metadata as Record<string, any>;
            return typeof metadata.session_duration === 'number' ? metadata.session_duration : 0;
          }
          return 0;
        })
        .filter(value => value > 0);

      const averageSessionDuration = sessionDurations.length > 0
        ? sessionDurations.reduce((sum, value) => sum + value, 0) / sessionDurations.length
        : 0;

      return {
        totalUsers,
        activeUsers,
        newUsers,
        userGrowthRate,
        averageSessionDuration,
        pageViewsPerSession,
        bounceRate: 0,
        retentionRate,
        topPages,
        userEngagement,
        deviceStats: [],
        geographicData: [],
      };
    },
    refetchInterval: 300000
  });
};
