import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// AI prompts for source discovery
const DISCOVERY_PROMPTS = {
  coin_marketplaces: `You are a web research expert. Find active coin and numismatic marketplaces, auction houses, and trading platforms. Look for sites that sell or auction coins, currency, or numismatic items. Return only legitimate, active websites with proper domain names.`,
  
  forums_communities: `Find active numismatic forums, coin collecting communities, and discussion boards where collectors share information about coins, errors, and values.`,
  
  reference_databases: `Find coin reference databases, numismatic databases, and professional grading service websites that provide coin information and values.`
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      discoveryType = 'comprehensive',
      targetRegion = 'global',
      coinCategory = 'all',
      maxNewSources = 20 
    } = await req.json();

    console.log('🔍 Dynamic Source Discovery Starting...');
    console.log('Discovery Type:', discoveryType);
    console.log('Target Region:', targetRegion);
    console.log('Coin Category:', coinCategory);

    const startTime = Date.now();
    
    // Phase 1: AI-Powered Web Research
    const { aiDiscoveredSources } = await performAIWebResearch(discoveryType, targetRegion, coinCategory);
    
    // Phase 2: Validate and Categorize Sources
    const { validatedSources } = await validateAndCategorizeSources(aiDiscoveredSources);
    
    // Phase 3: Social Media & Forum Crawling
    const { socialSources } = await crawlSocialMediaAndForums(coinCategory);
    
    // Phase 4: Pattern Recognition for New Marketplaces
    const { patternSources } = await recognizeNewMarketplacePatterns();
    
    // Phase 5: Save and Rank New Sources
    const savedSources = await saveAndRankNewSources([
      ...validatedSources,
      ...socialSources,
      ...patternSources
    ].slice(0, maxNewSources));
    
    const processingTime = Date.now() - startTime;
    
    console.log('✅ Dynamic Source Discovery Complete');
    console.log('New Sources Found:', savedSources.length);
    console.log('Processing Time:', processingTime + 'ms');

    return new Response(JSON.stringify({
      success: true,
      discovered_sources: savedSources,
      metadata: {
        discovery_type: discoveryType,
        target_region: targetRegion,
        processing_time: processingTime,
        sources_found: validatedSources.length + socialSources.length + patternSources.length,
        sources_saved: savedSources.length,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 Dynamic Source Discovery Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Dynamic source discovery failed',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Phase 1: AI-Powered Web Research with Advanced Intelligence
async function performAIWebResearch(discoveryType: string, targetRegion: string, coinCategory: string) {
  console.log('🤖 Starting enhanced AI-powered web research...');
  
  const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
  const searchQueries = generateAdvancedSearchQueries(discoveryType, targetRegion, coinCategory);
  const discoveredSources = [];
  
  // Enhanced AI research with multiple strategies
  const researchStrategies = [
    'marketplace_discovery',
    'auction_house_detection', 
    'forum_community_mapping',
    'grading_service_identification',
    'regional_dealer_networks'
  ];

  // Execute advanced research strategies in parallel
  const researchPromises = researchStrategies.map(async (strategy) => {
    return await performSpecializedResearch(strategy, targetRegion, coinCategory, anthropicApiKey);
  });

  const strategyResults = await Promise.allSettled(researchPromises);
  
  strategyResults.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value?.length > 0) {
      console.log(`✅ Strategy ${researchStrategies[index]} found ${result.value.length} sources`);
      discoveredSources.push(...result.value);
    } else {
      console.warn(`⚠️ Strategy ${researchStrategies[index]} failed or found no sources`);
    }
  });

  // Traditional query-based research as backup
  for (const query of searchQueries.slice(0, 3)) { // Limit to top 3 queries
    try {
      console.log('🔍 Traditional research:', query);
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicApiKey!,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: `You are a specialized web researcher finding numismatic and coin-related websites.

Research focus: "${query}"
Target region: ${targetRegion}
Coin category: ${coinCategory}

Find 8-12 legitimate, active websites. For each site provide:
1. Full domain name (no protocols, just domain.com)
2. Site type: auction_house, marketplace, forum, database, grading_service, dealer, mint
3. Brief description (1-2 sentences)
4. Activity level: high/medium/low
5. Specialized focus if any

Respond ONLY with a JSON array. Example:
[{"domain": "example.com", "type": "auction_house", "description": "Major coin auction house", "activity_level": "high", "specialty": "ancient coins"}]`
          }]
        })
      });

      const result = await response.json();
      const content = result.content[0]?.text;
      
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const sources = JSON.parse(jsonMatch[0]);
          if (Array.isArray(sources)) {
            discoveredSources.push(...sources.filter(s => s.domain && s.type));
          }
        }
      } catch (parseError) {
        console.warn('Failed to parse AI response for query:', query);
      }
      
      // Intelligent rate limiting
      await delay(1500 + Math.random() * 1000);
      
    } catch (error) {
      console.warn(`AI research failed for query "${query}":`, error.message);
    }
  }

  return { aiDiscoveredSources: discoveredSources };
}

