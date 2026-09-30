/* Navigation & Scroll Observers */
(function() {
  const nav = document.getElementById('nav');
  const nas = document.querySelectorAll('.nlinks a');
  const sids = ['home', 'about', 'skills', 'projects', 'interests', 'contact'];

  window.addEventListener('scroll', () => {
    if (nav) {
      nav.classList.toggle('s', window.scrollY > 60);
    }
    let cur = 'home';
    sids.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 250) {
        cur = id;
      }
    });
    nas.forEach(a => a.classList.toggle('act', a.getAttribute('href') === '#' + cur));
  });

  const ham = document.getElementById('ham');
  const mm = document.getElementById('mmenu');
  if (ham && mm) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('o');
      mm.classList.toggle('show');
    });
    mm.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        ham.classList.remove('o');
        mm.classList.remove('show');
      });
    });
  }

  /* SCROLL REVEAL OBSERVERS */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('on');
    });
  }, { threshold: 0.09 });

  document.querySelectorAll('.rv, .rvl, .rvr').forEach(el => ro.observe(el));

  const bo = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const b = e.target.querySelector('.sbar');
        if (b) {
          setTimeout(() => {
            b.style.width = (e.target.dataset.p || 0) + '%';
          }, 220);
        }
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.scell').forEach(el => bo.observe(el));

  /* WebGL Volumetric Light Rays */
  const lightRaysContainer = document.getElementById('light-rays-hero');
  if (lightRaysContainer && typeof initLightRays === 'function') {
    window.royalLightRays = initLightRays(lightRaysContainer, {
      raysOrigin: 'top-center',
      raysColor: '#faf7f2', // Luminous off-white
      raysSpeed: 0.95,
      lightSpread: 1.35,
      rayLength: 2.6,
      pulsating: true,
      fadeDistance: 1.2,
      saturation: 1.2,
      followMouse: true,
      mouseInfluence: 0.22,
      noiseAmount: 0.03,
      distortion: 0.05,
      lightMode: false
    });
  }
})();

