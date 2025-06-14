
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TransakOrderRequest {
  coinId?: string;
  amount: string;
  currency: string;
  userId: string;
  orderType: 'coin_purchase' | 'subscription' | 'store_upgrade';
  subscriptionPlan?: string;
  walletAddress?: string;
  cryptoCurrency?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { method } = req;
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'create-order';

    if (method === 'POST' && action === 'create-order') {
      const orderData: TransakOrderRequest = await req.json();
      
      // Get user authentication
      const authHeader = req.headers.get('Authorization')!;
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabaseClient.auth.getUser(token);
      
      if (!user || user.id !== orderData.userId) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Default Solana wallet address
      const defaultWallet = 'GKp3Ckr4xghXy2sXbgrHJG1iGQxfEtw7NQeQhVQ9a2Pg';
      const walletAddress = orderData.walletAddress || defaultWallet;

      // Determine cryptocurrency based on order type
      let cryptoCurrency = orderData.cryptoCurrency || 'SOL';
      if (orderData.orderType === 'subscription') {
        cryptoCurrency = 'USDC'; // Stable for subscriptions
      }

      // Create Transak order configuration
      const transakConfig = {
        apiKey: Deno.env.get('TRANSAK_API_KEY'),
        environment: 'STAGING', // Change to 'PRODUCTION' when ready
        walletAddress: walletAddress,
        cryptoCurrencyCode: cryptoCurrency,
        fiatCurrency: orderData.currency || 'USD',
        fiatAmount: orderData.amount,
        network: cryptoCurrency === 'SOL' ? 'solana' : 'ethereum',
        partnerOrderId: `${orderData.orderType}_${Date.now()}`,
        partnerCustomerId: user.id,
        redirectURL: `${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/payment/success`,
        hostURL: Deno.env.get('SITE_URL') || 'http://localhost:5173',
        widgetHeight: '600px',
        widgetWidth: '450px',
        themeColor: '3B82F6'
      };

      // Create Transak order URL
      const transakParams = new URLSearchParams();
      Object.entries(transakConfig).forEach(([key, value]) => {
        if (value) transakParams.append(key, value.toString());
      });
      
      const transakUrl = `https://staging-global.transak.com/?${transakParams.toString()}`;

      // Store transaction in our database
      const { data: transaction, error: dbError } = await supabaseClient
        .from('payment_transactions')
        .insert({
          user_id: orderData.userId,
          coin_id: orderData.coinId,
          amount: parseFloat(orderData.amount),
          currency: orderData.currency || 'USD',
          crypto_currency: cryptoCurrency,
          wallet_address: walletAddress,
          status: 'pending',
          order_type: orderData.orderType,
          subscription_plan: orderData.subscriptionPlan,
          transak_order_id: transakConfig.partnerOrderId,
          transak_data: transakConfig,
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        return new Response(
          JSON.stringify({ error: 'Transaction recording failed' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          transaction: transaction,
          transakUrl: transakUrl,
          config: transakConfig
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (method === 'POST' && action === 'webhook') {
      // Handle Transak webhooks
      const webhookData = await req.json();
      
      console.log('Transak webhook received:', webhookData);
      
      // Update transaction status based on webhook
      if (webhookData.eventID && webhookData.status) {
        const { error: updateError } = await supabaseClient
          .from('payment_transactions')
          .update({ 
            status: webhookData.status.toLowerCase(),
            transak_data: webhookData,
            updated_at: new Date().toISOString()
          })
          .eq('transak_order_id', webhookData.partnerOrderId);

        if (updateError) {
          console.error('Webhook update error:', updateError);
        }

        // Handle successful payments
        if (webhookData.status === 'COMPLETED') {
          // Process based on order type
          const { data: transaction } = await supabaseClient
            .from('payment_transactions')
            .select('*')
            .eq('transak_order_id', webhookData.partnerOrderId)
            .single();

          if (transaction) {
            switch (transaction.order_type) {
              case 'coin_purchase':
                // Mark coin as sold
                await supabaseClient
                  .from('coins')
                  .update({ sold: true, sold_at: new Date().toISOString() })
                  .eq('id', transaction.coin_id);
                break;
              
              case 'subscription':
                // Activate subscription
                await supabaseClient
                  .from('user_subscriptions')
                  .insert({
                    user_id: transaction.user_id,
                    plan_name: transaction.subscription_plan,
                    status: 'active',
                    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                  });
                break;
              
              case 'store_upgrade':
                // Upgrade dealer store
                await supabaseClient
                  .from('stores')
                  .update({ 
                    subscription_tier: transaction.subscription_plan,
                    subscription_expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                  })
                  .eq('user_id', transaction.user_id);
                break;
            }
          }
        }
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (method === 'GET' && action === 'status') {
      const transactionId = url.searchParams.get('transactionId');
      
      if (!transactionId) {
        return new Response(
          JSON.stringify({ error: 'Transaction ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get transaction from database
      const { data: transaction, error } = await supabaseClient
        .from('payment_transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (error || !transaction) {
        return new Response(
          JSON.stringify({ error: 'Transaction not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          status: transaction.status,
          transaction: transaction
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})
