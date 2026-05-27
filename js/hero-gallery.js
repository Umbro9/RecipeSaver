// 🔥 helper do backgroundu body
function setBodyBg(url) {
  document.body.style.backgroundImage = `url(${url})`
}

async function loadHeroGallery() {

  const container = document.getElementById('heroGallery')
  if (!container) return

  const { data, error } = await window.sb
    .from('recipes')
    .select('image_url')
    .order('created_at', { ascending: false })

  if (error) {
    console.log(error)
    return
  }

  let images = data
    .filter(r => r.image_url)
    .map(r => window.getRecipeImageUrl(r.image_url))
    .filter(Boolean)

  images = [...new Set(images)].slice(0, 5)

  const fallback = 'default-food.jpg'

  while (images.length < 5) {
    images.push(fallback)
  }

  // FRONT SLIDES
  container.innerHTML = images.map((url, i) => `
    <div class="hero-slide ${i === 0 ? 'active' : ''}">
      <img src="${url}">
    </div>
  `).join('')



  let current = 0


  // FRONT SLIDER (5s)
  setInterval(() => {

    const slides = document.querySelectorAll('.hero-slide')

    slides[current].classList.remove('active')

    current = (current + 1) % slides.length

    slides[current].classList.add('active')

  }, 5000)


}

loadHeroGallery()
