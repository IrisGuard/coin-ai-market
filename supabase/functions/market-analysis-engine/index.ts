
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    console.log('Starting market analysis for:', coinData.name);

    // Perform comprehensive market analysis
    const marketAnalysis = await performMarketAnalysis(coinData, includeInvestmentAdvice);

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

async function performMarketAnalysis(coinData: any, includeInvestmentAdvice: boolean) {
  // Simulate comprehensive market analysis
  const baseValue = coinData.estimated_value || coinData.estimatedValue || 50;
  
  const analysis = {
    currentMarketValue: {
      low: Math.round(baseValue * 0.8),
      average: Math.round(baseValue),
      high: Math.round(baseValue * 1.2),
      confidence: 0.85
    },
    priceTrends: {
      trend: Math.random() > 0.5 ? 'rising' : 'stable',
      change_1m: Math.round((Math.random() - 0.5) * 10 * 100) / 100,
      change_3m: Math.round((Math.random() - 0.5) * 20 * 100) / 100,
      change_1y: Math.round((Math.random() - 0.5) * 50 * 100) / 100
    },
    recentSales: {
      avg_price_30d: Math.round(baseValue * (0.9 + Math.random() * 0.2)),
      volume_30d: Math.floor(Math.random() * 200) + 50,
      last_sale_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    populationData: {
      total_graded: Math.floor(Math.random() * 50000) + 5000,
      higher_grades: Math.floor(Math.random() * 10000) + 1000,
      this_grade: Math.floor(Math.random() * 15000) + 2000,
      grading_service: Math.random() > 0.5 ? 'PCGS' : 'NGC'
    },
    marketFactors: {
      silver_price_impact: coinData.composition?.includes('Silver') ? 'High' : 'None',
      collector_demand: ['Low', 'Moderate', 'High'][Math.floor(Math.random() * 3)],
      seasonal_trends: 'Stable year-round',
      economic_factors: 'Precious metals market stable'
    }
  };

  if (includeInvestmentAdvice) {
    analysis.investmentRecommendation = generateInvestmentRecommendation(analysis, coinData);
    analysis.marketOutlook = generateMarketOutlook(analysis, coinData);
  }

  return analysis;
}

function generateInvestmentRecommendation(analysis: any, coinData: any): string {
  const trend = analysis.priceTrends.trend;
  const demand = analysis.marketFactors.collector_demand;
  const rarity = coinData.rarity || 'Common';

  if (rarity === 'Rare' || rarity === 'Very Rare') {
    return 'Strong Buy - Rare coin with good long-term appreciation potential';
  } else if (trend === 'rising' && demand === 'High') {
    return 'Buy - Positive trend with strong collector demand';
  } else if (trend === 'stable' && demand === 'Moderate') {
    return 'Hold - Stable investment with moderate growth potential';
  } else {
    return 'Hold - Common date with stable demand, good for portfolio diversity';
  }
}

function generateMarketOutlook(analysis: any, coinData: any): string {
  const hasSilver = coinData.composition?.includes('Silver');
  const trend = analysis.priceTrends.trend;
  
  let outlook = `Market outlook appears ${trend === 'rising' ? 'positive' : 'stable'} for this coin. `;
  
  if (hasSilver) {
    outlook += 'Silver content provides intrinsic value floor. ';
  }
  
  outlook += `Current grading population of ${analysis.populationData.total_graded} suggests `;
  outlook += analysis.populationData.total_graded > 20000 ? 'adequate supply' : 'limited availability';
  outlook += ' in the market.';

  return outlook;
}
