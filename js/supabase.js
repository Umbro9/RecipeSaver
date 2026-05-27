const supabaseUrl = 'https://tkhwuraiwbghiocagymn.supabase.co'
const supabaseKey = 'sb_publishable_1HLJY29Y0nrs8g4cwCMGOg_nzwoKJSg'

window.sb =
  supabase.createClient(
    supabaseUrl,
    supabaseKey
  )