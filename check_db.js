import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://wdgnllgbfvjgurbqhfqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZ25sbGdiZnZqZ3VyYnFoZnFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTA1Mzg2NSwiZXhwIjoyMDY0NjI5ODY1fQ.O7_DPBmNmL-YOUUnFnr0Stxaz4D64CyAfMCcf_GWuoY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('🔍 CHECKING SUPABASE DATABASE...\n');
  
  try {
    // 1. Check all stores
    console.log('1️⃣ ALL STORES:');
    const { data: allStores, error: storesError } = await supabase
      .from('stores')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (storesError) {
      console.error('❌ Error fetching stores:', storesError);
      return;
    }
    
    console.log(`Found ${allStores.length} total stores:`);
    allStores.forEach((store, index) => {
      console.log(`${index + 1}. ${store.name} (ID: ${store.id})`);
      console.log(`   - User ID: ${store.user_id}`);
      console.log(`   - Active: ${store.is_active}`);
      console.log(`   - Verified: ${store.verified}`);
      console.log(`   - Created: ${store.created_at}`);
      console.log('');
    });
    
    // 2. Check admin profiles
    console.log('2️⃣ ADMIN PROFILES:');
    const { data: adminProfiles, error: adminError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin');
    
    if (adminError) {
      console.error('❌ Error fetching admin profiles:', adminError);
    } else {
      console.log(`Found ${adminProfiles.length} admin profiles:`);
      adminProfiles.forEach((profile, index) => {
        console.log(`${index + 1}. ${profile.full_name || profile.username || 'No name'} (ID: ${profile.id})`);
        console.log(`   - Email: ${profile.email || 'No email'}`);
        console.log(`   - Role: ${profile.role}`);
        console.log('');
      });
    }
    
    // 3. Check WORLD COINS stores specifically
    console.log('\n3️⃣ WORLD COINS STORES:');
    const worldCoinsStores = allStores.filter(s => s.name.includes('WORLD COINS'));
    console.log(`Found ${worldCoinsStores.length} WORLD COINS stores:`);
    worldCoinsStores.forEach((store, index) => {
      console.log(`${index + 1}. ${store.name}`);
      console.log(`   - Active: ${store.is_active}`);
      console.log(`   - Verified: ${store.verified}`);
      console.log(`   - User ID: ${store.user_id}`);
      
      // Check if user is admin
      const isAdminStore = adminProfiles.some(admin => admin.id === store.user_id);
      console.log(`   - Is Admin Store: ${isAdminStore}`);
      console.log('');
    });
    
    // 4. Check RLS policies
    console.log('4️⃣ CHECKING RLS POLICIES:');
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_table_policies', { table_name: 'stores' });
    
    if (policiesError) {
      console.log('❌ Could not fetch RLS policies (this is normal)');
    } else {
      console.log('RLS Policies found:', policies);
    }
    
    // 5. Test the exact query from useDealerStores
    console.log('5️⃣ TESTING DEALER STORES QUERY:');
    const adminUserIds = adminProfiles.map(p => p.id);
    
    const visibleStores = allStores.filter(store => {
      const isAdminStore = adminUserIds.includes(store.user_id);
      
      if (isAdminStore) {
        console.log(`Admin store ${store.name}: active=${store.is_active}`);
        return store.is_active === true;
      } else {
        console.log(`Regular store ${store.name}: active=${store.is_active}, verified=${store.verified}`);
        return store.is_active === true && store.verified === true;
      }
    });
    
    console.log(`\n✅ VISIBLE STORES: ${visibleStores.length}`);
    visibleStores.forEach(store => {
      const isAdminStore = adminUserIds.includes(store.user_id);
      console.log(`- ${store.name} (Admin: ${isAdminStore})`);
    });
    
    // 6. Test specific WORLD COINS query
    console.log('\n6️⃣ TESTING WORLD COINS QUERY:');
    const { data: worldCoinsQuery, error: worldCoinsError } = await supabase
      .from('stores')
      .select('*')
      .in('name', ['WORLD COINS', 'WORLD COINS ERROR'])
      .eq('is_active', true);
    
    if (worldCoinsError) {
      console.error('❌ Error in WORLD COINS query:', worldCoinsError);
    } else {
      console.log(`Found ${worldCoinsQuery.length} active WORLD COINS stores:`);
      worldCoinsQuery.forEach(store => {
        console.log(`- ${store.name}: active=${store.is_active}, verified=${store.verified}`);
      });
    }
    
  } catch (error) {
    console.error('❌ General error:', error);
  }
}

checkDatabase(); 