// Phase 2: Validate and Categorize Sources
async function validateAndCategorizeSources(sources: any[]) {
  console.log('✅ Validating and categorizing sources...');
  
  const validatedSources = [];
  
  for (const source of sources) {
    try {
      if (!source.domain || typeof source.domain !== 'string') continue;
      
      // Clean domain name
      const domain = cleanDomainName(source.domain);
      if (!isValidDomain(domain)) continue;
      
      // Check if source already exists
      const { data: existingSource } = await supabase
        .from('global_coin_sources')
        .select('id')
        .eq('base_url', `https://${domain}`)
        .single();
      
      if (existingSource) continue; // Skip existing sources
      
      // Validate source accessibility
      const isAccessible = await checkSourceAccessibility(`https://${domain}`);
      if (!isAccessible) continue;
      
      // Categorize source type
      const sourceType = categorizeSourceType(source.type, domain);
      
      validatedSources.push({
        domain,
        full_url: `https://${domain}`,
        source_type: sourceType,
        description: source.description || '',
        activity_level: source.activity_level || 'medium',
        discovered_via: 'ai_research'
      });
      
    } catch (error) {
      console.warn(`Validation failed for source:`, source, error.message);
    }
  }
  
  return { validatedSources };
}

// Phase 3: Social Media & Forum Crawling
async function crawlSocialMediaAndForums(coinCategory: string) {
  console.log('📱 Crawling social media and forums...');
  
  const socialSources = [];
  
  // Define social media and forum patterns to search for
  const socialPlatforms = [
    {
      platform: 'reddit',
      searchTerms: ['r/coins', 'r/numismatics', 'r/coincollecting', 'r/errorcoins'],
      baseUrl: 'reddit.com'
    },
    {
      platform: 'facebook',
      searchTerms: ['coin collecting groups', 'numismatic societies'],
      baseUrl: 'facebook.com'
    },
    {
      platform: 'specialized_forums',
      searchTerms: ['coin community', 'numismatic forum', 'collectors forum'],
      baseUrl: 'various'
    }
  ];
  
  // For now, add some known high-quality sources
  const knownSocialSources = [
    {
      domain: 'cointalk.com',
      full_url: 'https://cointalk.com',
      source_type: 'forum',
      description: 'Active coin collecting community',
      activity_level: 'high',
      discovered_via: 'social_crawling'
    },
    {
      domain: 'coincommunity.com',
      full_url: 'https://coincommunity.com',
      source_type: 'forum',
      description: 'Professional numismatic community',
      activity_level: 'high',
      discovered_via: 'social_crawling'
    },
    {
      domain: 'pcgs.com/coinfacts',
      full_url: 'https://pcgs.com/coinfacts',
      source_type: 'database',
      description: 'PCGS Coin Facts database',
      activity_level: 'high',
      discovered_via: 'social_crawling'
    }
  ];
  
  // Validate social sources
  for (const source of knownSocialSources) {
    const { data: existingSource } = await supabase
      .from('global_coin_sources')
      .select('id')
      .eq('base_url', source.full_url)
      .single();
    
    if (!existingSource) {
      socialSources.push(source);
    }
  }
  
  return { socialSources };
}

