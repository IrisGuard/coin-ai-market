import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://wdgnllgbfvjgurbqhfqb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZ25sbGdiZnZqZ3VyYnFoZnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTM4NjUsImV4cCI6MjA2NDYyOTg2NX0.vPsjHXSqpx3SLKtoIroQkFZhTSdWEfHA4x5kg5p1veU'
);

async function debugCoin() {
  console.log('🔍 SEARCHING FOR GREECE COIN...');
  
  // Search for the specific coin
  const { data: coins, error } = await supabase
    .from('coins')
    .select('*')
    .or('name.ilike.%GREECE%,name.ilike.%10-978%,name.ilike.%GREECECOIN%');
    
  if (error) {
    console.error('❌ DATABASE ERROR:', error);
    return;
  }
  
  console.log('🏛️ FOUND COINS:', coins?.length || 0);
  
  if (coins && coins.length > 0) {
    coins.forEach((coin, index) => {
      console.log(`\n📋 COIN ${index + 1}:`);
      console.log(`ID: ${coin.id}`);
      console.log(`NAME: ${coin.name}`);
      console.log(`FEATURED: ${coin.featured}`);
      console.log(`AUTH_STATUS: ${coin.authentication_status}`);
      console.log(`STORE_ID: ${coin.store_id}`);
      console.log(`CATEGORY: ${coin.category}`);
      console.log(`IS_AUCTION: ${coin.is_auction}`);
      console.log(`PRICE: ${coin.price}`);
      console.log(`USER_ID: ${coin.user_id}`);
      console.log(`CREATED: ${coin.created_at}`);
    });
  } else {
    console.log('❌ NO COINS FOUND');
  }
  
  // Check featured coins query
  console.log('\n🔍 CHECKING FEATURED COINS QUERY...');
  const { data: featuredCoins, error: featuredError } = await supabase
    .from('coins')
    .select('id, name, featured, authentication_status')
    .eq('featured', true)
    .eq('authentication_status', 'verified');
    
  if (featuredError) {
    console.error('❌ FEATURED QUERY ERROR:', featuredError);
  } else {
    console.log(`✅ FEATURED COINS FOUND: ${featuredCoins?.length || 0}`);
    featuredCoins?.forEach(coin => {
      console.log(`- ${coin.name} (featured: ${coin.featured}, auth: ${coin.authentication_status})`);
    });
  }
}

debugCoin().catch(console.error); 