import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GlobalIntelligenceRequest {
  action: 'analyze' | 'predict' | 'optimize' | 'discover';
  target_region?: string;
  intelligence_type?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json() as GlobalIntelligenceRequest;
    console.log('🌐 Global Intelligence Network:', body.action);

    const result = await executeIntelligenceAction(supabaseClient, body);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Global Intelligence Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function executeIntelligenceAction(supabase: any, body: GlobalIntelligenceRequest): Promise<any> {
  const action = body.action || 'analyze';

  // Get source data for analysis
  const { data: sources } = await supabase
    .from('global_coin_sources')
    .select('*')
    .limit(50);

  const { data: mappings } = await supabase
    .from('source_category_mapping')
    .select('*')
    .limit(100);

  const analysis = {
    total_sources: sources?.length || 0,
    total_mappings: mappings?.length || 0,
    intelligence_score: calculateIntelligenceScore(sources || [], mappings || []),
    geographic_coverage: analyzeGeographicCoverage(sources || []),
    category_distribution: analyzeCategoryDistribution(mappings || []),
    performance_metrics: analyzePerformance(sources || [])
  };

  // Store intelligence data
  if (sources && sources.length > 0) {
    await supabase
      .from('global_source_intelligence')
      .insert({
        source_id: sources[0].id,
        intelligence_type: `global_${action}`,
        intelligence_data: analysis,
        confidence_level: analysis.intelligence_score,
        geographic_region: body.target_region || 'Global',
        auto_discovered: true
      });
  }

  return {
    success: true,
    action,
    intelligence_score: analysis.intelligence_score,
    analysis,
    timestamp: new Date().toISOString()
  };
}

function calculateIntelligenceScore(sources: any[], mappings: any[]): number {
  const sourceScore = Math.min(1, sources.length / 100);
  const mappingScore = Math.min(1, mappings.length / 500);
  const avgSuccessRate = sources.reduce((sum, s) => sum + (s.success_rate || 0.5), 0) / (sources.length || 1);
  
  return Math.round(((sourceScore + mappingScore + avgSuccessRate) / 3) * 100) / 100;
}

function analyzeGeographicCoverage(sources: any[]): any {
  const regions = sources.map(s => s.geographic_region || 'Unknown');
  const regionCounts = regions.reduce((acc, region) => {
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total_regions: Object.keys(regionCounts).length,
    distribution: regionCounts
  };
}

function analyzeCategoryDistribution(mappings: any[]): any {
  const categories = mappings.map(m => m.category);
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total_categories: Object.keys(categoryCounts).length,
    distribution: categoryCounts
  };
}

function analyzePerformance(sources: any[]): any {
  const avgSuccessRate = sources.reduce((sum, s) => sum + (s.success_rate || 0.5), 0) / (sources.length || 1);
  const activeSources = sources.filter(s => s.is_active !== false).length;

  return {
    average_success_rate: Math.round(avgSuccessRate * 100) / 100,
    active_sources: activeSources,
    total_sources: sources.length
  };
}