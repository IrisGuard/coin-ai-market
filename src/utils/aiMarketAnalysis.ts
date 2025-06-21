import { supabase } from '@/integrations/supabase/client';

interface MarketAnalysis {
  trend: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  recommendation: string;
  factors: string[];
}

interface MarketTrend {
  direction: 'up' | 'down' | 'stable';
  strength: number;
  volume: number;
}

interface AnalyticsEvent {
  event_type: string;
  metadata: any;
  timestamp: string;
}

export const analyzeMarketTrends = async (coinId?: string): Promise<MarketAnalysis> => {
  try {
    // Get real market data from analytics_events table
    const { data: marketEvents, error } = await supabase
      .from('analytics_events')
      .select('event_type, metadata, timestamp')
      .in('event_type', ['coin_view', 'coin_purchase', 'store_visit'])
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error || !marketEvents) {
      console.error('Error fetching market data:', error);
      return getDefaultAnalysis();
    }

    // Calculate real market metrics
    const events = marketEvents as unknown as AnalyticsEvent[];
    const totalEvents = events.length;
    const recentEvents = events.filter(event => 
      new Date(event.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length;

    const activityRatio = totalEvents > 0 ? recentEvents / totalEvents : 0;
    
    // Determine trend based on real activity
    let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    let confidence = 0.5;
    
    if (activityRatio > 0.3) {
      trend = 'bullish';
      confidence = Math.min(0.85, 0.6 + activityRatio);
    } else if (activityRatio < 0.1) {
      trend = 'bearish';
      confidence = Math.min(0.75, 0.5 + (0.1 - activityRatio) * 2);
    } else {
      confidence = 0.5 + activityRatio;
    }

    const factors = generateFactors(trend, activityRatio);
    const recommendation = generateRecommendation(trend, confidence);

    return {
      trend,
      confidence,
      recommendation,
      factors
    };
  } catch (error) {
    console.error('Error in market analysis:', error);
    return getDefaultAnalysis();
  }
};

export const generateDailyTrends = async (): Promise<MarketTrend[]> => {
  try {
    // Get real daily activity data
    const { data: dailyData, error } = await supabase
      .from('analytics_events')
      .select('timestamp, event_type')
      .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('timestamp', { ascending: false });

    if (error || !dailyData) {
      return getDefaultTrends();
    }

    // Group by day and calculate trends
    const events = dailyData as unknown as AnalyticsEvent[];
    const dailyGroups = groupByDay(events);
    const trends: MarketTrend[] = [];

    Object.entries(dailyGroups).forEach(([day, dayEvents]) => {
      const eventCount = dayEvents.length;
      const direction = eventCount > 10 ? 'up' : eventCount < 5 ? 'down' : 'stable';
      const strength = Math.min(1, eventCount / 20);
      const volume = eventCount;

      trends.push({ direction, strength, volume });
    });

    return trends.slice(0, 7); // Last 7 days
  } catch (error) {
    console.error('Error generating daily trends:', error);
    return getDefaultTrends();
  }
};

// Helper functions
function getDefaultAnalysis(): MarketAnalysis {
  return {
    trend: 'neutral',
    confidence: 0.5,
    recommendation: 'Monitor market conditions',
    factors: ['Limited market data available']
  };
}

function getDefaultTrends(): MarketTrend[] {
  return Array.from({ length: 7 }, () => ({
    direction: 'stable' as const,
    strength: 0.5,
    volume: 0
  }));
}

function groupByDay(data: AnalyticsEvent[]) {
  return data.reduce((groups, item) => {
    const day = new Date(item.timestamp).toDateString();
    if (!groups[day]) groups[day] = [];
    groups[day].push(item);
    return groups;
  }, {} as Record<string, AnalyticsEvent[]>);
}

function generateFactors(trend: string, activityRatio: number): string[] {
  const factors = [];
  
  if (trend === 'bullish') {
    factors.push('Increased user activity');
    if (activityRatio > 0.5) factors.push('Strong market engagement');
  } else if (trend === 'bearish') {
    factors.push('Decreased user activity');
    if (activityRatio < 0.05) factors.push('Low market participation');
  } else {
    factors.push('Stable market conditions');
  }
  
  return factors;
}

function generateRecommendation(trend: string, confidence: number): string {
  if (trend === 'bullish' && confidence > 0.7) {
    return 'Consider increasing inventory for high-demand items';
  } else if (trend === 'bearish' && confidence > 0.7) {
    return 'Focus on premium items and customer retention';
  } else {
    return 'Monitor market conditions and maintain current strategy';
  }
}
