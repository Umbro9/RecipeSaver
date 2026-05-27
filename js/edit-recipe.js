async function initEditRecipe() {

    const form =
      document.getElementById('editForm')

    if (!form) return

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

    form.title.value =
      data.title

    form.ingredients.value =
      data.ingredients

    form.instructions.value =
      data.instructions

    form.addEventListener('submit', async (e) => {

        e.preventDefault()

        const formData =
          new FormData(form)

        const title =
          formData.get('title')

        const ingredients =
          formData.get('ingredients')

        const instructions =
          formData.get('instructions')

        await window.sb
          .from('recipes')
          .update({
              title,
              ingredients,
              instructions
          })
          .eq('id', recipeId)

        window.location.href =
          `recipe.html?id=${recipeId}`
    })
}

initEditRecipe()
