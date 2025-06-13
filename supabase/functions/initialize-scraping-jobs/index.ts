
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🚀 Initializing comprehensive scraping jobs...');

    const scrapingJobs = [
      {
        job_type: 'ebay_morgan_dollars',
        target_url: 'https://www.ebay.com/sch/i.html?_nkw=morgan+silver+dollar+MS63',
        status: 'running',
        config: { category: 'morgan_dollars', grade_filter: 'MS63' }
      },
      {
        job_type: 'ebay_peace_dollars',
        target_url: 'https://www.ebay.com/sch/i.html?_nkw=peace+silver+dollar+AU58',
        status: 'running',
        config: { category: 'peace_dollars', grade_filter: 'AU58' }
      },
      {
        job_type: 'ebay_walking_liberty',
        target_url: 'https://www.ebay.com/sch/i.html?_nkw=walking+liberty+half+dollar+XF45',
        status: 'running',
        config: { category: 'walking_liberty', grade_filter: 'XF45' }
      },
      {
        job_type: 'ebay_mercury_dimes',
        target_url: 'https://www.ebay.com/sch/i.html?_nkw=mercury+dime+FB+MS65',
        status: 'running',
        config: { category: 'mercury_dimes', grade_filter: 'MS65' }
      },
      {
        job_type: 'ebay_indian_head_cents',
        target_url: 'https://www.ebay.com/sch/i.html?_nkw=indian+head+cent+1909S',
        status: 'running',
        config: { category: 'indian_head_cents', key_date: '1909-S' }
      },
      {
        job_type: 'ebay_wheat_pennies',
        target_url: 'https://www.ebay.com/sch/i.html?_nkw=wheat+penny+1943+steel',
        status: 'running',
        config: { category: 'wheat_pennies', error_type: 'steel_cent' }
      },
      {
        job_type: 'ebay_buffalo_nickels',
        target_url: 'https://www.ebay.com/sch/i.html?_nkw=buffalo+nickel+1913+type+1',
        status: 'running',
        config: { category: 'buffalo_nickels', type: 'type_1' }
      },
      {
        job_type: 'ebay_franklin_halves',
        target_url: 'https://www.ebay.com/sch/i.html?_nkw=franklin+half+dollar+FBL+MS64',
        status: 'running',
        config: { category: 'franklin_halves', designation: 'FBL' }
      },
      {
        job_type: 'ebay_kennedy_halves',
        target_url: 'https://www.ebay.com/sch/i.html?_nkw=kennedy+half+dollar+1964+MS65',
        status: 'running',
        config: { category: 'kennedy_halves', year: '1964' }
      },
      {
        job_type: 'ebay_american_eagles',
        target_url: 'https://www.ebay.com/sch/i.html?_nkw=american+silver+eagle+MS70',
        status: 'running',
        config: { category: 'american_eagles', grade_filter: 'MS70' }
      },
      {
        job_type: 'heritage_auctions_monitor',
        target_url: 'https://coins.ha.com/c/search-results.zx?N=793+794+1155+4294963296',
        status: 'running',
        config: { auction_house: 'heritage', category: 'us_coins' }
      },
      {
        job_type: 'pcgs_price_guide',
        target_url: 'https://www.pcgs.com/prices/priceguidedetail.aspx?ms=1&pr=1&sp=1&c=1&mscv=65',
        status: 'running',
        config: { source: 'pcgs', grade_range: 'MS60-MS70' }
      },
      {
        job_type: 'ngc_price_guide',
        target_url: 'https://www.ngccoin.com/price-guide/united-states/',
        status: 'running',
        config: { source: 'ngc', country: 'united_states' }
      },
      {
        job_type: 'greysheet_precious_metals',
        target_url: 'https://greysheet.com/',
        status: 'running',
        config: { source: 'greysheet', focus: 'precious_metals' }
      },
      {
        job_type: 'coin_world_news_scraper',
        target_url: 'https://www.coinworld.com/news/',
        status: 'running',
        config: { source: 'coin_world', content_type: 'news' }
      },
      {
        job_type: 'error_coins_specialist',
        target_url: 'https://www.ebay.com/sch/i.html?_nkw=error+coin+double+die',
        status: 'running',
        config: { category: 'error_coins', error_type: 'double_die' }
      },
      {
        job_type: 'commemorative_coins',
        target_url: 'https://www.ebay.com/sch/i.html?_nkw=commemorative+silver+dollar+MS69',
        status: 'running',
        config: { category: 'commemoratives', grade_filter: 'MS69' }
      },
      {
        job_type: 'proof_sets_monitor',
        target_url: 'https://www.ebay.com/sch/i.html?_nkw=proof+set+silver+PR69',
        status: 'running',
        config: { category: 'proof_sets', metal: 'silver' }
      }
    ];

    // Insert scraping jobs
    const { data: insertedJobs, error: jobsError } = await supabaseClient
      .from('scraping_jobs')
      .upsert(scrapingJobs, { onConflict: 'job_type' })
      .select();

    if (jobsError) {
      console.error('❌ Error inserting scraping jobs:', jobsError);
      throw jobsError;
    }

    console.log(`✅ Initialized ${insertedJobs?.length} scraping jobs`);

    // Initialize error coins knowledge base
    const errorCoinsKnowledge = [
      {
        error_name: 'Double Die Obverse - 1955 Lincoln Cent',
        error_type: 'die_error',
        error_category: 'lincoln_cents',
        description: 'Strong doubling visible on date and lettering on obverse',
        severity_level: 9,
        rarity_score: 10,
        market_premium_multiplier: 50.0
      },
      {
        error_name: 'Off-Center Strike - 10-15%',
        error_type: 'striking_error',
        error_category: 'various',
        description: 'Coin struck off-center showing 10-15% blank planchet',
        severity_level: 6,
        rarity_score: 7,
        market_premium_multiplier: 3.0
      },
      {
        error_name: 'Wrong Planchet - Dime on Cent Planchet',
        error_type: 'planchet_error',
        error_category: 'modern_coins',
        description: 'Dime design struck on smaller cent planchet',
        severity_level: 8,
        rarity_score: 9,
        market_premium_multiplier: 25.0
      },
      {
        error_name: 'Clipped Planchet - Straight Clip',
        error_type: 'planchet_error',
        error_category: 'various',
        description: 'Straight edge clip on coin planchet before striking',
        severity_level: 5,
        rarity_score: 6,
        market_premium_multiplier: 2.5
      },
      {
        error_name: 'Broadstrike - No Collar',
        error_type: 'striking_error',
        error_category: 'various',
        description: 'Coin struck without restraining collar, resulting in expanded diameter',
        severity_level: 6,
        rarity_score: 7,
        market_premium_multiplier: 4.0
      }
    ];

    const { data: insertedErrors, error: errorsError } = await supabaseClient
      .from('error_coins_knowledge')
      .upsert(errorCoinsKnowledge, { onConflict: 'error_name' })
      .select();

    if (errorsError) {
      console.error('❌ Error inserting error coins knowledge:', errorsError);
      throw errorsError;
    }

    console.log(`✅ Initialized ${insertedErrors?.length} error coin types`);

    return new Response(
      JSON.stringify({
        success: true,
        scraping_jobs_created: insertedJobs?.length,
        error_types_created: insertedErrors?.length,
        message: 'System initialization complete - all scraping jobs active'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Initialization error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
