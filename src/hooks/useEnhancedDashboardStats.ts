
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useEnhancedDashboardStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['enhanced-dashboard-stats'],
    queryFn: async () => {
      // Get comprehensive dashboard statistics
      const { data: dashboardData, error: dashboardError } = await supabase.rpc('get_dashboard_stats');
      if (dashboardError) throw dashboardError;

      // Get AI brain statistics
      const { data: aiData, error: aiError } = await supabase.rpc('get_ai_brain_dashboard_stats');
      if (aiError) throw aiError;

      // Get advanced analytics
      const { data: analyticsData, error: analyticsError } = await supabase.rpc('get_advanced_analytics_dashboard');
      if (analyticsError) throw analyticsError;

      // Get user's portfolio items
      const { data: portfolioItems, error: portfolioError } = await supabase
        .from('favorites')
        .select(`
          coins (
            id,
            name,
            price,
            image,
            grade,
            year,
            category
          )
        `);
      
      if (portfolioError) throw portfolioError;

      // Calculate AI accuracy from recent predictions
      const { data: predictions } = await supabase
        .from('ai_predictions')
        .select('confidence_score')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const avgConfidence = predictions?.length 
        ? predictions.reduce((sum, p) => sum + p.confidence_score, 0) / predictions.length 
        : 0.85;

      // Calculate portfolio performance
      const portfolio = portfolioItems?.map(item => item.coins).filter(Boolean) || [];
      const totalValue = portfolio.reduce((sum, coin) => sum + (coin?.price || 0), 0);
      
      return {
        ...dashboardData,
        aiAccuracy: avgConfidence,
        analysisCount: aiData?.executions_24h || 0,
        marketTrend: totalValue > 1000 ? 'bullish' : 'neutral',
        riskScore: Math.max(0.1, Math.min(0.9, 1 - avgConfidence)),
        profitPercentage: analyticsData?.revenue_24h ? 
          ((analyticsData.revenue_24h - 1000) / 1000) * 100 : 0,
        portfolioItems: portfolio
      };
    }
  });

  return {
    stats: stats || {
      totalCoins: 0,
      totalValue: 0,
      watchlistItems: 0,
      recentActivity: 0,
      aiAccuracy: 0.85,
      analysisCount: 0,
      marketTrend: 'neutral',
      riskScore: 0.3,
      profitPercentage: 0,
      portfolioItems: []
    },
    loading: isLoading
  };
};
