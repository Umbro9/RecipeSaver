function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;')
}

function formatRecipeText(value) {
    return String(value ?? '')
      .trim()
      .replace(/\*\*\s*(.*?)\s*\*\*/g, '**$1**')
}

function formatRecipeHtml(value) {
    return escapeHtml(formatRecipeText(value))
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
}

function capitalizeFirstLetter(value) {
    return String(value ?? '')
      .replace(/^(\s*(?:\*\*)?)(\p{L})/u, (_, prefix, letter) => {
          return prefix + letter.toLocaleUpperCase('pl-PL')
      })
}

function toListItems(value) {
    return formatRecipeText(value)
      .split(/\r?\n|;/)
      .map(item => item.trim())
      .filter(Boolean)
      .map(item => item.replace(/^[-*]\s+/, '').replace(/^\d+[.)]\s+/, '').trim())
      .map(item => capitalizeFirstLetter(item))
      .filter(Boolean)
}

function renderRecipeList(value) {
    const items = toListItems(value)

    if (!items.length) return '<p>Brak danych.</p>'

    return `
    <ul class="recipe-text-list">
      ${items.map(item => `<li>${formatRecipeHtml(item)}</li>`).join('')}
    </ul>
    `
}

function formatListForCopy(value) {
    const items = toListItems(value)

    if (!items.length) return '- Brak danych.'

    return items
      .map(item => `- ${formatRecipeText(item)}`)
      .join('\n')
}

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

    const copyText = [
      `**${capitalizeFirstLetter(formatRecipeText(data.title))}**`,
      '',
      '🧾 Składniki:',
      formatListForCopy(data.ingredients),
      '',
      '🍳 Przepis:',
      formatListForCopy(data.instructions)
    ].join('\n')

    container.innerHTML = `
    <div class="recipe-full-card">
        <img
          src="${imageUrl}"
          class="recipe-full-image">

        <div class="recipe-title-row">
        <h1>${formatRecipeHtml(capitalizeFirstLetter(data.title))}</h1>

            <div class="recipe-card-toolbar">
                <button type="button" class="copy-recipe-btn" id="copyRecipeBtn">
                    📋 Kopiuj przepis
                </button>
                <span class="copy-recipe-status" id="copyRecipeStatus" aria-live="polite"></span>
            </div>
        </div>

        <div class="recipe-section">
            <h2>🧾 Składniki</h2>
            ${renderRecipeList(data.ingredients)}
        </div>

        <div class="recipe-section">
            <h2>🍳 Przepis</h2>
            ${renderRecipeList(data.instructions)}
        </div>
    </div>
    `

    const copyButton =
      document.getElementById('copyRecipeBtn')

    const copyStatus =
      document.getElementById('copyRecipeStatus')

    copyButton?.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(copyText)

            copyButton.classList.add('is-copied')
            copyStatus.textContent = 'Skopiowano'

            setTimeout(() => {
                copyButton.classList.remove('is-copied')
                copyStatus.textContent = ''
            }, 1800)
        } catch (copyError) {
            console.log(copyError)
            copyStatus.textContent = 'Nie udało się skopiować'
        }
    })
}

loadSingleRecipe()
