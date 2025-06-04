
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wdgnllgbfvjgurbqhfqb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZ25sbGdiZnZqZ3VyYnFoZnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MzA4MjksImV4cCI6MjA0OTUwNjgyOX0.XTKxF0kT9aH_HZPGZEqH4qGa_B2kK2VJH7dKZW4N0Zs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
