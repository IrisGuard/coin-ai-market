import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SourceDiscoveryConfig {
  id: string;
  discovery_type: string;
  search_patterns: string[];
  target_regions: string[];
  quality_threshold: number;
  max_sources_per_run: number;
}

interface NewSource {
  source_name: string;
  base_url: string;
  source_type: string;
  priority: number;
  success_rate: number;
  multi_category_support: boolean;
  supported_categories: string[];
  geographic_region: string;
  language_support: string[];
  auto_discovered: boolean;
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

    console.log('🚀 Starting Autonomous Source Discovery...');

    // Step 1: Get discovery configurations
    const { data: configs, error: configError } = await supabaseClient
      .from('source_discovery_config')
      .select('*')
      .eq('is_active', true)
      .order('quality_threshold', { ascending: false });

    if (configError) {
      throw new Error(`Failed to fetch discovery configs: ${configError.message}`);
    }

    let totalSourcesDiscovered = 0;
    const discoveryResults: any[] = [];

    // Step 2: Execute discovery for each configuration
    for (const config of configs as SourceDiscoveryConfig[]) {
      console.log(`🔍 Discovering sources for: ${config.discovery_type}`);
      
      const sourceResults = await discoverSourcesForConfig(config);
      
      // Step 3: Process and validate discovered sources
      for (const source of sourceResults) {
        const validated = await validateNewSource(source, supabaseClient);
        if (validated) {
          await insertNewSource(validated, supabaseClient);
          totalSourcesDiscovered++;
        }
      }

      // Update last run timestamp
      await supabaseClient
        .from('source_discovery_config')
        .update({ last_run: new Date().toISOString() })
        .eq('id', config.id);

      discoveryResults.push({
        config_type: config.discovery_type,
        sources_found: sourceResults.length,
        sources_validated: sourceResults.filter(s => s.quality_score >= config.quality_threshold).length
      });
    }

    // Step 4: Update global intelligence network
    await updateGlobalIntelligence(supabaseClient, discoveryResults);

    // Step 5: Populate source category mappings for new sources
    await populateSourceCategoryMappings(supabaseClient);

