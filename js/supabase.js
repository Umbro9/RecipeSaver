const supabaseUrl = 'https://tkhwuraiwbghiocagymn.supabase.co'
const supabaseKey = 'sb_publishable_1HLJY29Y0nrs8g4cwCMGOg_nzwoKJSg'

window.sb =
  supabase.createClient(
    supabaseUrl,
    supabaseKey
  )

window.getRecipeImageUrl = function getRecipeImageUrl(imagePath) {
  if (!imagePath) return 'default-food.jpg'

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath
  }

  return window.sb
    .storage
    .from('recipes-images')
    .getPublicUrl(imagePath)
    .data
    .publicUrl
}
