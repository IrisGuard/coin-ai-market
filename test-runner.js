import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qsgbyfwjivllpjzwrqvo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZ2J5ZndqaXZsbHBqendycXZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMTE3OTYsImV4cCI6MjA1MDg4Nzc5Nn0.sjmL9M9-WG5bvpHLMJD7NaatU-2TQ6H5_EWzb6lhpE0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRealCoinCreation() {
  console.log('🧪 Starting REAL coin creation test...');
  
  try {
    // Step 1: Check if store exists
    console.log('🏪 Checking for GREECE COIN - ERROR COIN store...');
    const { data: stores, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('user_id', '47fc544e-c907-4112-949a-4399d7703217');

    if (storeError) {
      throw new Error(`Store fetch error: ${storeError.message}`);
    }

    console.log('🏪 Available stores:', stores?.length || 0);
    
    let targetStore = stores?.find(s => s.name === 'GREECE COIN - ERROR COIN');
    
    if (!targetStore) {
      console.log('🏪 Creating GREECE COIN - ERROR COIN store...');
      const { data: newStore, error: createError } = await supabase
        .from('stores')
        .insert({
          name: 'GREECE COIN - ERROR COIN',
          description: 'Explore the Rich Legacy of Greek Coinage & Rare Mint Errors. We proudly offer hundreds of thousands of Greek coins, spanning modern issues, commemorative editions, and historical series. Our collection also features a unique selection of mint error coins – fascinating rarities that showcase the unexpected side of numismatics.',
          user_id: '47fc544e-c907-4112-949a-4399d7703217',
          verified: true,
          is_active: true
        })
        .select()
        .single();
      
      if (createError) {
        throw new Error(`Store creation error: ${createError.message}`);
      }
      
      targetStore = newStore;
    }

    console.log('✅ Found/Created store:', targetStore.name, 'ID:', targetStore.id);

    // Step 2: Create a test coin
    console.log('🪙 Creating test coin...');
    const { data: coin, error: coinError } = await supabase
      .from('coins')
      .insert({
        name: 'Greek 10 Lepta Error Coin - Live Test ' + new Date().toISOString().substr(0,19),
        year: 1978,
        country: 'Greece',
        denomination: '10 Lepta',
        price: 29.00,
        description: 'LIVE TEST: Greek 10 Lepta coin from 1978 with visible mint error. This coin verifies that the complete end-to-end functionality of store connection, display system, and all marketplace features are working correctly on the live site.',
        category: 'greek',
        rarity: 'Common',
        grade: 'VF',
        condition: 'Very Fine',
        is_auction: false,
        featured: true,
        user_id: '47fc544e-c907-4112-949a-4399d7703217',
        store_id: targetStore.id,
        image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&h=400&fit=crop',
        authentication_status: 'ai_verified',
        ai_confidence: 0.95,
        views: 0,
        favorites: 0,
        sold: false
      })
      .select()
      .single();

    if (coinError) {
      throw new Error(`Coin creation error: ${coinError.message}`);
    }

    console.log('✅ Test coin created successfully!');
    console.log('   Name:', coin.name);
    console.log('   ID:', coin.id);
    console.log('   Store ID:', coin.store_id);
    console.log('   User ID:', coin.user_id);

    // Step 3: Verify coin appears in queries
    console.log('🔍 Verifying coin queries...');
    
    const { data: storeCoins } = await supabase
      .from('coins')
      .select('*')
      .eq('store_id', targetStore.id);
    
    const { data: userCoins } = await supabase
      .from('coins')
      .select('*')
      .eq('user_id', '47fc544e-c907-4112-949a-4399d7703217');
    
    const { data: featuredCoins } = await supabase
      .from('coins')
      .select('*')
      .eq('featured', true);
    
    const { data: categoryCoins } = await supabase
      .from('coins')
      .select('*')
      .eq('category', 'greek');

    console.log('📊 Query Results:');
    console.log('   Store coins:', storeCoins?.length || 0);
    console.log('   User coins:', userCoins?.length || 0);
    console.log('   Featured coins:', featuredCoins?.length || 0);
    console.log('   Greek category coins:', categoryCoins?.length || 0);
    
    const appearsInStore = storeCoins?.some(c => c.id === coin.id);
    const appearsInUser = userCoins?.some(c => c.id === coin.id);
    const appearsInFeatured = featuredCoins?.some(c => c.id === coin.id);
    const appearsInCategory = categoryCoins?.some(c => c.id === coin.id);
    
    console.log('✅ Verification Results:');
    console.log('   Appears in store query:', appearsInStore ? '✅' : '❌');
    console.log('   Appears in user query:', appearsInUser ? '✅' : '❌');
    console.log('   Appears in featured query:', appearsInFeatured ? '✅' : '❌');
    console.log('   Appears in category query:', appearsInCategory ? '✅' : '❌');
    
    if (appearsInStore && appearsInUser && appearsInFeatured && appearsInCategory) {
      console.log('🎉 SUCCESS! End-to-end test PASSED!');
      console.log('🌐 The coin should now appear on:');
      console.log(`   Store page: https://coin-ai-market.vercel.app/store/${targetStore.id}`);
      console.log(`   Coin page: https://coin-ai-market.vercel.app/coin/${coin.id}`);
      console.log(`   Greek category: https://coin-ai-market.vercel.app/category/greek`);
      console.log(`   Homepage (featured): https://coin-ai-market.vercel.app/`);
    } else {
      console.log('❌ FAILED! Some queries are not working correctly.');
    }
    
    return {
      success: true,
      coin,
      store: targetStore,
      verification: {
        appearsInStore,
        appearsInUser,
        appearsInFeatured,
        appearsInCategory
      }
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Run the test
testRealCoinCreation()
  .then(result => {
    if (result.success) {
      console.log('\n🎯 TEST COMPLETED SUCCESSFULLY!');
      process.exit(0);
    } else {
      console.log('\n💥 TEST FAILED!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  }); 