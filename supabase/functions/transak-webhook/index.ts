import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TransakWebhookData {
  eventID: string;
  webhookData: {
    id: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    partnerOrderId: string;
    fiatAmount: number;
    fiatCurrency: string;
    cryptoAmount: number;
    cryptoCurrency: string;
    totalFeeInFiat: number;
    createdAt: string;
    completedAt?: string;
    failureReason?: string;
    transactionHash?: string;
    walletAddress?: string;
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const webhookData: TransakWebhookData = await req.json()
    
    console.log('Transak webhook received:', webhookData)

    const { webhookData: data } = webhookData
    
    if (!data || !data.partnerOrderId) {
      throw new Error('Invalid webhook data')
    }

    // Map Transak status to our internal status
    const getInternalStatus = (transakStatus: string) => {
      switch (transakStatus) {
        case 'COMPLETED':
          return 'completed'
        case 'FAILED':
        case 'CANCELLED':
          return 'failed'
        case 'PROCESSING':
          return 'processing'
        default:
          return 'pending'
      }
    }

    // Update payment transaction
    const { error: updateError } = await supabase
      .from('payment_transactions')
      .update({
        status: getInternalStatus(data.status),
        transak_order_id: data.id,
        crypto_currency: data.cryptoCurrency,
        updated_at: new Date().toISOString(),
        ...(data.completedAt && { completed_at: data.completedAt }),
        ...(data.failureReason && { error_message: data.failureReason }),
        ...(data.transactionHash && { transaction_hash: data.transactionHash })
      })
      .eq('id', data.partnerOrderId)

    if (updateError) {
      console.error('Database update error:', updateError)
      throw updateError
    }

    // If payment completed, update coin as sold (for coin purchases)
    if (data.status === 'COMPLETED') {
      const { data: transaction } = await supabase
        .from('payment_transactions')
        .select('coin_id, order_type')
        .eq('id', data.partnerOrderId)
        .single()

      if (transaction?.coin_id && transaction.order_type === 'coin_purchase') {
        await supabase
          .from('coins')
          .update({
            sold: true,
            sold_at: new Date().toISOString()
          })
          .eq('id', transaction.coin_id)
      }

      // Handle subscription activation
      if (transaction?.order_type === 'subscription') {
        const { data: paymentData } = await supabase
          .from('payment_transactions')
          .select('user_id, subscription_plan')
          .eq('id', data.partnerOrderId)
          .single()

        if (paymentData) {
          await supabase
            .from('user_subscriptions')
            .insert({
              user_id: paymentData.user_id,
              plan_name: paymentData.subscription_plan || 'basic',
              status: 'active',
              expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
            })
        }
      }
    }

    // Log the webhook event
    await supabase
      .from('analytics_events')
      .insert({
        event_type: 'transak_webhook',
        page_url: '/webhook/transak',
        metadata: {
          event_id: webhookData.eventID,
          order_id: data.id,
          partner_order_id: data.partnerOrderId,
          status: data.status,
          amount: data.fiatAmount,
          currency: data.fiatCurrency,
          crypto_currency: data.cryptoCurrency
        }
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook processed successfully',
        orderId: data.partnerOrderId,
        status: getInternalStatus(data.status)
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Webhook processing error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})