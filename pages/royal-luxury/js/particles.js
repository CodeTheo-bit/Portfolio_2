/* Hero Particle Constellation & Cosmic Nebula */
(function() {
  const c = document.getElementById('hcv');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H;

  function resize() {
    W = c.width = c.offsetWidth;
    H = c.height = c.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Star {
    constructor() {
      this.reset(true);
    }
    reset(initial) {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.sz = Math.random() * 1.5 + 0.2;
      this.life = initial ? Math.random() : 0;
      this.grow = true;
      this.maxA = Math.random() * 0.9 + 0.1;
      this.gold = Math.random() < 0.18;
    }
    tick() {
      if (this.grow) {
        this.life += 0.006;
        if (this.life > 1) this.grow = false;
      } else {
        this.life -= 0.004;
        if (this.life < 0) this.reset(false);
      }
    }
    draw() {
      const a = Math.sin(this.life * Math.PI) * this.maxA;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2);
      ctx.fillStyle = this.gold ? `rgba(212,175,55,${a})` : `rgba(200,200,255,${a})`;
      ctx.fill();
    }
  }

  const stars = [];
  for (let i = 0; i < 230; i++) stars.push(new Star());

  let msx = 0, msy = 0;
  document.addEventListener('mousemove', e => {
    msx = e.clientX;
    msy = e.clientY;
  });

  function nebula(t) {
    [[0.3, 0.5, 90, 0, 10, 0.07], [0.7, 0.4, 60, 0, 5, 0.05], [0.5, 0.7, 80, 5, 0, 0.04]].forEach(([fx, fy, r, rr, gg, a]) => {
      const x = W * fx + Math.sin(t * 0.0003) * W * 0.12;
      const y = H * fy + Math.cos(t * 0.0004) * H * 0.09;
      const g = ctx.createRadialGradient(x, y, 0, x, y, (W * r) / 200);
      g.addColorStop(0, `rgba(${rr},0,${gg},${a})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });

    const mg = ctx.createRadialGradient(msx, msy, 0, msx, msy, 220);
    mg.addColorStop(0, 'rgba(212,175,55,.035)');
    mg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = mg;
    ctx.fillRect(0, 0, W, H);
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(2,2,5,1)';
    ctx.fillRect(0, 0, W, H);
    nebula(t);
    stars.forEach(s => {
      s.tick();
      s.draw();
    });

    // Shooting stars
    if (Math.random() < 0.0025) {
      const sx = Math.random() * W, sy = Math.random() * H * 0.5;
      const len = 80 + Math.random() * 120, ang = Math.PI / 6;
      const gd = ctx.createLinearGradient(sx, sy, sx + len * Math.cos(ang), sy + len * Math.sin(ang));
      gd.addColorStop(0, 'rgba(212,175,55,.9)');
      gd.addColorStop(1, 'rgba(212,175,55,0)');
      ctx.strokeStyle = gd;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + len * Math.cos(ang), sy + len * Math.sin(ang));
      ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
