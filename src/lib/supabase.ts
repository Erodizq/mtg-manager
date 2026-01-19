import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Falta configuración de Supabase (URL o Anon Key)");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
