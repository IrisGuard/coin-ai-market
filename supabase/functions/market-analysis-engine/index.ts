
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { analysisId, coinData, includeInvestmentAdvice = true } = await req.json();

    if (!analysisId || !coinData) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Starting real market analysis for:', coinData.name);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Perform real market analysis using database
    const marketAnalysis = await performRealMarketAnalysis(supabase, coinData, includeInvestmentAdvice);

    console.log('Market analysis completed for:', analysisId);

    return new Response(
      JSON.stringify({
        success: true,
        analysisId,
        marketAnalysis
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Market analysis error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function performRealMarketAnalysis(supabase: any, coinData: any, includeInvestmentAdvice: boolean) {
  try {
    // Get aggregated price data from database
    const { data: aggregatedPrices } = await supabase
      .from('aggregated_coin_prices')
      .select('*')
      .ilike('coin_identifier', `%${coinData.name || ''}%`)
      .order('last_updated', { ascending: false })
      .limit(10);

    // Get price history for trends
    const { data: priceHistory } = await supabase
      .from('coin_price_history')
      .select('*')
      .ilike('coin_identifier', `%${coinData.name || ''}%`)
      .order('date_recorded', { ascending: false })
      .limit(50);

    // Get market analytics data
    const { data: marketAnalytics } = await supabase
      .from('market_analytics')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(20);

    // Calculate real market analysis
    const baseValue = coinData.estimated_value || coinData.estimatedValue || calculateBaseValue(priceHistory);
    
    const analysis = {
      currentMarketValue: calculateCurrentValue(aggregatedPrices, baseValue),
      priceTrends: calculatePriceTrends(priceHistory),
      recentSales: calculateRecentSales(priceHistory),
      populationData: {
        total_graded: priceHistory?.length || 0,
        data_points: aggregatedPrices?.length || 0,
        source_confidence: calculateSourceConfidence(aggregatedPrices)
      },
      marketFactors: {
        silver_price_impact: coinData.composition?.includes('Silver') ? 'High' : 'None',
        collector_demand: calculateCollectorDemand(priceHistory),
        market_stability: calculateMarketStability(marketAnalytics),
        data_quality: 'Real database sourced'
      }
    };

    if (includeInvestmentAdvice) {
      analysis.investmentRecommendation = generateRealInvestmentRecommendation(analysis, coinData, priceHistory);
      analysis.marketOutlook = generateRealMarketOutlook(analysis, coinData, marketAnalytics);
    }

    return analysis;
    
  } catch (error) {
    console.error('Real market analysis error:', error);
    throw error;
  }
}

function calculateBaseValue(priceHistory: any[]): number {
  if (!priceHistory || priceHistory.length === 0) return 100;
  
  const validPrices = priceHistory.filter(p => p.price && p.price > 0);
  if (validPrices.length === 0) return 100;
  
  const avgPrice = validPrices.reduce((sum, p) => sum + p.price, 0) / validPrices.length;
  return avgPrice;
}

function calculateCurrentValue(aggregatedPrices: any[], baseValue: number) {
  const recent = aggregatedPrices?.[0];
  if (recent) {
    return {
      low: recent.min_price || baseValue * 0.8,
      average: recent.avg_price || baseValue,
      high: recent.max_price || baseValue * 1.2,
      confidence: recent.confidence_level || 0.8,
      source_count: recent.source_count || 1
    };
  }
  
  return {
    low: baseValue * 0.8,
    average: baseValue,
    high: baseValue * 1.2,
    confidence: 0.5,
    source_count: 0
  };
}

function calculatePriceTrends(priceHistory: any[]) {
  if (!priceHistory || priceHistory.length < 2) {
    return {
      trend: 'stable',
      change_1m: 0,
      change_3m: 0,
      change_1y: 0
    };
  }

  const sortedHistory = priceHistory.sort((a, b) => 
    new Date(b.date_recorded).getTime() - new Date(a.date_recorded).getTime()
  );

  const latest = sortedHistory[0]?.price || 0;
  const oneMonthAgo = findPriceByDaysAgo(sortedHistory, 30);
  const threeMonthsAgo = findPriceByDaysAgo(sortedHistory, 90);
  const oneYearAgo = findPriceByDaysAgo(sortedHistory, 365);

  return {
    trend: latest > oneMonthAgo ? 'rising' : latest < oneMonthAgo ? 'declining' : 'stable',
    change_1m: oneMonthAgo ? ((latest - oneMonthAgo) / oneMonthAgo * 100) : 0,
    change_3m: threeMonthsAgo ? ((latest - threeMonthsAgo) / threeMonthsAgo * 100) : 0,
    change_1y: oneYearAgo ? ((latest - oneYearAgo) / oneYearAgo * 100) : 0
  };
}

function findPriceByDaysAgo(sortedHistory: any[], days: number): number {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - days);
  
  const closest = sortedHistory.find(h => 
    new Date(h.date_recorded) <= targetDate
  );
  
  return closest?.price || 0;
}

function calculateRecentSales(priceHistory: any[]) {
  const recent30Days = priceHistory.filter(p => {
    const saleDate = new Date(p.date_recorded);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return saleDate >= thirtyDaysAgo;
  });

  if (recent30Days.length === 0) {
    return {
      avg_price_30d: 0,
      volume_30d: 0,
      last_sale_date: null
    };
  }

  const avgPrice = recent30Days.reduce((sum, p) => sum + (p.price || 0), 0) / recent30Days.length;
  
  return {
    avg_price_30d: avgPrice,
    volume_30d: recent30Days.length,
    last_sale_date: recent30Days[0]?.date_recorded
  };
}

function calculateSourceConfidence(aggregatedPrices: any[]): number {
  if (!aggregatedPrices || aggregatedPrices.length === 0) return 0.5;
  
  const recent = aggregatedPrices[0];
  return recent.confidence_level || 0.5;
}

function calculateCollectorDemand(priceHistory: any[]): string {
  const recentVolume = priceHistory?.length || 0;
  
  if (recentVolume > 20) return 'High';
  if (recentVolume > 10) return 'Moderate';
  return 'Low';
}

function calculateMarketStability(marketAnalytics: any[]): string {
  if (!marketAnalytics || marketAnalytics.length === 0) return 'Unknown';
  
  const recentMetrics = marketAnalytics.slice(0, 5);
  const hasVolatility = recentMetrics.some(m => 
    m.trend_analysis && JSON.stringify(m.trend_analysis).includes('volatile')
  );
  
  return hasVolatility ? 'Volatile' : 'Stable';
}

function generateRealInvestmentRecommendation(analysis: any, coinData: any, priceHistory: any[]): string {
  const trend = analysis.priceTrends.trend;
  const demand = analysis.marketFactors.collector_demand;
  const dataQuality = priceHistory?.length || 0;
  
  if (dataQuality > 20 && trend === 'rising' && demand === 'High') {
    return 'Strong Buy - High data confidence with positive trends and strong demand';
  } else if (trend === 'rising' && demand === 'Moderate') {
    return 'Buy - Positive trend with moderate collector interest';
  } else if (trend === 'stable' && dataQuality > 10) {
    return 'Hold - Stable performance with good data history';
  } else {
    return 'Monitor - Limited data available, watch for trend development';
  }
}

function generateRealMarketOutlook(analysis: any, coinData: any, marketAnalytics: any[]): string {
  const trend = analysis.priceTrends.trend;
  const stability = analysis.marketFactors.market_stability;
  const dataPoints = marketAnalytics?.length || 0;
  
  let outlook = `Market outlook based on ${dataPoints} data points shows ${trend} performance. `;
  
  if (coinData.composition?.includes('Silver')) {
    outlook += 'Silver content provides intrinsic value support. ';
  }
  
  outlook += `Market appears ${stability.toLowerCase()} with `;
  outlook += analysis.populationData.data_points > 10 ? 'sufficient data coverage' : 'limited data availability';
  outlook += ' for reliable analysis.';

  return outlook;
}
