import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hsbbzxlwsnsuwvlgkxep.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzYmJ6eGx3c25zdXd2bGdreGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwOTI3MjcsImV4cCI6MjA0NjY2ODcyN30.2lZhvN8P-7s0qfhwU8iUvW7QlhcOdZc6QLFcWhkPzVY';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function checkCoinStoreConnections() {
  console.log('🔍 CHECKING COIN-STORE CONNECTIONS...\n');
  
  try {
    // 1. Check all coins
    const { data: coins, error: coinsError } = await supabase
      .from('coins')
      .select(`
        id,
        name,
        price,
        user_id,
        images,
        image,
        obverse_image,
        reverse_image,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (coinsError) {
      console.error('❌ Error fetching coins:', coinsError);
      return;
    }

    // 2. Check all stores
    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select(`
        id,
        name,
        user_id,
        verified,
        is_active
      `);

    if (storesError) {
      console.error('❌ Error fetching stores:', storesError);
      return;
    }

    console.log(`📊 TOTAL: ${coins?.length || 0} coins, ${stores?.length || 0} stores\n`);

    // 3. Group coins by user_id
    const coinsByUser = {};
    coins?.forEach(coin => {
      if (!coinsByUser[coin.user_id]) {
        coinsByUser[coin.user_id] = [];
      }
      coinsByUser[coin.user_id].push(coin);
    });

    // 4. Check each user's coins and stores
    for (const [userId, userCoins] of Object.entries(coinsByUser)) {
      const userStores = stores?.filter(store => store.user_id === userId) || [];
      
      console.log(`👤 USER: ${userId}`);
      console.log(`   📦 Coins: ${userCoins.length}`);
      console.log(`   🏪 Stores: ${userStores.length}`);
      
      if (userStores.length > 0) {
        userStores.forEach(store => {
          console.log(`      - ${store.name} (${store.verified ? 'Verified' : 'Unverified'})`);
        });
      } else {
        console.log(`   ⚠️  NO STORES FOUND!`);
      }
      
      // Show sample coins
      userCoins.slice(0, 3).forEach(coin => {
        const hasImages = (coin.images?.length > 0) || coin.image || coin.obverse_image || coin.reverse_image;
        console.log(`      📝 ${coin.name} - $${coin.price} ${hasImages ? '🖼️' : '❌'}`);
      });
      
      console.log('');
    }

    // 5. Check for coins on homepage (buy_now = true)
    const { data: buyNowCoins, error: buyNowError } = await supabase
      .from('coins')
      .select('id, name, price, user_id')
      .eq('is_auction', false)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!buyNowError && buyNowCoins?.length > 0) {
      console.log('🏠 HOMEPAGE COINS (Buy Now):');
      buyNowCoins.forEach(coin => {
        const userStore = stores?.find(store => store.user_id === coin.user_id);
        console.log(`   - ${coin.name} - $${coin.price} → Store: ${userStore?.name || 'NO STORE!'}`);
      });
    }

  } catch (error) {
    console.error('💥 Fatal error:', error);
  }
}

// Run the check
checkCoinStoreConnections(); 