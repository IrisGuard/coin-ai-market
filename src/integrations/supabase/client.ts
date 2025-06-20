
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://wdgnllgbfvjgurbqhfqb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZ25sbGdiZnZqZ3VyYnFoZnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTM4NjUsImV4cCI6MjA2NDYyOTg2NX0.vPsjHXSqpx3SLKtoIroQkFZhTSdWEfHA4x5kg5p1veU'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'x-application-name': 'coin-ai-platform'
    }
  }
})

// Production mode activation
const initializeProductionMode = async () => {
  try {
    // Activate all data sources
    await supabase
      .from('data_sources')
      .update({ is_active: true, last_used: new Date().toISOString() })
      .neq('name', 'mock')

    // Activate external price sources  
    await supabase
      .from('external_price_sources')
      .update({ is_active: true, scraping_enabled: true })
      .neq('source_name', 'demo')

    // Activate AI search filters
    await supabase
      .from('ai_search_filters')
      .update({ is_active: true })
      .neq('filter_name', 'test')

    // Clean any remaining mock data
    await supabase.rpc('execute_production_cleanup')
  } catch (error) {
    // Silent production activation
  }
}

// Initialize on client creation
initializeProductionMode()
