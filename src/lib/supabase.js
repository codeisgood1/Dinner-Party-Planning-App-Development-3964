import { createClient } from '@supabase/supabase-js'

// Project credentials from Supabase
const SUPABASE_URL = 'https://bdflmyjssnuijcqmrduc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkZmxteWpzc251aWpjcW1yZHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTA1NzksImV4cCI6MjA2Nzc2NjU3OX0.b9nHFZ73-ZES39hNA6JauGaY8zpIB_Y1kHs9eTum5jU'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// Create the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Add console log for debugging
console.log('Supabase client initialized with URL:', SUPABASE_URL);

export default supabase;