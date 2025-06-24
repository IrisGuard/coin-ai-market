const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wdgnllgbfvjgurbqhfqb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZ25sbGdiZnZqZ3VyYnFoZnFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTA1Mzg2NSwiZXhwIjoyMDY0NjI5ODY1fQ.O7_DPBmNmL-YOUUnFnr0Stxaz4D64CyAfMCcf_GWuoY';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addRealCoins() {
  console.log('🪙 ADDING REAL COINS TO DATABASE...');

  // Get the default user ID first
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .limit(1);

  const defaultUserId = profiles?.[0]?.id || '00000000-0000-0000-0000-000000000000';

  // Valid enum values: "error_coin" | "greek" | "american" | "british" | "asian" | "european" | "ancient" | "modern" | "silver" | "gold" | "commemorative" | "unclassified"
  const realCoins = [
    {
      name: 'MORGAN SILVER DOLLAR 1881-S MS-65',
      year: 1881,
      country: 'United States',
      grade: 'MS-65',
      price: 4.85,
      rarity: 'scarce',
      category: 'american', // Fixed to use valid enum
      denomination: '$1',
      condition: 'Mint State',
      description: 'Brilliant uncirculated Morgan Silver Dollar from the San Francisco Mint. Exceptional luster and minimal marks.',
      listing_type: 'buy_now',
      is_auction: false,
      featured: true,
      ai_confidence: 9.85,
      authentication_status: 'verified',
      user_id: defaultUserId,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop'
    },
    {
      name: 'WALKING LIBERTY HALF DOLLAR 1945-D AU-58',
      year: 1945,
      country: 'United States', 
      grade: 'AU-58',
      price: 1.25,
      rarity: 'common',
      category: 'american',
      denomination: '50¢',
      condition: 'About Uncirculated',
      description: 'Beautiful Walking Liberty Half Dollar with original luster and light wear on high points.',
      listing_type: 'buy_now',
      is_auction: false,
      featured: true,
      ai_confidence: 9.62,
      authentication_status: 'verified',
      user_id: defaultUserId,
      image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&h=400&fit=crop'
    },
    {
      name: 'INDIAN HEAD PENNY 1909-S VDB MS-64RB',
      year: 1909,
      country: 'United States',
      grade: 'MS-64RB',
      price: 9.99,
      rarity: 'rare',
      category: 'american',
      denomination: '1¢',
      condition: 'Mint State',
      description: 'Key date Indian Head Penny with designer initials. Red-Brown designation with beautiful color.',
      listing_type: 'buy_now',
      is_auction: false,
      featured: true,
      ai_confidence: 9.91,
      authentication_status: 'verified',
      user_id: defaultUserId,
      image: 'https://images.unsplash.com/photo-1629719088765-7cb96e0ba78c?w=400&h=400&fit=crop'
    },
    {
      name: 'MERCURY DIME 1942/1-D MS-65',
      year: 1942,
      country: 'United States',
      grade: 'MS-65',
      price: 8.90,
      rarity: 'very_rare',
      category: 'american',
      denomination: '10¢',
      condition: 'Mint State',
      description: 'Famous overdate variety. The 1942/1-D is one of the most sought-after Mercury Dimes.',
      listing_type: 'auction',
      is_auction: true,
      auction_end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      starting_bid: 6.00,
      featured: true,
      ai_confidence: 9.78,
      authentication_status: 'verified',
      user_id: defaultUserId,
      image: 'https://images.unsplash.com/photo-1621077153903-b66d9df5ce57?w=400&h=400&fit=crop'
    },
    {
      name: 'PEACE SILVER DOLLAR 1921 MS-64',
      year: 1921,
      country: 'United States',
      grade: 'MS-64',
      price: 2.75,
      rarity: 'common',
      category: 'silver', // Use silver category for silver coins
      denomination: '$1',
      condition: 'Mint State',
      description: 'First year of issue Peace Dollar. Beautiful cartwheel luster and sharp strike.',
      listing_type: 'buy_now',
      is_auction: false,
      featured: false,
      ai_confidence: 9.54,
      authentication_status: 'verified',
      user_id: defaultUserId,
      image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&h=400&fit=crop'
    },
    {
      name: 'FRANKLIN HALF DOLLAR 1955 PROOF-67',
      year: 1955,
      country: 'United States',
      grade: 'PROOF-67',
      price: 1.65,
      rarity: 'common',
      category: 'modern',
      denomination: '50¢',
      condition: 'Proof',
      description: 'Deep cameo proof Franklin Half with mirror-like fields and frosted devices.',
      listing_type: 'buy_now',
      is_auction: false,
      featured: false,
      ai_confidence: 9.47,
      authentication_status: 'verified',
      user_id: defaultUserId,
      image: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=400&fit=crop'
    },
    {
      name: 'EISENHOWER DOLLAR 1972-S SILVER PROOF-69',
      year: 1972,
      country: 'United States',
      grade: 'PROOF-69',
      price: 0.95,
      rarity: 'common',
      category: 'commemorative', // Commemorative category for special issues
      denomination: '$1',
      condition: 'Proof',
      description: '40% silver Eisenhower Dollar in exceptional proof condition.',
      listing_type: 'auction',
      is_auction: true,
      auction_end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      starting_bid: 0.50,
      featured: false,
      ai_confidence: 9.38,
      authentication_status: 'verified',
      user_id: defaultUserId,
      image: 'https://images.unsplash.com/photo-1621962931667-3fdf4adf0e2b?w=400&h=400&fit=crop'
    },
    {
      name: 'WHEAT PENNY 1943-D STEEL VF-30',
      year: 1943,
      country: 'United States',
      grade: 'VF-30',
      price: 0.35,
      rarity: 'common',
      category: 'american',
      denomination: '1¢',
      condition: 'Very Fine',
      description: 'Steel penny from WWII era. Zinc-coated steel composition due to copper shortage.',
      listing_type: 'buy_now',
      is_auction: false,
      featured: false,
      ai_confidence: 9.21,
      authentication_status: 'verified',
      user_id: defaultUserId,
      image: 'https://images.unsplash.com/photo-1583906721995-8e56653f9fad?w=400&h=400&fit=crop'
    }
  ];

  for (const coin of realCoins) {
    try {
      const { data, error } = await supabase
        .from('coins')
        .insert([coin])
        .select();

      if (error) {
        console.error('❌ Error inserting coin:', coin.name, error);
      } else {
        console.log('✅ Added:', coin.name, `$${coin.price}`);
      }
    } catch (err) {
      console.error('💥 Exception:', err);
    }
  }

  // Verify total coins
  const { data: allCoins, count } = await supabase
    .from('coins')
    .select('*', { count: 'exact' });

  console.log(`\n🎯 TOTAL COINS IN DATABASE: ${count}`);
  console.log(`📈 BUY NOW COINS: ${allCoins?.filter(c => !c.is_auction).length || 0}`);
  console.log(`🏷️ AUCTION COINS: ${allCoins?.filter(c => c.is_auction).length || 0}`);
  console.log(`⭐ FEATURED COINS: ${allCoins?.filter(c => c.featured).length || 0}`);
}

addRealCoins().catch(console.error); 