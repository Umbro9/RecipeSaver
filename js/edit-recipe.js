async function initEditRecipe() {

    const form =
      document.getElementById('editForm')

    if (!form) return

    const imageInput =
      document.getElementById('imageInput')

    const imagePreview =
      document.getElementById('imagePreview')

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

    const deleteBtn =

  document.getElementById('deleteBtn')

deleteBtn?.addEventListener('click', async () => {

    if (!confirm('Na pewno usunąć przepis?')) {
        return
    }


    const imagePath = data.image_url

    const { error } =
      await window.sb
        .from('recipes')
        .delete()
        .eq('id', recipeId)

    if (error) {
        console.log(error)
        return
    }

    if (imagePath) {
        const { error: storageError } =
          await window.sb.storage
            .from('recipes-images')
            .remove([imagePath])

        if (storageError) {
            console.log(storageError)
        }
    }

    window.location.href = 'recipes.html'
})

    form.title.value =
      data.title

    form.ingredients.value =
      data.ingredients

    form.instructions.value =
      data.instructions

    // Load current image

if (data.image_url) {
    const imageUrl = window.getRecipeImageUrl(data.image_url)

    imagePreview.src = imageUrl
    imagePreview.style.display = 'block'
}


    // Handle image preview on file select
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0]
        
        if (file) {
            const reader = new FileReader()
            
              reader.onload = (event) => {
                  imagePreview.src = event.target.result
                  imagePreview.style.display = 'block'
              }

            
            reader.readAsDataURL(file)
        }
    })

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

        const imageFile =
          imageInput.files[0]

        let imagePath = data.image_url

        // Upload new image if selected
        if (imageFile) {
            const fileName =
              `${Date.now()}-${imageFile.name}`

            const { error: uploadError } =
              await window.sb.storage
                .from('recipes-images')
                .upload(fileName, imageFile)

            if (uploadError) {
                console.log(uploadError)
                return
            }

            imagePath = fileName
        }

        await window.sb
          .from('recipes')
          .update({
              title,
              ingredients,
              instructions,
              image_url: imagePath
          })
          .eq('id', recipeId)

        window.location.href =
          `recipe.html?id=${recipeId}`
    })
}

initEditRecipe()
