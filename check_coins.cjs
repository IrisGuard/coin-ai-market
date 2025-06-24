const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gzqdgkmkzffdgzkqrbxe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6cWRna21remZmZGd6a3FyYnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MjkzNzEsImV4cCI6MjA0NzQwNTM3MX0.7MWQe0O8mhk4kfLkl7kL5NNtfY_5fHGQOdOCdIuNy4k';
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
      console.log(`   Image: ${coin.image ? 'YES' : 'NO'}`);
      console.log(`   Created: ${coin.created_at}`);
      console.log('   ---');
    });
    
    const buyNowCoins = allCoins.filter(coin => !coin.is_auction);
    const auctionCoins = allCoins.filter(coin => coin.is_auction);
    
    console.log(`\n📈 BUY NOW COINS: ${buyNowCoins.length}`);
    console.log(`🏷️ AUCTION COINS: ${auctionCoins.length}`);
    
    // Check for blob URLs
    const blobbedCoins = allCoins.filter(coin => coin.image && coin.image.startsWith('blob:'));
    if (blobbedCoins.length > 0) {
      console.log(`\n⚠️ COINS WITH BLOB URLS: ${blobbedCoins.length}`);
      blobbedCoins.forEach(coin => {
        console.log(`   - ${coin.name} (ID: ${coin.id})`);
      });
    }
  } else {
    console.log('⚠️ NO COINS FOUND IN DATABASE');
  }
}

checkCoins().catch(console.error); 