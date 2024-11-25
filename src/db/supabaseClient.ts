import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_ANON_KEY as string
const serviceKey = process.env.SUPABASE_SERVICE_KEY as string

const supabaseService = createClient(supabaseUrl, serviceKey)

const supabaseAnon = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    }
})

export { supabaseService, supabaseAnon }