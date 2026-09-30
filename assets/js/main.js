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

  // Initialize React Bits Ferrofluid background across the entire page
  const ferrofluidContainer = document.getElementById('ferrofluid-bg');
  if (ferrofluidContainer && typeof initFerrofluid === 'function') {
    const fluid = initFerrofluid(ferrofluidContainer, {
      colors: ["#c6b4e5", "#ffffff", "#923847"],
      speed: 0.2,
      scale: 1,
      turbulence: 0.15,
      fluidity: 0.11,
      rimWidth: 0.12,
      sharpness: 1.6,
      shimmer: 1.2,
      glow: 1.1,
      flowDirection: "left",
      opacity: 1,
      mouseInteraction: false,
      mouseStrength: 1,
      mouseRadius: 0.55
    });
    window.ferrofluidBackground = fluid;
  }
});
