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
    // Use production credentials
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? 'https://wdgnllgbfvjgurbqhfqb.supabase.co',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create a client with the user's token to verify identity
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? 'https://wdgnllgbfvjgurbqhfqb.supabase.co',
      Deno.env.get('SUPABASE_ANON_KEY') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZ25sbGdiZnZqZ3VyYnFoZnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTM4NjUsImV4cCI6MjA2NDYyOTg2NX0.vPsjHXSqpx3SLKtoIroQkFZhTSdWEfHA4x5kg5p1veU',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        global: {
          headers: {
            Authorization: authHeader
          }
        }
      }
    )

    // Verify user is authenticated and is admin
    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    // CRITICAL: Check if user is admin using secure function
    const { data: isAdmin, error: adminError } = await supabaseClient
      .rpc('secure_admin_verification', { user_uuid: user.id })

    if (adminError || !isAdmin) {
      console.error('SECURITY VIOLATION: Non-admin attempted system activation', {
        user_id: user.id,
        email: user.email,
        timestamp: new Date().toISOString()
      });
      
      // Log security incident
      await supabaseClient.from('security_incidents').insert({
        incident_type: 'unauthorized_admin_access',
        severity_level: 'high',
        title: 'Non-admin attempted system activation',
        description: `User ${user.email} (${user.id}) attempted to access admin-only system activation`,
        incident_data: {
          user_id: user.id,
          user_email: user.email,
          attempted_operation: 'system_activation',
          timestamp: new Date().toISOString()
        }
      });
      
      throw new Error('SECURITY VIOLATION: Admin privileges required for system activation');
    }

    const { operation, payload } = await req.json()

    switch (operation) {
      case 'initialize_scraping_jobs':
        return await handleSecureScrapingInitialization(supabaseClient, payload, user.id)
      case 'bulk_create_api_keys':
        return await handleBulkCreateApiKeys(supabaseClient, payload, user.id)
      case 'create_api_key':
        return await handleCreateApiKey(supabaseClient, payload, user.id)
      default:
        throw new Error('Unknown admin operation')
    }

  } catch (error) {
    console.error('Secure admin operation error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        security_notice: 'This operation requires verified admin access'
      }),
      {
        status: error.message.includes('SECURITY VIOLATION') ? 403 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})

async function handleSecureScrapingInitialization(supabase: any, payload: any, adminUserId: string) {
  console.log('🔒 ADMIN-ONLY: Initializing scraping infrastructure...');
  
  // Log admin action
  await supabase.from('admin_activity_logs').insert({
    admin_user_id: adminUserId,
    action: 'initialize_scraping_infrastructure',
    target_type: 'system',
    details: { operation: 'scraping_initialization', timestamp: new Date().toISOString() }
  });

  // Create scraping jobs with admin verification
  const scrapingJobs = [
    { name: 'eBay Coin Monitor', target_url: 'https://ebay.com/coins', status: 'active' },
    { name: 'Heritage Auctions', target_url: 'https://coins.ha.com', status: 'active' },
    { name: 'PCGS Price Guide', target_url: 'https://pcgs.com/prices', status: 'active' },
    // Add more scraping jobs...
  ];

  const { data: createdJobs, error } = await supabase
    .from('scraping_jobs')
    .insert(scrapingJobs.map(job => ({
      ...job,
      created_by: adminUserId,
      admin_verified: true
    })))
    .select();

  if (error) throw error;

  return new Response(
    JSON.stringify({ 
      scraping_jobs_created: createdJobs.length,
      admin_verified: true,
      message: 'Scraping infrastructure initialized by admin'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleBulkCreateApiKeys(supabase: any, keys: any[], userId: string) {
  let imported = 0
  let failed = 0
  const errors: string[] = []

  for (const key of keys) {
    try {
      // Enhanced security: Use secure encryption function with stronger encryption
      const { data: encryptedValue, error: encryptError } = await supabase
        .rpc('encrypt_api_key_secure', { plain_key: key.value })

      if (encryptError) throw encryptError
      
      const { error: insertError } = await supabase
        .from('api_keys')
        .insert({
          key_name: key.name,
          encrypted_value: encryptedValue,
          description: key.description,
          created_by: userId,
          is_active: true
        })

      if (insertError) throw insertError
      imported++

      // Log admin activity for security audit
      await supabase.from('admin_activity_logs').insert({
        action: 'bulk_import_api_key',
        target_type: 'api_key',
        admin_user_id: userId,
        details: { key_name: key.name }
      })

    } catch (error) {
      failed++
      errors.push(`Failed to import ${key.name}: ${error.message}`)
      console.error(`Import error for ${key.name}:`, error)
    }
  }

  return new Response(
    JSON.stringify({ imported, failed, errors }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  )
}

async function handleCreateApiKey(supabase: any, keyData: any, userId: string) {
  try {
    // Use secure encryption function with enhanced security
    const { data: encryptedValue, error: encryptError } = await supabase
      .rpc('encrypt_api_key_secure', { plain_key: keyData.value })

    if (encryptError) throw encryptError

    const { error } = await supabase
      .from('api_keys')
      .insert({
        key_name: keyData.name,
        encrypted_value: encryptedValue,
        description: keyData.description,
        created_by: userId,
        is_active: true
      })

    if (error) throw error

    // Log admin activity for security audit
    await supabase.from('admin_activity_logs').insert({
      action: 'create_api_key',
      target_type: 'api_key',
      admin_user_id: userId,
      details: { key_name: keyData.name }
    })

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    throw error
  }
}
