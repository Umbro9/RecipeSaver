async function loadSingleRecipe() {

    const container =
      document.getElementById('recipeDetails')

    if (!container) return

    const params =
      new URLSearchParams(window.location.search)

    const recipeId =
      params.get('id')

    const { data, error } =
      await window.sb
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single()

    if (error) {
        console.log(error)
        return
    }

    const imageUrl =
      window.getRecipeImageUrl(data.image_url)

    container.innerHTML = `

    <div class="recipe-full-card">

        <img
          src="${imageUrl}"
          class="recipe-full-image">

        <h1>${data.title}</h1>

        <div class="recipe-section">
            <h2>Składniki</h2>
            <p>${data.ingredients}</p>
        </div>

        <div class="recipe-section">
            <h2>Przygotowanie</h2>
            <p>${data.instructions}</p>
        </div>

    </div>
    `
}

loadSingleRecipe()
