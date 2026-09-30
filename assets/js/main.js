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
      raysOrigin: 'top-center',
      raysColor: '#faf7f2', // Neutral luminous off-white rays
      raysSpeed: 0.85,
      lightSpread: 1.2,
      rayLength: 2.2,
      pulsating: true,
      fadeDistance: 1.0,
      saturation: 1.15,
      followMouse: true,
      mouseInfluence: 0.18,
      noiseAmount: 0.02,
      distortion: 0.04,
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
