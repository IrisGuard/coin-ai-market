
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { coin_identifier } = await req.json();

    console.log(`Starting price aggregation for: ${coin_identifier}`);

    // Get all price history for this coin
    const { data: priceHistory, error: historyError } = await supabase
      .from('coin_price_history')
      .select(`
        *,
        external_price_sources(source_name, source_type, reliability_score)
      `)
      .eq('coin_identifier', coin_identifier)
      .order('sale_date', { ascending: false });

    if (historyError) throw historyError;

    if (!priceHistory || priceHistory.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'No price history found',
        coin_identifier 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Group by grade
    const gradeGroups = priceHistory.reduce((groups, price) => {
      const grade = price.grade || 'Unknown';
      if (!groups[grade]) groups[grade] = [];
      groups[grade].push(price);
      return groups;
    }, {});

    // Calculate aggregated prices for each grade
    for (const [grade, prices] of Object.entries(gradeGroups)) {
      const priceList = prices as any[];
      
      // Calculate weighted average based on source reliability and recency
      let totalWeight = 0;
      let weightedSum = 0;
      const sourcesUsed = new Set();
      
      priceList.forEach(price => {
        const reliability = price.external_price_sources?.reliability_score || 0.5;
        const daysOld = price.sale_date ? 
          (Date.now() - new Date(price.sale_date).getTime()) / (1000 * 60 * 60 * 24) : 365;
        
        // Weight decreases with age (max 365 days old)
        const recencyWeight = Math.max(0.1, 1 - (daysOld / 365));
        const weight = reliability * recencyWeight * (price.confidence_score || 0.5);
        
        weightedSum += price.price * weight;
        totalWeight += weight;
        sourcesUsed.add(price.external_price_sources?.source_name || 'Unknown');
      });

      const averagePrice = totalWeight > 0 ? weightedSum / totalWeight : 0;
      
      // Calculate trend (compare recent vs older prices)
      const recentPrices = priceList.filter(p => {
        const daysOld = p.sale_date ? 
          (Date.now() - new Date(p.sale_date).getTime()) / (1000 * 60 * 60 * 24) : 365;
        return daysOld <= 30;
      });
      
      const olderPrices = priceList.filter(p => {
        const daysOld = p.sale_date ? 
          (Date.now() - new Date(p.sale_date).getTime()) / (1000 * 60 * 60 * 24) : 365;
        return daysOld > 30 && daysOld <= 90;
      });

      let trend = 'stable';
      let trendPercentage = 0;

      if (recentPrices.length > 0 && olderPrices.length > 0) {
        const recentAvg = recentPrices.reduce((sum, p) => sum + p.price, 0) / recentPrices.length;
        const olderAvg = olderPrices.reduce((sum, p) => sum + p.price, 0) / olderPrices.length;
        
        trendPercentage = ((recentAvg - olderAvg) / olderAvg) * 100;
        
        if (trendPercentage > 5) trend = 'rising';
        else if (trendPercentage < -5) trend = 'falling';
      }

      // Calculate confidence level
      const sampleSize = priceList.length;
      const sourceCount = sourcesUsed.size;
      const confidenceBase = Math.min(1, sampleSize / 10) * 0.4; // Sample size component
      const sourceBonus = Math.min(1, sourceCount / 3) * 0.3; // Source diversity component
      const reliabilityBonus = (totalWeight / sampleSize) * 0.3; // Reliability component
      const confidenceLevel = Math.min(1, confidenceBase + sourceBonus + reliabilityBonus);

      // Upsert aggregated price
      const { error: upsertError } = await supabase
        .from('aggregated_coin_prices')
        .upsert({
          coin_identifier,
          grade,
          current_avg_price: averagePrice,
          price_trend: trend,
          trend_percentage: trendPercentage,
          sample_size: sampleSize,
          confidence_level: confidenceLevel,
          price_sources: Array.from(sourcesUsed),
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'coin_identifier,grade'
        });

      if (upsertError) {
        console.error('Error upserting aggregated price:', upsertError);
      }
    }

    console.log(`Price aggregation completed for ${coin_identifier}`);

    return new Response(JSON.stringify({ 
      success: true,
      coin_identifier,
      grades_processed: Object.keys(gradeGroups).length,
      total_prices: priceHistory.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Price aggregation error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Price aggregation failed', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
