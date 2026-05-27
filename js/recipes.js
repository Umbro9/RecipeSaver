async function loadRecipes() {

    const grid =
      document.getElementById('recipesGrid')

    if (!grid) return

    const { data, error } =
      await sb
        .from('recipes')
        .select('*')
        .order('created_at', {
            ascending: false
        })

    if (error) {
        console.log(error)
        return
    }

    grid.innerHTML = ''

    data.forEach(recipe => {

        let imageUrl =
          'default-food.jpg'

        if (recipe.image_url) {

            const { data } =
              sb.storage
                .from('recipes-images')
                .getPublicUrl(recipe.image_url)

            imageUrl =
              data.publicUrl
        }

        const shortText =
          recipe.instructions?.length > 120
            ? recipe.instructions.substring(0, 120) + '...'
            : recipe.instructions

        grid.innerHTML += `

        <div class="recipe-card">

            <img
              src="${imageUrl}"
              class="recipe-image">

            <h2>${recipe.title}</h2>

            <p>${shortText}</p>

            <div class="recipe-buttons">

                <a
                  href="recipe.html?id=${recipe.id}"
                  class="btn">
                  Otwórz
                </a>

                <a
                  href="edit-recipe.html?id=${recipe.id}"
                  class="btn secondary-btn">
                  Edytuj
                </a>

            </div>

        </div>
        `
    })
}

loadRecipes()