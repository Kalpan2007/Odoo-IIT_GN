import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client for general operations with RLS
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce' // Use PKCE flow for better security
  }
});

// Admin client for operations that bypass RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test the connection
async function testConnection() {
  try {
    const { data, error } = await supabaseAdmin.rpc('version');
    if (error) {
      console.warn('Warning: Could not connect to Supabase:', error.message);
    } else {
      console.log('Successfully connected to Supabase');
    }
  } catch (err: any) {
    console.warn('Warning: Could not test Supabase connection:', err.message);
  }
}

testConnection();

export default supabase;