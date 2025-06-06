
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPortfolio } from '@/hooks/useEnhancedDataSources';
import { useEnhancedDashboardStats } from '@/hooks/useEnhancedDashboardStats';
import { usePageView } from '@/hooks/usePageView';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Component imports
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStatsGrid from '@/components/dashboard/DashboardStatsGrid';
import DashboardSecondaryStats from '@/components/dashboard/DashboardSecondaryStats';
import EnhancedPortfolioStats from '@/components/dashboard/EnhancedPortfolioStats';
import EnhancedRecentActivity from '@/components/dashboard/EnhancedRecentActivity';
import DashboardQuickActions from '@/components/dashboard/DashboardQuickActions';
import DashboardPortfolioOverview from '@/components/dashboard/DashboardPortfolioOverview';

const Dashboard = () => {
  usePageView();
  const { user } = useAuth();
  const { data: portfolioItems } = useUserPortfolio(user?.id);
  const { stats, recentActivity, loading } = useEnhancedDashboardStats();

  // Get user's watchlist count
  const { data: watchlistCount } = useQuery({
    queryKey: ['watchlist-count', user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('watchlist')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id!);
      return count || 0;
    },
    enabled: !!user?.id,
  });

  // Get user's active bids count
  const { data: activeBidsCount } = useQuery({
    queryKey: ['active-bids-count', user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('bids')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id!)
        .eq('is_winning', true);
      return count || 0;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <DashboardHeader userName={user?.user_metadata?.full_name} />

        <DashboardStatsGrid 
          stats={stats} 
          activeBidsCount={activeBidsCount} 
        />

        <DashboardSecondaryStats 
          stats={stats} 
          watchlistCount={watchlistCount} 
        />

        <EnhancedPortfolioStats stats={stats} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnhancedRecentActivity activities={recentActivity} loading={loading} />
          <DashboardQuickActions />
        </div>

        <DashboardPortfolioOverview 
          portfolioItems={portfolioItems} 
          stats={stats} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
