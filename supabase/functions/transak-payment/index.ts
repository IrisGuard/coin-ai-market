
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    const action = url.searchParams.get('action');

    if (method === 'POST' && action === 'create-order') {
      const { coinId, amount, currency, userId } = await req.json();
      
      // Get user authentication
      const authHeader = req.headers.get('Authorization')!;
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabaseClient.auth.getUser(token);
      
      if (!user || user.id !== userId) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create Transak order
      const transakApiKey = Deno.env.get('TRANSAK_API_KEY');
      const transakResponse = await fetch('https://api.transak.com/api/v2/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${transakApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cryptocurrency: currency || 'ETH',
          fiatAmount: amount,
          network: 'ethereum',
          walletAddress: 'temp-address', // This will be updated when user provides wallet
        }),
      });

      if (!transakResponse.ok) {
        console.error('Transak API error:', await transakResponse.text());
        return new Response(
          JSON.stringify({ error: 'Payment initiation failed' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const transakData = await transakResponse.json();
      
      // Store transaction in our database
      const { data: transaction, error: dbError } = await supabaseClient
        .from('payment_transactions')
        .insert({
          user_id: userId,
          coin_id: coinId,
          amount: parseFloat(amount),
          currency: currency || 'USD',
          status: 'pending',
          transak_order_id: transakData.id,
          transak_data: transakData,
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
          transakUrl: transakData.url 
        }),
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

      // Check status with Transak if we have an order ID
      if (transaction.transak_order_id) {
        const transakApiKey = Deno.env.get('TRANSAK_API_KEY');
        const statusResponse = await fetch(
          `https://api.transak.com/api/v2/orders/${transaction.transak_order_id}`,
          {
            headers: {
              'Authorization': `Bearer ${transakApiKey}`,
            },
          }
        );

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          
          // Update our database if status changed
          if (statusData.status !== transaction.status) {
            await supabaseClient
              .from('payment_transactions')
              .update({ 
                status: statusData.status,
                transak_data: statusData,
                updated_at: new Date().toISOString()
              })
              .eq('id', transactionId);
          }
          
          return new Response(
            JSON.stringify({ 
              status: statusData.status,
              transaction: { ...transaction, status: statusData.status }
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
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
