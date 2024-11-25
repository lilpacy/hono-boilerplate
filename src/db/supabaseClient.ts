import { createClient } from "@supabase/supabase-js";
import { Context } from "hono";

const getSupabaseClient = (c: Context) => {
  const supabaseUrl = c.env.SUPABASE_URL as string;
  const supabaseKey = c.env.SUPABASE_ANON_KEY as string;
  const serviceKey = c.env.SUPABASE_SERVICE_KEY as string;

  const supabaseService = createClient(supabaseUrl, serviceKey);

  const supabaseAnon = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  return { supabaseAnon, supabaseService };
};

export type SupabaseClients = ReturnType<typeof getSupabaseClient>;

export { getSupabaseClient };
