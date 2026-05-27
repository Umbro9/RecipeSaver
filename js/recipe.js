async function loadSingleRecipe() {

    const container =
      document.getElementById('recipeDetails')

    if (!container) return

    const params =
      new URLSearchParams(window.location.search)

    const recipeId =
      params.get('id')

    const { data, error } =
      await sb
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single()

    if (error) {
        console.log(error)
        return
    }

    let imageUrl =
      'assets/default-food.jpg'

    if (data.image_url) {

        const { data: imageData } =
          sb.storage
            .from('recipe-images')
            .getPublicUrl(data.image_url)

        imageUrl =
          imageData.publicUrl
    }

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