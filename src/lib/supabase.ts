
import { createClient } from '@supabase/supabase-js';

// These should be environment variables in a production app
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anonymous Key. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our Supabase tables
export type ProfileType = {
  id: string;
  name: string;
  title: string;
  tagline: string;
  skills: string[];
  passion: string;
  github_url: string;
  linkedin_url: string;
  email: string;
  created_at?: string;
};

export type ProjectType = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  challenge?: string;
  solution?: string;
  github_url?: string;
  demo_url?: string;
  code_snippet?: string;
  code_language?: string;
  featured: boolean;
  created_at?: string;
};
