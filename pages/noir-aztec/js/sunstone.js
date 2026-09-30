/* Sun Stone (Piedra del Sol) generative SVG geometry and parallax */
(function() {
  const cx = 200, cy = 200, NS = 'http://www.w3.org/2000/svg';
  const rays = document.getElementById('rays');
  if (rays) {
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2, r1 = 150, r2 = i % 2 ? 188 : 172;
      const l = document.createElementNS(NS, 'line');
      l.setAttribute('x1', cx + Math.cos(a) * r1);
      l.setAttribute('y1', cy + Math.sin(a) * r1);
      l.setAttribute('x2', cx + Math.cos(a) * r2);
      l.setAttribute('y2', cy + Math.sin(a) * r2);
      l.setAttribute('stroke', '#D4C4B0');
      l.setAttribute('stroke-width', '0.8');
      rays.appendChild(l);
    }
  }

  const petals = document.getElementById('petals');
  if (petals) {
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2, a2 = ((i + 0.5) / 20) * Math.PI * 2;
      const p = document.createElementNS(NS, 'path');
      const x1 = cx + Math.cos(a) * 78, y1 = cy + Math.sin(a) * 78;
      const x2 = cx + Math.cos(a2) * 120, y2 = cy + Math.sin(a2) * 120;
      const xm = cx + Math.cos(a) * 120, ym = cy + Math.sin(a) * 120;
      p.setAttribute('d', `M${x1} ${y1} L${xm} ${ym} L${x2} ${y2}`);
      p.setAttribute('stroke', '#4A7A92');
      p.setAttribute('stroke-width', '0.7');
      p.setAttribute('fill', 'none');
      petals.appendChild(p);
    }
  }

  // Parallax effect on scroll
  const sun = document.getElementById('sun');
  if (sun) {
    window.addEventListener('scroll', () => {
      sun.style.transform = `translateY(calc(-50% + ${window.scrollY * 0.06}px))`;
    }, { passive: true });
  }
})();
