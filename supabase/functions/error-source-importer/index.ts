
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { source_url, source_type = 'knowledge' } = await req.json()

    if (!source_url) {
      throw new Error('Source URL is required')
    }

    console.log(`Importing from source: ${source_url}`)

    // Simulate data extraction (in real implementation, this would scrape the website)
    let extractedData = []

    if (source_url.includes('error-ref.com')) {
      extractedData = [
        {
          error_type: 'doubled_die_obverse',
          error_category: 'die_error',
          error_name: '1955 Lincoln Cent Doubled Die Obverse',
          description: 'The most famous doubled die variety in U.S. coinage history. Shows dramatic doubling of all obverse lettering and date.',
          identification_techniques: [
            'Look for complete doubling of IN GOD WE TRUST',
            'Check for doubled LIBERTY text',
            'Examine date for shelf-like doubling effect',
            'Use 10x magnification for best results'
          ],
          common_mistakes: [
            'Confusing with machine doubling',
            'Not checking all design elements',
            'Using insufficient magnification'
          ],
          reference_links: [source_url],
          severity_level: 5,
          rarity_score: 10,
          technical_specifications: {
            hub_doubling: true,
            die_state: 'early',
            doubling_class: 'Class I'
          },
          ai_detection_markers: {
            key_features: ['doubled_text', 'shelf_effect'],
            detection_areas: ['date', 'motto', 'liberty'],
            confidence_threshold: 0.95
          }
        }
      ]
    } else if (source_url.includes('doubleddie.com')) {
      extractedData = [
        {
          error_type: 'doubled_die_reverse',
          error_category: 'die_error', 
          error_name: '1972 Lincoln Cent Doubled Die Reverse',
          description: 'Strong doubling visible on UNITED STATES OF AMERICA and E PLURIBUS UNUM on the reverse.',
          identification_techniques: [
            'Examine reverse lettering carefully',
            'Look for doubled E PLURIBUS UNUM',
            'Check AMERICA for doubling',
            'Use proper lighting and magnification'
          ],
          common_mistakes: [
            'Missing subtle doubling',
            'Confusing with die deterioration'
          ],
          reference_links: [source_url],
          severity_level: 4,
          rarity_score: 8
        }
      ]
    } else if (source_url.includes('minterrornews.com')) {
      extractedData = [
        {
          error_type: 'machine_doubling',
          error_category: 'strike_error',
          error_name: 'Machine Doubling vs True Doubled Die',
          description: 'Educational guide explaining the difference between machine doubling and true doubled dies.',
          identification_techniques: [
            'Check for shelf-like appearance (true DD)',
            'Look for flat doubling (machine doubling)',
            'Examine consistency across design',
            'Consider strike characteristics'
          ],
          common_mistakes: [
            'Overvaluing machine doubling',
            'Not understanding the difference',
            'Misidentifying true doubled dies'
          ],
          reference_links: [source_url],
          severity_level: 2,
          rarity_score: 2
        }
      ]
    }

    // Insert extracted knowledge data
    const insertedKnowledge = []
    for (const data of extractedData) {
      const { data: inserted, error } = await supabaseClient
        .from('error_coins_knowledge')
        .insert(data)
        .select()
        .single()

      if (error) {
        console.error('Error inserting knowledge:', error)
        continue
      }

      insertedKnowledge.push(inserted)

      // If this is a market source, also add sample market data
      if (source_type === 'both' || source_type === 'market') {
        const marketData = {
          knowledge_base_id: inserted.id,
          grade: 'MS-65',
          market_value_low: 500,
          market_value_avg: 1500,
          market_value_high: 3000,
          premium_percentage: 25000, // 250x premium for 1955 DDO
          market_trend: 'stable',
          source_references: [source_url],
          data_confidence: 0.9
        }

        await supabaseClient
          .from('error_coins_market_data')
          .insert(marketData)
      }
    }

    // Update source last_scraped timestamp
    await supabaseClient
      .from('error_reference_sources')
      .update({ last_scraped: new Date().toISOString() })
      .eq('source_url', source_url)

    return new Response(
      JSON.stringify({ 
        success: true, 
        imported_count: insertedKnowledge.length,
        message: `Successfully imported ${insertedKnowledge.length} knowledge entries from ${source_url}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in error-source-importer:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
