import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Client for authenticated user requests (uses anon key + user JWT)
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceKey);
