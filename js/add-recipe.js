document.addEventListener('DOMContentLoaded', () => {

    const form =
      document.getElementById('addRecipeForm')

    if (!form) return

    const message =
      document.querySelector('.form-message')

    form.addEventListener('submit', async (e) => {

        e.preventDefault()

        const title =
          document.querySelector('input[name="title"]').value

        const ingredients =
          document.querySelector('textarea[name="ingredients"]').value

        const instructions =
          document.querySelector('textarea[name="instructions"]').value

        const imageInput =
          document.querySelector('input[name="image"]')

        const imageFile =
          imageInput?.files[0]

        let imagePath = null

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
        const { error } = await window.sb
            .from('recipes')
            .insert([
                {
                    title,
                    ingredients,
                    instructions,
                    image_url: imagePath
                }
            ])

        if (error) {
            console.log(error)
            message.textContent = 'Błąd ❌'
            return
        }

        message.textContent = 'Zapisano ❤️'

        form.reset()
    })
})
