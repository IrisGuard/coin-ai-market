import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wdgnllgbfvjgurbqhfqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZ25sbGdiZnZqZ3VyYnFoZnFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTA1Mzg2NSwiZXhwIjoyMDY0NjI5ODY1fQ.O7_DPBmNmL-YOUUnFnr0Stxaz4D64CyAfMCcf_GWuoY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCoins() {
  console.log('🔍 CHECKING ALL COINS IN DATABASE...');
  
  const { data: allCoins, error } = await supabase
    .from('coins')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log('📊 TOTAL COINS FOUND:', allCoins?.length || 0);
  
  if (allCoins && allCoins.length > 0) {
    console.log('\n🪙 EXISTING COINS:');
    allCoins.forEach((coin, index) => {
      console.log(`${index + 1}. ${coin.name}`);
      console.log(`   ID: ${coin.id}`);
      console.log(`   Price: $${coin.price}`);
      console.log(`   Is Auction: ${coin.is_auction}`);
      console.log(`   Featured: ${coin.featured}`);
      console.log(`   Store ID: ${coin.store_id}`);
      console.log(`   Category: ${coin.category}`);
      console.log(`   Image: ${coin.image}`);
      console.log(`   Created: ${coin.created_at}`);
      console.log('   ---');
    });
    
    const buyNowCoins = allCoins.filter(coin => !coin.is_auction);
    const auctionCoins = allCoins.filter(coin => coin.is_auction);
    
    console.log(`\n📈 BUY NOW COINS: ${buyNowCoins.length}`);
    console.log(`🏷️ AUCTION COINS: ${auctionCoins.length}`);
  } else {
    console.log('⚠️ NO COINS FOUND IN DATABASE');
  }
}

checkCoins().catch(console.error); 