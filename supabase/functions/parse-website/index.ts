
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
    const { url, instructions, commandId } = await req.json()
    
    console.log('🔍 Parse website request:', { url, commandId, instructionsLength: instructions?.length })

    if (!url) {
      throw new Error('URL is required')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch the website content
    console.log('🌐 Fetching website content from:', url)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`)
    }

    const html = await response.text()
    console.log('✅ Website content fetched, length:', html.length)

    // Extract key information from the HTML
    const result = await parseWebsiteContent(html, url, instructions)
    
    console.log('🎯 Parsing result:', result)

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    console.error('❌ Parse website error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'failed',
        timestamp: new Date().toISOString()
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})

async function parseWebsiteContent(html: string, url: string, instructions: string) {
  // Extract basic coin information from HTML
  const coinData: any = {
    status: 'completed',
    url: url,
    timestamp: new Date().toISOString(),
    extractedData: {}
  }

  // Common patterns for coin information
  const patterns = {
    year: /\b(19|20)\d{2}\b/g,
    price: /\$[\d,]+\.?\d*/g,
    grade: /(MS|PR|PF|AU|XF|VF|F|VG|G|AG)\s*\d*/gi,
    metal: /(gold|silver|copper|bronze|nickel|platinum|palladium)/gi,
    weight: /(\d+\.?\d*)\s*(gram|g|oz|ounce)/gi,
    diameter: /(\d+\.?\d*)\s*(mm|millimeter)/gi
  }

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  if (titleMatch) {
    coinData.extractedData.title = titleMatch[1].trim()
  }

  // Extract prices
  const prices = html.match(patterns.price)
  if (prices && prices.length > 0) {
    coinData.extractedData.prices = prices.slice(0, 3) // Get first 3 prices found
    coinData.extractedData.estimatedPrice = prices[0]
  }

  // Extract years
  const years = html.match(patterns.year)
  if (years && years.length > 0) {
    coinData.extractedData.possibleYears = [...new Set(years)].slice(0, 3)
  }

  // Extract grades
  const grades = html.match(patterns.grade)
  if (grades && grades.length > 0) {
    coinData.extractedData.grades = [...new Set(grades.map(g => g.toUpperCase()))].slice(0, 3)
  }

  // Extract metals
  const metals = html.match(patterns.metal)
  if (metals && metals.length > 0) {
    coinData.extractedData.metals = [...new Set(metals.map(m => m.toLowerCase()))]
  }

  // eBay specific parsing
  if (url.includes('ebay.')) {
    coinData.extractedData.platform = 'eBay'
    
    // Look for eBay item specifics
    const itemSpecifics = html.match(/<div[^>]*class="[^"]*notranslate[^"]*"[^>]*>([^<]+)<\/div>/gi)
    if (itemSpecifics) {
      coinData.extractedData.itemSpecifics = itemSpecifics.slice(0, 5).map(item => 
        item.replace(/<[^>]*>/g, '').trim()
      )
    }
  }

  // Heritage Auctions specific parsing
  if (url.includes('heritage') || url.includes('ha.com')) {
    coinData.extractedData.platform = 'Heritage Auctions'
    
    // Look for lot information
    const lotMatch = html.match(/lot\s*#?\s*(\d+)/i)
    if (lotMatch) {
      coinData.extractedData.lotNumber = lotMatch[1]
    }
  }

  // Add analysis based on instructions
  if (instructions) {
    coinData.extractedData.analysisInstructions = instructions
    coinData.extractedData.instructionsApplied = true
  }

  // Add parsing metadata
  coinData.extractedData.parsingMetadata = {
    htmlLength: html.length,
    patternsFound: Object.keys(patterns).filter(key => 
      coinData.extractedData[key] || coinData.extractedData[key + 's']
    ),
    confidence: calculateConfidence(coinData.extractedData)
  }

  return coinData
}

function calculateConfidence(data: any): number {
  let score = 0
  const factors = [
    { key: 'title', weight: 0.2 },
    { key: 'prices', weight: 0.3 },
    { key: 'possibleYears', weight: 0.2 },
    { key: 'grades', weight: 0.2 },
    { key: 'metals', weight: 0.1 }
  ]

  factors.forEach(factor => {
    if (data[factor.key] && data[factor.key].length > 0) {
      score += factor.weight
    }
  })

  return Math.round(score * 100) / 100
}
