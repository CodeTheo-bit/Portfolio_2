/* Navigation & Scroll Reveal */
(function() {
  const nav = document.getElementById('nav');
  const links = document.querySelectorAll('.nlinks a');
  const ids = ['top', 'work', 'about', 'caps', 'contact'];

  window.addEventListener('scroll', () => {
    if (nav) {
      nav.classList.toggle('s', window.scrollY > 50);
    }
    let cur = 'top';
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 260) {
        cur = id;
      }
    });
    links.forEach(a => {
      a.classList.toggle('act', a.getAttribute('href') === '#' + cur);
    });
  });

  const ham = document.getElementById('ham');
  const mm = document.getElementById('mm');
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

  // Scroll reveal observer
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('on');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.rv').forEach(el => io.observe(el));
})();
