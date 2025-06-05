
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

    // Check if user is admin using our new secure function
    const { data: isAdmin, error: adminError } = await supabaseClient
      .rpc('is_admin_user', { user_id: user.id })

    if (adminError || !isAdmin) {
      throw new Error('Access denied: Admin privileges required')
    }

    const { operation, payload } = await req.json()

    switch (operation) {
      case 'bulk_create_api_keys':
        return await handleBulkCreateApiKeys(supabaseClient, payload, user.id)
      case 'create_api_key':
        return await handleCreateApiKey(supabaseClient, payload, user.id)
      default:
        throw new Error('Unknown operation')
    }

  } catch (error) {
    console.error('Admin operation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})

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
