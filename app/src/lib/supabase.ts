import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Basic validation to prevent immediate crash with default values
const isValidUrl = (url: string) => url && url.startsWith('http') && !url.includes('your_supabase_url');

if (!isValidUrl(supabaseUrl)) {
  console.warn('⚠️ Supabase credentials are missing or invalid (using placeholder). Auth features will not work.');
}

// Create client with fallback empty strings if invalid, but this might still throw if used
// We'll trust the AuthContext to catch execution errors.
export const supabase = createClient(
  isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)
