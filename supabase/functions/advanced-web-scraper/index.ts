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

// User agents for rotation
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      targetUrl, 
      coinQuery, 
      searchType = 'comprehensive',
      maxRetries = 3 
    } = await req.json();

    if (!targetUrl || !coinQuery) {
      throw new Error('Target URL and coin query are required');
    }

    console.log('🕸️ Advanced Web Scraper Starting...');
    console.log('Target:', targetUrl);
    console.log('Query:', coinQuery);
    console.log('Search Type:', searchType);

    const startTime = Date.now();
    
    // Phase 1: Smart Source Analysis
    const sourceAnalysis = await analyzeSource(targetUrl);
    
    // Phase 2: Intelligent Scraping with Anti-Detection
    const scrapingResult = await performIntelligentScraping(
      targetUrl, 
      coinQuery, 
      sourceAnalysis,
      maxRetries
    );
    
    // Phase 3: Data Extraction and Validation
    const extractedData = await extractAndValidateData(scrapingResult, coinQuery);
    
    // Phase 4: Update Source Performance
    await updateSourcePerformance(targetUrl, scrapingResult.success, Date.now() - startTime);
    
    const processingTime = Date.now() - startTime;
    
    console.log('✅ Advanced Web Scraping Complete');
    console.log('Processing Time:', processingTime + 'ms');
    console.log('Success Rate:', scrapingResult.success ? '100%' : '0%');

    return new Response(JSON.stringify({
      success: scrapingResult.success,
      data: extractedData,
      metadata: {
        source_url: targetUrl,
        processing_time: processingTime,
        user_agent_used: scrapingResult.userAgent,
        retry_count: scrapingResult.retryCount,
        data_points_found: extractedData.dataPoints?.length || 0,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 Advanced Web Scraper Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Advanced web scraping failed',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Phase 1: Analyze Source Characteristics
async function analyzeSource(url: string) {
  console.log('🔍 Analyzing source characteristics...');
  
  const domain = new URL(url).hostname;
  const knownSources = {
    'heritage.com': {
      type: 'auction_house',
      requiresJS: true,
      hasAntiBot: true,
      selectors: {
        price: '.lot-price, .current-bid',
        title: '.lot-title, h1',
        description: '.lot-description',
        images: '.lot-images img'
      },
      rateLimit: 2000 // ms between requests
    },
    'stacksbowers.com': {
      type: 'auction_house',
      requiresJS: true,
      hasAntiBot: true,
      selectors: {
        price: '.price, .estimate',
        title: '.title, h1',
        description: '.description'
      },
      rateLimit: 1500
    },
    'ma-shops.com': {
      type: 'marketplace',
      requiresJS: false,
      hasAntiBot: false,
      selectors: {
        price: '.price',
        title: '.item-title',
        description: '.item-desc'
      },
      rateLimit: 1000
    },
    'coinarchives.com': {
      type: 'database',
      requiresJS: false,
      hasAntiBot: false,
      rateLimit: 800
    },
    'ebay.com': {
      type: 'marketplace',
      requiresJS: true,
      hasAntiBot: true,
      selectors: {
        price: '.price, .bin-price',
        title: '.title',
        condition: '.condition'
      },
      rateLimit: 3000
    }
  };

  // Find matching source configuration
  const sourceConfig = Object.entries(knownSources).find(([key]) => 
    domain.includes(key)
  )?.[1] || {
    type: 'unknown',
    requiresJS: true,
    hasAntiBot: true,
    rateLimit: 2000
  };

  return {
    domain,
    config: sourceConfig,
    requiresSpecialHandling: sourceConfig.hasAntiBot
  };
}

// Phase 2: Intelligent Scraping with Anti-Detection
async function performIntelligentScraping(
  url: string, 
  query: any, 
  sourceAnalysis: any,
  maxRetries: number
) {
  console.log('🤖 Starting intelligent scraping with anti-detection...');
  
  let attempt = 0;
  let lastError = null;
  
  while (attempt < maxRetries) {
    try {
      const userAgent = USER_AGENTS[attempt % USER_AGENTS.length];
      console.log(`Attempt ${attempt + 1}/${maxRetries} with User-Agent: ${userAgent.substring(0, 50)}...`);
      
      // Add delay for rate limiting
      if (attempt > 0) {
        await delay(sourceAnalysis.config.rateLimit * (attempt + 1));
      }
      
      const searchResult = await performSingleScrape(url, query, userAgent, sourceAnalysis);
      
      if (searchResult.success) {
        return {
          success: true,
          data: searchResult.data,
          userAgent,
          retryCount: attempt,
          responseTime: searchResult.responseTime
        };
      }
      
      lastError = searchResult.error;
      
    } catch (error) {
      console.warn(`Scraping attempt ${attempt + 1} failed:`, error.message);
      lastError = error;
    }
    
    attempt++;
  }
  
  return {
    success: false,
    error: lastError,
    retryCount: attempt,
    userAgent: USER_AGENTS[0]
  };
}

// Single scrape attempt with advanced techniques
async function performSingleScrape(url: string, query: any, userAgent: string, sourceAnalysis: any) {
  const startTime = Date.now();
  
  // Build search URL based on source type
  const searchUrl = buildSearchUrl(url, query, sourceAnalysis);
  
  console.log('🌐 Fetching:', searchUrl);
  
  const response = await fetch(searchUrl, {
    method: 'GET',
    headers: {
      'User-Agent': userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'max-age=0'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const html = await response.text();
  const responseTime = Date.now() - startTime;
  
  // Basic bot detection check
  if (html.includes('captcha') || html.includes('blocked') || html.includes('Access Denied')) {
    throw new Error('Bot detection triggered');
  }
  
  return {
    success: true,
    data: html,
    responseTime,
    contentLength: html.length
  };
}

// Build search URL based on source and coin query
function buildSearchUrl(baseUrl: string, query: any, sourceAnalysis: any): string {
  const domain = sourceAnalysis.domain;
  const searchTerm = buildSearchTerm(query);
  
  // Source-specific URL patterns
  if (domain.includes('heritage.com')) {
    return `${baseUrl}/search?q=${encodeURIComponent(searchTerm)}&category=coins`;
  } else if (domain.includes('stacksbowers.com')) {
    return `${baseUrl}/search?query=${encodeURIComponent(searchTerm)}`;
  } else if (domain.includes('ma-shops.com')) {
    return `${baseUrl}/search.php?what=${encodeURIComponent(searchTerm)}`;
  } else if (domain.includes('coinarchives.com')) {
    return `${baseUrl}/search.php?search=${encodeURIComponent(searchTerm)}`;
  } else if (domain.includes('ebay.com')) {
    return `${baseUrl}/sch/i.html?_nkw=${encodeURIComponent(searchTerm)}&_sacat=11116`;
  }
  
  // Generic search pattern
  return `${baseUrl}/search?q=${encodeURIComponent(searchTerm)}`;
}

// Build search term from coin analysis
function buildSearchTerm(query: any): string {
  const parts = [];
  
  if (query.country && query.country !== 'Unknown') parts.push(query.country);
  if (query.year) parts.push(query.year.toString());
  if (query.denomination && query.denomination !== 'Unknown') parts.push(query.denomination);
  if (query.name && query.name !== 'Unidentified Coin') {
    parts.push(query.name.replace(/\b(coin|currency|money)\b/gi, '').trim());
  }
  
  return parts.join(' ').trim() || 'coin';
}

// Phase 3: Extract and Validate Data
async function extractAndValidateData(scrapingResult: any, query: any) {
  if (!scrapingResult.success) {
    return {
      dataPoints: [],
      prices: [],
      descriptions: [],
      confidence: 0
    };
  }
  
  console.log('📊 Extracting and validating data...');
  
  const html = scrapingResult.data;
  const dataPoints = [];
  
  // Extract prices using multiple patterns
  const pricePatterns = [
    /\$[\d,]+\.?\d*/g,
    /USD\s*[\d,]+\.?\d*/g,
    /€[\d,]+\.?\d*/g,
    /£[\d,]+\.?\d*/g,
    /Price:\s*\$?[\d,]+\.?\d*/g,
    /\bsold\s+for\s+\$?[\d,]+\.?\d*/gi
  ];
  
  const prices = [];
  for (const pattern of pricePatterns) {
    const matches = html.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const price = parseFloat(match.replace(/[^\d.]/g, ''));
        if (price > 0 && price < 1000000) { // Reasonable price range
          prices.push(price);
        }
      });
    }
  }
  
  // Extract descriptions and titles
  const titlePatterns = [
    /<title[^>]*>([^<]+)</gi,
    /<h1[^>]*>([^<]+)</gi,
    /<h2[^>]*>([^<]+)</gi
  ];
  
  const descriptions = [];
  for (const pattern of titlePatterns) {
    const matches = html.matchAll(pattern);
    for (const match of matches) {
      const text = match[1].trim();
      if (text.length > 10 && text.length < 200) {
        descriptions.push(cleanText(text));
      }
    }
  }
  
  // Calculate confidence based on data quality
  const confidence = calculateDataConfidence(prices, descriptions, query);
  
  return {
    dataPoints: dataPoints.slice(0, 20), // Limit results
    prices: [...new Set(prices)].slice(0, 10), // Remove duplicates, limit
    descriptions: [...new Set(descriptions)].slice(0, 10),
    confidence,
    htmlLength: html.length
  };
}

// Phase 4: Update Source Performance
async function updateSourcePerformance(url: string, success: boolean, responseTime: number) {
  console.log('📈 Updating source performance metrics...');
  
  try {
    const domain = new URL(url).hostname;
    
    await supabase.rpc('update_source_success_rate', {
      source_url: `https://${domain}`,
      was_successful: success,
      response_time: Math.round(responseTime)
    });
    
    console.log('✅ Source performance updated');
  } catch (error) {
    console.warn('⚠️ Failed to update source performance:', error);
  }
}

// Helper Functions
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanText(text: string): string {
  return text
    .replace(/&[a-zA-Z0-9#]+;/g, '') // Remove HTML entities
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

function calculateDataConfidence(prices: number[], descriptions: string[], query: any): number {
  let confidence = 0.2; // Base confidence
  
  if (prices.length > 0) confidence += 0.3;
  if (prices.length >= 3) confidence += 0.2;
  if (descriptions.length > 0) confidence += 0.2;
  
  // Check if descriptions match query
  const queryTerms = [query.country, query.year?.toString(), query.denomination]
    .filter(Boolean)
    .map(term => term.toLowerCase());
  
  const matchingDescriptions = descriptions.filter(desc => {
    const lowerDesc = desc.toLowerCase();
    return queryTerms.some(term => lowerDesc.includes(term));
  });
  
  if (matchingDescriptions.length > 0) confidence += 0.3;
  
  return Math.min(1.0, confidence);
}