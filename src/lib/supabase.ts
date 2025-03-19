
import { createClient } from '@supabase/supabase-js';

// These should be environment variables in a production app
const supabaseUrl = 'https://dlmnucgxnwcrtteurfgr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsbW51Y2d4bndjcnR0ZXVyZmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MTE1MTQsImV4cCI6MjA1NjI4NzUxNH0.ApU-pZbTxbsA8dKyyg2Cxhz_3yy1dkz-2BN2k1-Z3ho';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anonymous Key. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
