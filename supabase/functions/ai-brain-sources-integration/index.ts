import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🧠 AI Brain Sources Integration - Phase 1 Complete')
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all active sources for AI Brain integration (Multi-category)
    const [coinsResult, banknotesResult, bullionResult] = await Promise.all([
      supabaseClient.from('global_coin_sources').select('*').eq('is_active', true).order('priority', { ascending: true }),
      supabaseClient.from('global_banknote_sources').select('*').eq('is_active', true).order('priority', { ascending: true }),
      supabaseClient.from('global_bullion_sources').select('*').eq('is_active', true).order('priority', { ascending: true })
    ]);

    if (coinsResult.error) {
      console.error('❌ Error fetching coin sources:', coinsResult.error)
      throw coinsResult.error
    }

    if (banknotesResult.error) {
      console.error('❌ Error fetching banknote sources:', banknotesResult.error)
      throw banknotesResult.error
    }

    if (bullionResult.error) {
      console.error('❌ Error fetching bullion sources:', bullionResult.error)
      throw bullionResult.error
    }

    const sources = coinsResult.data || []
    const banknotes = banknotesResult.data || []
    const bullion = bullionResult.data || []

    console.log(`✅ Retrieved ${sources.length} coin sources, ${banknotes.length} banknote sources, ${bullion.length} bullion sources for AI Brain`)

    // All sources combined for comprehensive analysis
    const allSources = [...sources, ...banknotes, ...bullion]

    // Categorize sources for optimized AI Brain access
    const categorizedSources = {
      tier_1_premium: allSources.filter(s => s.priority === 1),
      tier_2_standard: allSources.filter(s => s.priority === 2), 
      tier_3_specialized: allSources.filter(s => s.priority === 3),
      by_category: {
        coins: sources.length,
        banknotes: banknotes.length,
        bullion: bullion.length
      },
      by_type: {
        dealers: sources.filter(s => s.source_type === 'dealer').length,
        official_mints: sources.filter(s => s.source_type === 'official_mint').length,
        official_banks: banknotes.filter(s => s.source_type === 'official_bank').length,
        grading_services: sources.filter(s => s.source_type === 'grading_service').length,
        auction_houses: sources.filter(s => s.source_type === 'auction_house').length,
        marketplaces: sources.filter(s => s.source_type === 'marketplace').length,
        bullion_dealers: bullion.filter(s => s.source_type === 'bullion_dealer').length,
        refineries: bullion.filter(s => s.source_type === 'refinery').length
      },
      by_country: allSources.reduce((acc, source) => {
        if (!acc[source.country]) acc[source.country] = []
        acc[source.country].push(source)
        return acc
      }, {} as Record<string, any[]>)
    }

    // Update AI configuration with integrated sources (Multi-category)
    const aiConfig = {
      total_sources: allSources.length,
      categories: {
        coins: sources.length,
        banknotes: banknotes.length,
        bullion: bullion.length
      },
      integration_status: 'PHASE_1_COMPLETE_EXPANDED',
      source_distribution: {
        tier_1_premium: categorizedSources.tier_1_premium.length,
        tier_2_standard: categorizedSources.tier_2_standard.length,
        tier_3_specialized: categorizedSources.tier_3_specialized.length
      },
      geographic_coverage: {
        countries: Object.keys(categorizedSources.by_country).length,
        major_markets: Object.keys(categorizedSources.by_country)
      },
      source_types: {
        dealers: categorizedSources.by_type.dealers,
        official_mints: categorizedSources.by_type.official_mints,
        official_banks: categorizedSources.by_type.official_banks,
        grading_services: categorizedSources.by_type.grading_services,
        auction_houses: categorizedSources.by_type.auction_houses,
        marketplaces: categorizedSources.by_type.marketplaces,
        bullion_dealers: categorizedSources.by_type.bullion_dealers,
        refineries: categorizedSources.by_type.refineries
      },
      capabilities: {
        real_time_web_discovery: true,
        multi_tier_source_prioritization: true,
        geographic_routing: true,
        intelligent_fallback_systems: true,
        comprehensive_price_aggregation: true,
        error_coin_specialist_integration: true,
        grading_service_validation: true,
        banknote_security_analysis: true,
        bullion_price_tracking: true,
        multi_category_analysis: true,
        multi_language_support: true
      },
      updated_at: new Date().toISOString()
    }

    // Store AI configuration
    const { error: configError } = await supabaseClient
      .from('ai_configuration')
      .upsert({ 
        id: 'main',
        config: aiConfig 
      })

    if (configError) {
      console.error('❌ Error updating AI config:', configError)
      throw configError
    }

    console.log(`🎯 AI Brain successfully integrated with ${allSources.length} sources across all categories`)
    console.log('📊 Multi-Category Source breakdown:')
    console.log(`   • Coins: ${sources.length} sources`)
    console.log(`   • Banknotes: ${banknotes.length} sources`)
    console.log(`   • Bullion: ${bullion.length} sources`)
    console.log('📊 By Type:')
    console.log(`   • Dealers: ${categorizedSources.by_type.dealers}`)
    console.log(`   • Official Mints: ${categorizedSources.by_type.official_mints}`)
    console.log(`   • Official Banks: ${categorizedSources.by_type.official_banks}`)
    console.log(`   • Grading Services: ${categorizedSources.by_type.grading_services}`)
    console.log(`   • Auction Houses: ${categorizedSources.by_type.auction_houses}`)
    console.log(`   • Marketplaces: ${categorizedSources.by_type.marketplaces}`)
    console.log(`   • Bullion Dealers: ${categorizedSources.by_type.bullion_dealers}`)
    console.log(`   • Refineries: ${categorizedSources.by_type.refineries}`)
    console.log(`🌍 Geographic coverage: ${Object.keys(categorizedSources.by_country).length} countries`)

    return new Response(
      JSON.stringify({
        status: 'PHASE_1_EXPANDED_INTEGRATION_COMPLETE',
        message: `AI Brain successfully integrated with ${allSources.length} sources across all categories`,
        categories: {
          coins: sources.length,
          banknotes: banknotes.length,
          bullion: bullion.length
        },
        total_sources: allSources.length,
        source_breakdown: categorizedSources.by_type,
        geographic_coverage: Object.keys(categorizedSources.by_country).length,
        capabilities: ['coins_and_errors', 'banknotes_security', 'bullion_pricing', 'multi_category_analysis'],
        ready_for_dealer_panel: true,
        ready_for_phase_2: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    console.error('❌ AI Brain integration error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'INTEGRATION_FAILED'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})