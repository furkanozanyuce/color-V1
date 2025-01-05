import { createClient } from '@supabase/supabase-js';
import { getBrowserId } from '../utils/sessionUtils';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey,
  {
    global: {
      headers: {
        'browser-id': getBrowserId()
      }
    }
  }
);