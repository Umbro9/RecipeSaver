async function loadRecipesCount() {
  const recipesCount = document.getElementById('recipesCount')

  if (!recipesCount) return

  const { count, error } = await window.sb
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
