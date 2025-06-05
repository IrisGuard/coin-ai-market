
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user } } = await supabaseClient.auth.getUser(token)
    if (!user) throw new Error('Unauthorized')

    const { action, payload } = await req.json()

    switch (action) {
      case 'create_order':
        return await createTransakOrder(supabaseClient, payload, user.id)
      case 'update_status':
        return await updatePaymentStatus(supabaseClient, payload)
      default:
        throw new Error('Unknown action')
    }

  } catch (error) {
    console.error('Transak payment error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})

async function createTransakOrder(supabase: any, payload: any, userId: string) {
  const { coinId, amount, currency = 'USD' } = payload
  
  // Create payment transaction record
  const { data: transaction, error } = await supabase
    .from('payment_transactions')
    .insert({
      user_id: userId,
      coin_id: coinId,
      amount: amount,
      currency: currency,
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw error

  // Generate Transak order data
  const transakApiKey = Deno.env.get('TRANSAK_API_KEY') || 'a602f7cc-43c4-42d5-bf83-0d1ab5ff2059'
  
  const transakOrder = {
    apiKey: transakApiKey,
    environment: 'STAGING', // Change to 'PRODUCTION' for live
    fiatCurrency: currency,
    fiatAmount: amount,
    cryptoCurrencyCode: 'ETH', // Default crypto
    walletAddress: '', // Will be provided by user
    redirectURL: `${Deno.env.get('SUPABASE_URL')}/functions/v1/transak-payment`,
    orderId: transaction.id
  }

  // Update transaction with Transak data
  await supabase
    .from('payment_transactions')
    .update({ 
      transak_data: transakOrder,
      transak_order_id: transaction.id 
    })
    .eq('id', transaction.id)

  return new Response(
    JSON.stringify({ 
      success: true, 
      transakOrder,
      transactionId: transaction.id 
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  )
}

async function updatePaymentStatus(supabase: any, payload: any) {
  const { transactionId, status, transakData } = payload
  
  const { error } = await supabase
    .from('payment_transactions')
    .update({ 
      status: status,
      transak_data: transakData,
      updated_at: new Date().toISOString()
    })
    .eq('id', transactionId)

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  )
}
