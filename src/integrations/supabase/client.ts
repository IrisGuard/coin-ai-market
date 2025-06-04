
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wdgnllgbfvjgurbqhfqb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZ25sbGdiZnZqZ3VyYnFoZnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4Mzg5MTMsImV4cCI6MjA0OTQxNDkxM30.4KmZ3LPt1YwKFKaYlQfYHUmZCpLxJtv3s6UNzIzWsjM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
