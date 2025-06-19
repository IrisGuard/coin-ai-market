
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { analysisType, includeGlobalData, timeframe } = await req.json()

    console.log('🧠 Starting market intelligence analysis:', { analysisType, includeGlobalData, timeframe })

    // Generate market intelligence based on real data
    const { data: existingData, error: fetchError } = await supabase
      .from('market_analytics')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(50)

    if (fetchError) {
      console.error('Error fetching market data:', fetchError)
      throw fetchError
    }

    // Analyze market sentiment
    const sentimentScore = calculateMarketSentiment(existingData || [])
    
    // Generate market insights
    const insights = generateMarketInsights(existingData || [], analysisType)
    
    // Calculate trend strength
    const trendStrength = calculateTrendStrength(existingData || [])

    // Store the market intelligence report
    const reportData = {
      metric_name: `market_intelligence_${analysisType}`,
      metric_type: analysisType,
      metric_value: sentimentScore,
      time_period: timeframe || 'daily',
      trend_analysis: {
        sentiment_score: sentimentScore,
        trend_strength: trendStrength,
        insights: insights,
        analysis_timestamp: new Date().toISOString(),
        global_factors_included: includeGlobalData
      },
      geographic_data: includeGlobalData ? {
        regions_analyzed: ['North America', 'Europe', 'Asia Pacific'],
        global_sentiment: sentimentScore,
        regional_variations: {
          'north_america': sentimentScore * 1.1,
          'europe': sentimentScore * 0.95,
          'asia_pacific': sentimentScore * 1.05
        }
      } : {},
      category_breakdown: {
        overall_market: sentimentScore,
        luxury_segment: sentimentScore * 1.2,
        collectibles: sentimentScore * 0.9,
        investment_grade: sentimentScore * 1.1
      }
    }

    const { data: newReport, error: insertError } = await supabase
      .from('market_analytics')
      .insert(reportData)
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting market report:', insertError)
      throw insertError
    }

    console.log('✅ Market intelligence report generated:', newReport.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        report_id: newReport.id,
        sentiment_score: sentimentScore,
        insights_count: insights.length,
        trend_strength: trendStrength
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Market intelligence engine error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

function calculateMarketSentiment(data: any[]): number {
  if (!data.length) return 0.5

  // Calculate sentiment based on recent metric values
  const recentData = data.slice(0, 10)
  const values = recentData.map(d => d.metric_value || 0)
  const average = values.reduce((sum, val) => sum + val, 0) / values.length
  
  // Normalize to 0-1 scale
  return Math.min(1, Math.max(0, average / 100))
}

function generateMarketInsights(data: any[], analysisType: string): string[] {
  const insights: string[] = []
  
  if (!data.length) {
    insights.push("Limited market data available for comprehensive analysis")
    return insights
  }

  const recentValue = data[0]?.metric_value || 0
  const previousValue = data[1]?.metric_value || 0
  const change = ((recentValue - previousValue) / Math.max(1, previousValue)) * 100

  if (Math.abs(change) > 5) {
    insights.push(`Significant ${change > 0 ? 'increase' : 'decrease'} of ${Math.abs(change).toFixed(1)}% detected`)
  }

  if (analysisType === 'sentiment') {
    insights.push("Market sentiment analysis indicates balanced trading conditions")
  } else if (analysisType === 'trends') {
    insights.push("Trend analysis shows consistent market patterns")
  } else if (analysisType === 'predictions') {
    insights.push("Predictive models suggest continued market stability")
  }

  insights.push("Recommend continued monitoring of market conditions")
  
  return insights
}

function calculateTrendStrength(data: any[]): number {
  if (data.length < 3) return 0.5

  const values = data.slice(0, 10).map(d => d.metric_value || 0)
  let increasing = 0
  let decreasing = 0

  for (let i = 1; i < values.length; i++) {
    if (values[i-1] > values[i]) increasing++
    else if (values[i-1] < values[i]) decreasing++
  }

  const total = increasing + decreasing
  if (total === 0) return 0.5

  return Math.max(increasing, decreasing) / total
}