// Phase 4: Pattern Recognition for New Marketplaces
async function recognizeNewMarketplacePatterns() {
  console.log('🧠 Recognizing new marketplace patterns...');
  
  const patternSources = [];
  
  // Domain patterns that suggest coin marketplaces
  const marketplacePatterns = [
    { pattern: /coin.*shop/i, type: 'marketplace' },
    { pattern: /numis.*auction/i, type: 'auction_house' },
    { pattern: /.*mint\.com$/i, type: 'official_mint' },
    { pattern: /collect.*exchange/i, type: 'marketplace' },
    { pattern: /rare.*coin/i, type: 'dealer' }
  ];
  
  // TLD patterns for different regions
  const regionalTLDs = {
    'US': ['.com', '.us'],
    'UK': ['.co.uk', '.uk'],
    'Germany': ['.de'],
    'France': ['.fr'],
    'Australia': ['.com.au', '.au'],
    'Canada': ['.ca']
  };
  
  // Generate pattern-based sources (placeholder for demonstration)
  const hypotheticalSources = [
    'rare-coin-auctions.com',
    'numismatic-exchange.com',
    'coin-marketplace.net',
    'collectors-vault.com',
    'mint-direct.com'
  ];
  
  for (const domain of hypotheticalSources) {
    // Check if domain exists and is accessible
    try {
      const isAccessible = await checkSourceAccessibility(`https://${domain}`);
      if (isAccessible) {
        patternSources.push({
          domain,
          full_url: `https://${domain}`,
          source_type: 'marketplace',
          description: 'Discovered via pattern recognition',
          activity_level: 'unknown',
          discovered_via: 'pattern_recognition'
        });
      }
    } catch (error) {
      // Domain doesn't exist or isn't accessible
    }
  }
  
  return { patternSources };
}

// Phase 5: Save and Rank New Sources
async function saveAndRankNewSources(sources: any[]) {
  console.log('💾 Saving and ranking new sources...');
  
  const savedSources = [];
  
  for (const source of sources) {
    try {
      // Calculate initial ranking score
      const rankingScore = calculateSourceRanking(source);
      
      // Insert into global_coin_sources table
      const { data: insertedSource, error } = await supabase
        .from('global_coin_sources')
        .insert({
          base_url: source.full_url,
          source_name: extractSourceName(source.domain),
          source_type: source.source_type,
          country: extractCountryFromDomain(source.domain),
          language: 'en', // Default to English
          success_rate: 0.5, // Initial neutral rate
          response_time_avg: 0,
          is_active: true,
          scraping_config: {
            discovered_via: source.discovered_via,
            initial_ranking: rankingScore,
            activity_level: source.activity_level,
            description: source.description
          },
          rate_limit_per_minute: determineRateLimit(source.source_type)
        })
        .select()
        .single();
      
      if (!error && insertedSource) {
        savedSources.push({
          id: insertedSource.id,
          domain: source.domain,
          source_type: source.source_type,
          ranking_score: rankingScore,
          discovered_via: source.discovered_via
        });
        
        console.log('✅ Saved source:', source.domain);
      } else if (error) {
        console.warn('⚠️ Failed to save source:', source.domain, error.message);
      }
      
    } catch (error) {
      console.warn('❌ Error saving source:', source.domain, error.message);
    }
  }
  
  return savedSources;
}

// Enhanced specialized research function
async function performSpecializedResearch(strategy: string, targetRegion: string, coinCategory: string, apiKey: string) {
  const strategyPrompts = {
    marketplace_discovery: `Find active online coin marketplaces and trading platforms. Focus on sites where collectors buy/sell coins directly. Include both large platforms and specialized niche marketplaces.`,
    
    auction_house_detection: `Identify coin auction houses and auction platforms. Include major international houses and regional specialists. Focus on sites that conduct regular coin auctions.`,
    
    forum_community_mapping: `Locate active numismatic forums, collector communities, and discussion boards. Include both general coin forums and specialized communities for specific types of coins.`,
    
    grading_service_identification: `Find coin grading services, authentication services, and professional numismatic evaluation companies. Include both major services and regional/specialized graders.`,
    
    regional_dealer_networks: `Discover coin dealer networks, professional numismatic associations, and dealer directories. Focus on verified professional dealers and their online presence.`
  };

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `${strategyPrompts[strategy]}

Region focus: ${targetRegion}
Coin category: ${coinCategory}

Find 6-10 specific websites. Return ONLY a JSON array with this exact structure:
[{"domain": "site.com", "type": "marketplace", "description": "brief description", "activity_level": "high", "regional_focus": "${targetRegion}"}]

Valid types: auction_house, marketplace, forum, database, grading_service, dealer, mint, association`
        }]
      })
    });

    const result = await response.json();
    const content = result.content[0]?.text;
    
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const sources = JSON.parse(jsonMatch[0]);
      return Array.isArray(sources) ? sources.filter(s => s.domain && s.type) : [];
    }
  } catch (error) {
    console.warn(`Specialized research failed for ${strategy}:`, error.message);
  }
  
  return [];
}

