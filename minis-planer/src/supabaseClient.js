import { createClient } from '@supabase/supabase-js';
import {supabaseUrl, supabaseAnonKey} from './supabaseData';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);