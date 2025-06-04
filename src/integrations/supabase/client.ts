
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://saimszsekjafmqqcvcgx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhaW1zenNla2phZm1xcWN2Y2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MzM4NjcsImV4cCI6MjA2MzAwOTg2N30.o5x0i7u4NJ20RPb9hjBaRsjvDdTw6rwwkc-SDx1Morw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