    const result = {
      success: true,
      total_sources_discovered: totalSourcesDiscovered,
      discovery_results: discoveryResults,
      timestamp: new Date().toISOString(),
      next_discovery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    console.log('✅ Autonomous Discovery Completed:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Autonomous Discovery Error:', error);
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

async function discoverSourcesForConfig(config: SourceDiscoveryConfig): Promise<any[]> {
  const sources: any[] = [];
  
  // Simulate discovery based on config type
  switch (config.discovery_type) {
    case 'auction_houses':
      sources.push(
        ...await discoverAuctionHouses(config.search_patterns, config.target_regions)
      );
      break;
    case 'dealer_shops':
      sources.push(
        ...await discoverDealerShops(config.search_patterns, config.target_regions)
      );
      break;
    case 'marketplace_platforms':
      sources.push(
        ...await discoverMarketplaces(config.search_patterns, config.target_regions)
      );
      break;
    case 'specialized_sources':
      sources.push(
        ...await discoverSpecializedSources(config.search_patterns, config.target_regions)
      );
      break;
  }
  
  return sources.slice(0, config.max_sources_per_run);
}

async function discoverAuctionHouses(patterns: string[], regions: string[]): Promise<NewSource[]> {
  // In a real implementation, this would use web scraping or APIs
  // For now, we'll return simulated high-quality auction house discoveries
  return [
    {
      source_name: 'CNG (Classical Numismatic Group)',
      base_url: 'https://www.cngcoins.com',
      source_type: 'auction_house',
      priority: 9,
      success_rate: 0.92,
      multi_category_support: true,
      supported_categories: ['coins', 'ancient', 'world'],
      geographic_region: 'US',
      language_support: ['en'],
      auto_discovered: true
    },
    {
      source_name: 'Spink & Son',
      base_url: 'https://www.spink.com',
      source_type: 'auction_house',
      priority: 9,
      success_rate: 0.91,
      multi_category_support: true,
      supported_categories: ['coins', 'banknotes', 'medals'],
      geographic_region: 'UK',
      language_support: ['en'],
      auto_discovered: true
    }
  ];
}

async function discoverDealerShops(patterns: string[], regions: string[]): Promise<NewSource[]> {
  return [
    {
      source_name: 'Coin World',
      base_url: 'https://www.coinworld.com',
      source_type: 'dealer_platform',
      priority: 8,
      success_rate: 0.88,
      multi_category_support: true,
      supported_categories: ['coins', 'collectibles', 'bullion'],
      geographic_region: 'US',
      language_support: ['en'],
      auto_discovered: true
    }
  ];
}

async function discoverMarketplaces(patterns: string[], regions: string[]): Promise<NewSource[]> {
  return [
    {
      source_name: 'Numista Marketplace',
      base_url: 'https://en.numista.com',
      source_type: 'marketplace',
      priority: 8,
      success_rate: 0.85,
      multi_category_support: true,
      supported_categories: ['coins', 'world', 'modern'],
      geographic_region: 'Global',
      language_support: ['en', 'fr', 'de', 'es'],
      auto_discovered: true
    }
  ];
}

async function discoverSpecializedSources(patterns: string[], regions: string[]): Promise<NewSource[]> {
  return [
    {
      source_name: 'Error-Ref.com',
      base_url: 'https://www.error-ref.com',
      source_type: 'specialist',
      priority: 10,
      success_rate: 0.94,
      multi_category_support: true,
      supported_categories: ['error_coins', 'varieties'],
      geographic_region: 'US',
      language_support: ['en'],
      auto_discovered: true
    }
  ];
}

async function validateNewSource(source: NewSource, supabase: any): Promise<NewSource | null> {
  try {
    // Check if source already exists
    const { data: existing } = await supabase
      .from('global_coin_sources')
      .select('id')
      .eq('base_url', source.base_url)
      .single();

    if (existing) {
      console.log(`Source already exists: ${source.source_name}`);
      return null;
    }

    // Basic validation
    if (!source.base_url || !source.source_name) {
      return null;
    }

    // URL validation
    try {
      new URL(source.base_url);
    } catch {
      return null;
    }

    return source;
  } catch (error) {
    console.error('Validation error:', error);
    return null;
  }
}

async function insertNewSource(source: NewSource, supabase: any): Promise<void> {
  try {
    const { error } = await supabase
      .from('global_coin_sources')
      .insert({
        source_name: source.source_name,
        base_url: source.base_url,
        source_type: source.source_type,
        priority: source.priority,
        success_rate: source.success_rate,
        multi_category_support: source.multi_category_support,
        supported_categories: source.supported_categories,
        geographic_region: source.geographic_region,
        language_support: source.language_support,
        auto_discovered: source.auto_discovered,
        is_active: true,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Insert error:', error);
    } else {
      console.log(`✅ Added new source: ${source.source_name}`);
    }
  } catch (error) {
    console.error('Insert source error:', error);
  }
}

async function updateGlobalIntelligence(supabase: any, results: any[]): Promise<void> {
  for (const result of results) {
    await supabase
      .from('global_source_intelligence')
      .insert({
        source_id: null, // Will be updated when we have specific source IDs
        intelligence_type: 'discovery_analytics',
        intelligence_data: result,
        confidence_level: 0.8,
        geographic_region: 'Global',
        auto_discovered: true
      });
  }
}

async function populateSourceCategoryMappings(supabase: any): Promise<void> {
  // Get all recently discovered sources
  const { data: newSources } = await supabase
    .from('global_coin_sources')
    .select('id, supported_categories')
    .eq('auto_discovered', true)
    .is('updated_at', null);

  if (!newSources) return;

  for (const source of newSources) {
    for (const category of source.supported_categories || []) {
      await supabase
        .from('source_category_mapping')
        .insert({
          source_id: source.id,
          category: category,
          search_template: `${category} {query} collectible`,
          priority: 8,
          success_rate: 0.8
        });
    }
  }
}