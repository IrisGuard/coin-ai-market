
import { useState, useEffect } from 'react';
import { useDashboardData } from './useDashboardData';

export const useEnhancedDashboardStats = () => {
  const { stats: baseStats, isLoading } = useDashboardData();
  const [enhancedStats, setEnhancedStats] = useState({
    ...baseStats,
    aiAccuracy: 0.94,
    analysisCount: 156,
    marketTrend: 'bullish',
    riskScore: 0.23
  });

  useEffect(() => {
    if (baseStats) {
      setEnhancedStats(prev => ({
        ...prev,
        ...baseStats
      }));
    }
  }, [baseStats]);

  return {
    stats: enhancedStats,
    loading: isLoading
  };
};
