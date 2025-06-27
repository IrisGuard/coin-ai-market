import { supabase } from '@/integrations/supabase/client';

export const createRealTestCoin = async () => {
  try {
    console.log('🧪 Creating REAL test coin for end-to-end verification...');
    
    // First get the GREECE COIN - ERROR COIN store
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
      // Create the store if it doesn't exist
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

    // Create a real test coin
    const { data: coin, error: coinError } = await supabase
      .from('coins')
      .insert({
        name: 'Greek 10 Lepta Error Coin - Test Verification',
        year: 1978,
        country: 'Greece',
        denomination: '10 Lepta',
        price: 29.00,
        description: 'Test Greek 10 Lepta coin from 1978 with visible mint error. This coin is used to verify the complete end-to-end functionality of the store connection, display system, and all marketplace features.',
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

    console.log('✅ Test coin created successfully:', coin.name, 'ID:', coin.id);
    
    // Verify it appears in queries
    const { data: verifyCoins } = await supabase
      .from('coins')
      .select('*')
      .eq('user_id', '47fc544e-c907-4112-949a-4399d7703217');
    
    console.log('🔍 Total coins for admin user:', verifyCoins?.length || 0);
    
    const { data: storeCoins } = await supabase
      .from('coins')
      .select('*')
      .eq('store_id', targetStore.id);
    
    console.log('🔍 Coins in Greece store:', storeCoins?.length || 0);

    return {
      coin,
      store: targetStore,
      totalAdminCoins: verifyCoins?.length || 0,
      storeCoins: storeCoins?.length || 0
    };
    
  } catch (error) {
    console.error('❌ Error in createRealTestCoin:', error);
    throw error;
  }
};

export const verifyEndToEndFlow = async (coinId: string) => {
  try {
    console.log('🔍 Verifying end-to-end flow for coin:', coinId);
    
    // Check coin exists
    const { data: coin } = await supabase
      .from('coins')
      .select('*')
      .eq('id', coinId)
      .single();
    
    if (!coin) {
      throw new Error('Coin not found');
    }
    
    // Check store connection
    const { data: store } = await supabase
      .from('stores')
      .select('*')
      .eq('id', coin.store_id)
      .single();
    
    // Check if coin appears in store query
    const { data: storeCoins } = await supabase
      .from('coins')
      .select('*')
      .eq('store_id', coin.store_id);
    
    // Check if coin appears in user query
    const { data: userCoins } = await supabase
      .from('coins')
      .select('*')
      .eq('user_id', coin.user_id);
    
    // Check if coin appears in featured query
    const { data: featuredCoins } = await supabase
      .from('coins')
      .select('*')
      .eq('featured', true);
    
    // Check if coin appears in category query
    const { data: categoryCoins } = await supabase
      .from('coins')
      .select('*')
      .eq('category', coin.category);
    
    const results = {
      coinExists: !!coin,
      storeExists: !!store,
      appearsInStoreQuery: storeCoins?.some(c => c.id === coinId) || false,
      appearsInUserQuery: userCoins?.some(c => c.id === coinId) || false,
      appearsInFeaturedQuery: featuredCoins?.some(c => c.id === coinId) || false,
      appearsInCategoryQuery: categoryCoins?.some(c => c.id === coinId) || false,
      totalStoreCoins: storeCoins?.length || 0,
      totalUserCoins: userCoins?.length || 0,
      totalFeaturedCoins: featuredCoins?.length || 0,
      totalCategoryCoins: categoryCoins?.length || 0
    };
    
    console.log('🔍 End-to-end verification results:', results);
    
    return results;
    
  } catch (error) {
    console.error('❌ Error in verifyEndToEndFlow:', error);
    throw error;
  }
}; 