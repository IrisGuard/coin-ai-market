import { supabase } from '@/integrations/supabase/client';

export interface TestCoin {
  name: string;
  year: number;
  country: string;
  denomination: string;
  price: number;
  description: string;
  category: string;
  rarity: string;
  grade: string;
  condition: string;
  is_auction: boolean;
  featured: boolean;
  user_id: string;
  store_id: string;
}

export const createTestCoin = async (): Promise<any> => {
  try {
    console.log('🧪 Creating test coin for end-to-end verification...');
    
    // First get the GREECE COIN - ERROR COIN store
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('name', 'GREECE COIN - ERROR COIN')
      .eq('user_id', '47fc544e-c907-4112-949a-4399d7703217')
      .single();

    if (storeError || !store) {
      throw new Error('Greece Coin - Error Coin store not found');
    }

    console.log('✅ Found store:', store.name, 'ID:', store.id);

    const testCoin: TestCoin = {
      name: 'Test Greek 10 Lepta Error Coin',
      year: 1978,
      country: 'Greece',
      denomination: '10 Lepta',
      price: 15.99,
      description: 'Test Greek 10 Lepta coin from 1978 with visible mint error. This is a test coin to verify the store connection and display functionality. Features clear error characteristics and AI verification.',
      category: 'greek',
      rarity: 'Common',
      grade: 'VF',
      condition: 'Very Fine',
      is_auction: false,
      featured: true,
      user_id: '47fc544e-c907-4112-949a-4399d7703217',
      store_id: store.id
    };

    const { data: coin, error } = await supabase
      .from('coins')
      .insert({
        name: testCoin.name,
        year: testCoin.year,
        country: testCoin.country,
        denomination: testCoin.denomination,
        price: testCoin.price,
        description: testCoin.description,
        category: testCoin.category as any,
        rarity: testCoin.rarity,
        grade: testCoin.grade,
        condition: testCoin.condition,
        is_auction: testCoin.is_auction,
        featured: testCoin.featured,
        user_id: testCoin.user_id,
        store_id: testCoin.store_id,
        image: 'https://via.placeholder.com/400x400/888888/ffffff?text=Test+Greek+Coin',
        authentication_status: 'ai_verified',
        ai_confidence: 0.95,
        views: 0,
        favorites: 0,
        sold: false
      } as any)
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('✅ Test coin created successfully:', coin.name, 'ID:', coin.id);
    
    // Log the test creation
    await supabase
      .from('analytics_events')
      .insert({
        event_type: 'test_coin_created',
        page_url: '/admin/test',
        metadata: {
          coin_id: coin.id,
          coin_name: coin.name,
          store_id: store.id,
          store_name: store.name,
          test_purpose: 'end_to_end_verification',
          timestamp: new Date().toISOString()
        }
      });

    return coin;
    
  } catch (error) {
    console.error('❌ Error creating test coin:', error);
    throw error;
  }
};

export const deleteTestCoin = async (coinId: string): Promise<void> => {
  try {
    console.log('🗑️ Deleting test coin:', coinId);
    
    const { error } = await supabase
      .from('coins')
      .delete()
      .eq('id', coinId);

    if (error) {
      throw error;
    }

    console.log('✅ Test coin deleted successfully');
    
  } catch (error) {
    console.error('❌ Error deleting test coin:', error);
    throw error;
  }
}; 