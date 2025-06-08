
import { useState, useEffect } from 'react';
import { useDashboardData } from './useDashboardData';

export const useEnhancedDashboardStats = () => {
  const dashboardData = useDashboardData();
  const [enhancedStats, setEnhancedStats] = useState({
    ...dashboardData.stats,
    aiAccuracy: 0.94,
    analysisCount: 156,
    marketTrend: 'bullish',
    riskScore: 0.23,
    profitPercentage: 12.5,
    portfolioItems: []
  });

  useEffect(() => {
    if (dashboardData.stats) {
      setEnhancedStats(prev => ({
        ...prev,
        ...dashboardData.stats,
        profitPercentage: 12.5,
        portfolioItems: dashboardData.favorites || []
      }));
    }
  }, [dashboardData.stats, dashboardData.favorites]);

  return {
    stats: enhancedStats,
    loading: false
  };
};
