import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://gjbehlwydtaawbecuhcx.supabase.co', 'sb_publishable_SkKR1wqL6kw2vX-QHvHRgA_CxM3IBaB')

export default supabase;