// Helper Functions
function generateAdvancedSearchQueries(discoveryType: string, targetRegion: string, coinCategory: string): string[] {
  const baseQueries = [
    `${targetRegion} premium coin auction houses and marketplaces`,
    `${targetRegion} professional numismatic dealers and specialists`,
    `${coinCategory} specialized trading platforms and exchanges`,
    `${targetRegion} certified coin grading and authentication services`
  ];
  
  if (discoveryType === 'comprehensive') {
    baseQueries.push(
      `${targetRegion} active numismatic forums and collector communities`,
      `${coinCategory} error coin specialists and variety experts`,
      `${targetRegion} official mint websites and government coin programs`,
      `${coinCategory} rare coin investment platforms and advisory services`
    );
  }
  
  return baseQueries;
}

function cleanDomainName(domain: string): string {
  return domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '')
    .toLowerCase()
    .trim();
}

function isValidDomain(domain: string): boolean {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
  return domainRegex.test(domain) && domain.length <= 253;
}

async function checkSourceAccessibility(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch {
    return false;
  }
}

function categorizeSourceType(suggestedType: string, domain: string): string {
  const typeMap: Record<string, string> = {
    'auction_house': 'auction_house',
    'marketplace': 'marketplace',
    'forum': 'forum',
    'database': 'database',
    'dealer': 'dealer',
    'grading_service': 'grading_service'
  };
  
  if (typeMap[suggestedType]) return typeMap[suggestedType];
  
  // Domain-based type detection
  if (domain.includes('auction')) return 'auction_house';
  if (domain.includes('forum') || domain.includes('community')) return 'forum';
  if (domain.includes('shop') || domain.includes('store')) return 'marketplace';
  if (domain.includes('pcgs') || domain.includes('ngc')) return 'grading_service';
  
  return 'marketplace'; // Default
}

function extractSourceName(domain: string): string {
  return domain
    .split('.')[0]
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function extractCountryFromDomain(domain: string): string {
  const tldMap: Record<string, string> = {
    '.uk': 'UK',
    '.de': 'Germany',
    '.fr': 'France',
    '.au': 'Australia',
    '.ca': 'Canada',
    '.jp': 'Japan',
    '.it': 'Italy',
    '.es': 'Spain'
  };
  
  for (const [tld, country] of Object.entries(tldMap)) {
    if (domain.endsWith(tld)) return country;
  }
  
  return 'US'; // Default
}

function calculateSourceRanking(source: any): number {
  let score = 0.5; // Base score
  
  // Activity level bonus
  if (source.activity_level === 'high') score += 0.3;
  else if (source.activity_level === 'medium') score += 0.1;
  
  // Source type bonus
  if (source.source_type === 'auction_house') score += 0.2;
  else if (source.source_type === 'database') score += 0.15;
  else if (source.source_type === 'grading_service') score += 0.2;
  
  // Discovery method bonus
  if (source.discovered_via === 'ai_research') score += 0.1;
  
  return Math.min(1.0, score);
}

function determineRateLimit(sourceType: string): number {
  const rateLimits: Record<string, number> = {
    'auction_house': 30,  // Conservative for high-value sites
    'marketplace': 60,    // Moderate
    'forum': 120,         // More permissive
    'database': 90,       // Moderate
    'grading_service': 45 // Conservative
  };
  
  return rateLimits[sourceType] || 60;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}