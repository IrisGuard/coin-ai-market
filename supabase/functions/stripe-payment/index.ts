import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

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

    const { 
      coinId, 
      amount, 
      currency = 'USD', 
      paymentMethodId, 
      customerEmail,
      customerName,
      billingAddress,
      userId 
    } = await req.json()

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Create or retrieve customer
    let customer
    const customers = await stripe.customers.list({
      email: customerEmail,
      limit: 1
    })

    if (customers.data.length > 0) {
      customer = customers.data[0]
    } else {
      customer = await stripe.customers.create({
        email: customerEmail,
        name: customerName,
        address: billingAddress
      })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      customer: customer.id,
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      return_url: `${req.headers.get('origin')}/payment-success`,
      metadata: {
        coinId,
        userId,
        orderType: 'coin_purchase'
      }
    })

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: userId,
        coin_id: coinId,
        amount: amount,
        currency: currency,
        status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
        order_type: 'coin_purchase',
        stripe_payment_intent_id: paymentIntent.id,
        payment_method: 'stripe_card'
      })
      .select()
      .single()

    if (transactionError) {
      throw transactionError
    }

    return new Response(
      JSON.stringify({
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          client_secret: paymentIntent.client_secret
        },
        transaction,
        requiresAction: paymentIntent.status === 'requires_action'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Stripe payment error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})