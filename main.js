const supabaseUrl = 'https://tkhwuraiwbghiocagymn.supabase.co'
const supabaseKey = 'sb_publishable_1HLJY29Y0nrs8g4cwCMGOg_nzwoKJSg'

const sb = supabase.createClient(supabaseUrl, supabaseKey)

async function loadRecipesCount() {
  const recipesCount = document.getElementById('recipesCount')

  if (!recipesCount) return

  const { count, error } = await sb
    .from('recipes')
    .select('id', {
      count: 'exact',
      head: true
    })

  if (error) {
    console.log(error)
    recipesCount.textContent = '0'
    return
  }

  recipesCount.textContent = count ?? 0
}

document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelectorAll('.year')
    .forEach(year => {
      year.textContent = new Date().getFullYear()
    })

  loadRecipesCount()
})
