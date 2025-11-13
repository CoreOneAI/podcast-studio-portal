// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// **IMPORTANT**: Replace these with your actual Supabase project URL and keys
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Create a single Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/*
Usage Note:
For security, ensure these environment variables are loaded correctly
in your development environment and deployment pipeline (e.g., Netlify).
*/