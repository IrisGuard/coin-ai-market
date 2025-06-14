
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { coinId, amount, currency, userId, orderType, subscriptionPlan, cryptoCurrency } = await req.json()

    // Create payment transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: userId,
        coin_id: coinId,
        amount: parseFloat(amount),
        currency: currency,
        crypto_currency: cryptoCurrency,
        status: 'pending',
        order_type: orderType,
        subscription_plan: subscriptionPlan
      })
      .select()
      .single()

    if (transactionError) {
      throw transactionError
    }

    // Generate Transak configuration
    const transakConfig = {
      apiKey: Deno.env.get('TRANSAK_API_KEY') || 'test-api-key',
      environment: Deno.env.get('TRANSAK_ENVIRONMENT') || 'STAGING',
      walletAddress: `user-wallet-${userId}`,
      partnerOrderId: transaction.id,
      redirectURL: `${req.headers.get('origin')}/payment-success`,
      hostURL: req.headers.get('origin'),
      disableWalletAddressForm: true
    }

    // Create Transak URL (for demo purposes)
    const transakUrl = `https://staging-global.transak.com?apiKey=${transakConfig.apiKey}&partnerOrderId=${transakConfig.partnerOrderId}&cryptoCurrencyCode=${cryptoCurrency}&fiatCurrency=${currency}&fiatAmount=${amount}&redirectURL=${encodeURIComponent(transakConfig.redirectURL)}`

    return new Response(
      JSON.stringify({
        success: true,
        transaction,
        transakUrl,
        config: transakConfig
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
