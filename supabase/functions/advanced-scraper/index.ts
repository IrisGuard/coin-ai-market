
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

    const { job_id, target_url, job_type, proxy_config } = await req.json();

    console.log(`Starting scraping job ${job_id} for ${target_url}`);

    // Update job status to running
    await supabase
      .from('scraping_jobs')
      .update({ 
        status: 'running', 
        started_at: new Date().toISOString() 
      })
      .eq('id', job_id);

    let fetchOptions: any = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
      }
    };

    // Add proxy configuration if provided
    if (proxy_config) {
      console.log(`Using proxy: ${proxy_config.endpoint}:${proxy_config.port}`);
      // In a real implementation, you would configure the proxy here
      // For demo purposes, we're just logging it
    }

    const response = await fetch(target_url, fetchOptions);
    const html = await response.text();

    let extractedData = {};

    // Extract coin data based on job type
    if (job_type === 'coin_data') {
      extractedData = extractCoinData(html, target_url);
    } else if (job_type === 'market_prices') {
      extractedData = extractMarketPrices(html, target_url);
    } else if (job_type === 'auction_results') {
      extractedData = extractAuctionResults(html, target_url);
    }

    // Store results in cache
    if (Object.keys(extractedData).length > 0) {
      await supabase
        .from('coin_data_cache')
        .insert({
          coin_identifier: extractedData.name || 'unknown',
          source_name: getDomainFromUrl(target_url),
          data_type: job_type.replace('_', '_'),
          raw_data: { html_snippet: html.substring(0, 1000) },
          processed_data: extractedData,
          confidence_score: calculateConfidenceScore(extractedData),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        });
    }

    // Update job status to completed
    await supabase
      .from('scraping_jobs')
      .update({ 
        status: 'completed',
        results: extractedData,
        completed_at: new Date().toISOString()
      })
      .eq('id', job_id);

    console.log(`Scraping job ${job_id} completed successfully`);

    return new Response(JSON.stringify({ 
      success: true, 
      data: extractedData,
      message: 'Scraping completed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Scraping error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Scraping failed', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractCoinData(html: string, url: string): any {
  const data: any = {};
  
  // Extract coin name
  const nameMatch = html.match(/<title[^>]*>([^<]+)/i);
  if (nameMatch) {
    data.name = nameMatch[1].replace(/[^\w\s-]/g, '').trim();
  }

  // Extract year (looking for 4-digit years)
  const yearMatch = html.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    data.year = parseInt(yearMatch[0]);
  }

  // Extract price patterns
  const priceMatch = html.match(/\$[\d,]+\.?\d*/g);
  if (priceMatch) {
    data.estimated_value = parseFloat(priceMatch[0].replace(/[$,]/g, ''));
  }

  // Extract grade information
  const gradeMatch = html.match(/\b(MS|AU|XF|VF|F|VG|G|AG|PR)\s*\d+\b/i);
  if (gradeMatch) {
    data.grade = gradeMatch[0];
  }

  return data;
}

function extractMarketPrices(html: string, url: string): any {
  const data: any = {};
  
  // Extract current market price
  const priceMatches = html.match(/\$[\d,]+\.?\d*/g);
  if (priceMatches && priceMatches.length > 0) {
    data.current_price = parseFloat(priceMatches[0].replace(/[$,]/g, ''));
    data.price_history = priceMatches.slice(0, 5).map(p => parseFloat(p.replace(/[$,]/g, '')));
  }

  return data;
}

function extractAuctionResults(html: string, url: string): any {
  const data: any = {};
  
  // Extract auction results
  const soldMatch = html.match(/sold[\s\S]*?\$[\d,]+\.?\d*/i);
  if (soldMatch) {
    const priceMatch = soldMatch[0].match(/\$[\d,]+\.?\d*/);
    if (priceMatch) {
      data.sold_price = parseFloat(priceMatch[0].replace(/[$,]/g, ''));
    }
  }

  return data;
}

function getDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return 'unknown';
  }
}

function calculateConfidenceScore(data: any): number {
  let score = 0.5;
  
  if (data.name) score += 0.2;
  if (data.year) score += 0.1;
  if (data.estimated_value || data.current_price) score += 0.15;
  if (data.grade) score += 0.05;
  
  return Math.min(score, 1.0);
}
