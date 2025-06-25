import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oxpzfadgqkplcwqspnxn.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixAllSupabaseIssues() {
  console.log('🔧 ΑΡΧΗ ΔΙΟΡΘΩΣΗΣ SUPABASE SECURITY & PERFORMANCE ISSUES...')
  
  try {
    // 1. Verify current database state - NO CHANGES TO DATA
    console.log('1️⃣ Verifying current database state...')
    const { data: coins, error: coinsError } = await supabase
      .from('coins')
      .select('*')
      .order('created_at', { ascending: true })

    if (coinsError) {
      console.error('❌ Error checking coins:', coinsError.message)
    } else {
      console.log(`✅ Current coins in database: ${coins.length}`)
      if (coins.length > 0) {
        console.log('📋 EXISTING COINS (UNCHANGED):')
        coins.forEach(coin => {
          console.log(`   - ${coin.title} (${coin.listing_type}) - $${coin.price}`)
          console.log(`     Created: ${coin.created_at}`)
        })
      } else {
        console.log('⚠️ No coins found in database')
      }
    }

    // 2. Check stores
    console.log('\n2️⃣ Checking stores...')
    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('*')
      .order('created_at', { ascending: true })

    if (storesError) {
      console.error('❌ Error checking stores:', storesError.message)
    } else {
      console.log(`✅ Current stores in database: ${stores.length}`)
      stores.forEach(store => {
        console.log(`   - ${store.store_name} (${store.verification_status})`)
      })
    }

    console.log('\n🎉 DATABASE VERIFICATION COMPLETED!')
    console.log('📝 SECURITY ISSUES SUMMARY:')
    console.log('   ⚠️ Function search_path mutable: NEEDS MANUAL FIX IN SUPABASE DASHBOARD')
    console.log('   ⚠️ Unindexed foreign keys: 70+ performance warnings')
    console.log('   ⚠️ Unused indexes: 50+ cleanup needed')
    console.log('   ⚠️ Leaked Password Protection: ENABLE IN AUTH SETTINGS')
    
    console.log('\n📋 MANUAL ACTIONS REQUIRED:')
    console.log('1. Go to Supabase Dashboard > SQL Editor')
    console.log('2. Execute the migration file: 20250623200000_fix_all_security_performance.sql')
    console.log('3. Go to Authentication > Settings > Enable "Leaked Password Protection"')
    console.log('4. Review and apply database linter recommendations')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Execute the verification
fixAllSupabaseIssues() 