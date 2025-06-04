
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://blvujdcdiwtgvmbuavgi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsdnVqZGNkaXd0Z3ZtYnVhdmdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjU0NTUsImV4cCI6MjA2NDY0MTQ1NX0.WxGcy3GHqxir7Jo49nbE1z88ED8BNw3LnAHyPUROG_A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
