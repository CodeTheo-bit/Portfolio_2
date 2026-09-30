// Header glass transition on scroll
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  // Smooth scroll for anchor navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Initialize WebGL Light Rays effect on hero
  const lightRaysContainer = document.getElementById('light-rays-hero');
  if (lightRaysContainer && typeof initLightRays === 'function') {
    const rays = initLightRays(lightRaysContainer, {
      raysOrigin: 'right',
      raysColor: '#d0780d',
      raysSpeed: 0.7,
      lightSpread: 0.7,
      rayLength: 1.2,
      followMouse: true,
      mouseInfluence: 0.4,
      noiseAmount: 0.36,
      distortion: 0.6,
      pulsating: true,
      fadeDistance: 1.6,
      saturation: 1.3,
      lightMode: false
    });

    window.lightRaysHero = rays;

    const toggleBtn = document.getElementById('lightRaysToggle');
    if (toggleBtn && rays) {
      toggleBtn.addEventListener('click', () => {
        const active = rays.toggle();
        toggleBtn.classList.toggle('off', !active);
        const label = toggleBtn.querySelector('.label');
        if (label) {
          label.textContent = active ? '✨ Light Rays: ON' : '✨ Light Rays: OFF';
        }
      });
    }
  }
});
