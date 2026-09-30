/* Interactive Widgets: Trading, Bookshelf, Basketball, Leaderboard, & F1 Track */

/* 1. TRADING TICKER & MINI-CHART */
(function() {
  const stocks = [
    { id: 't1', sym: 'AAPL', base: 189 },
    { id: 't2', sym: 'TSLA', base: 242 },
    { id: 't3', sym: 'NVDA', base: 875 },
    { id: 't4', sym: 'BTC',  base: 68400 }
  ];
  stocks.forEach(s => {
    s.price = s.base + (Math.random() - 0.5) * s.base * 0.04;
    s.history = [s.price];
  });

  function update() {
    stocks.forEach(s => {
      s.price = Math.max(s.price + (Math.random() - 0.48) * s.base * 0.008, s.base * 0.85);
      s.history.push(s.price);
      if (s.history.length > 50) s.history.shift();
      const row = document.getElementById(s.id);
      if (!row) return;
      const chg = ((s.price - s.base) / s.base) * 100;
      row.querySelector('.tprice').textContent = '$' + s.price.toFixed(s.base > 1000 ? 0 : 2);
      const ce = row.querySelector('.tchg');
      ce.textContent = (chg >= 0 ? '+' : '') + chg.toFixed(2) + '%';
      ce.className = 'tchg ' + (chg >= 0 ? 'up' : 'dn');
    });

    const cv = document.getElementById('chartcv');
    if (!cv) return;
    cv.width = cv.offsetWidth;
    const ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
    const pts = stocks[0].history, mn = Math.min(...pts), mx2 = Math.max(...pts) + 1;
    ctx.clearRect(0, 0, W, H);
    
    const grd = ctx.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, 'rgba(212,175,55,.25)');
    grd.addColorStop(1, 'rgba(212,175,55,0)');
    
    ctx.beginPath();
    ctx.moveTo(0, H - ((pts[0] - mn) / (mx2 - mn)) * H);
    pts.forEach((p, i) => ctx.lineTo((i / (pts.length - 1)) * W, H - ((p - mn) / (mx2 - mn)) * H));
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = grd;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, H - ((pts[0] - mn) / (mx2 - mn)) * H);
    pts.forEach((p, i) => ctx.lineTo((i / (pts.length - 1)) * W, H - ((p - mn) / (mx2 - mn)) * H));
    ctx.strokeStyle = 'rgba(212,175,55,.8)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  update();
  setInterval(update, 1200);
})();

/* 2. BOOKSHELF HOVER TIP */
(function() {
  const tip = document.getElementById('btip');
  if (!tip) return;
  document.querySelectorAll('.book').forEach(b => {
    b.addEventListener('mouseenter', () => {
      tip.textContent = '"' + b.dataset.title + '" - ' + b.dataset.auth;
      tip.classList.add('show');
    });
    b.addEventListener('mouseleave', () => tip.classList.remove('show'));
  });
})();

/* 3. INTERACTIVE BASKETBALL SHOOTER */
(function() {
  const cv = document.getElementById('bballcv');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, made = 0, attempts = 0, streak = 0, balls = [];

  function resize() {
    W = cv.width = cv.offsetWidth;
    H = cv.height = 140;
  }
  resize();
  window.addEventListener('resize', resize);

  const hX = () => W * 0.5, hY = 28, hR = 14;

  function draw() {
    ctx.fillStyle = '#0d0d18';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(212,175,55,.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H - 8);
    ctx.lineTo(W, H - 8);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(hX(), H, W * 0.38, Math.PI, 0);
    ctx.strokeStyle = 'rgba(212,175,55,.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,.15)';
    ctx.fillRect(hX() - 22, 10, 44, 6);

    ctx.beginPath();
    ctx.arc(hX(), hY, hR, 0, Math.PI * 2);
    ctx.strokeStyle = '#ff6600';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    for (let i = 0; i < 7; i++) {
      const ax = hX() - hR + i * (hR * 2 / 6), bx = hX() - hR * 0.6 + i * (hR * 1.2 / 6);
      ctx.beginPath();
      ctx.moveTo(ax, hY);
      ctx.lineTo(bx, hY + 16);
      ctx.strokeStyle = 'rgba(255,255,255,.25)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    ctx.font = '200 9px Raleway';
    ctx.fillStyle = 'rgba(212,175,55,.3)';
    ctx.textAlign = 'center';
    ctx.fillText('Click to shoot', W / 2, H - 14);
    ctx.textAlign = 'left';
  }

  class Ball {
    constructor(sx, sy) {
      this.x = sx;
      this.y = sy;
      this.vx = (hX() - sx) * 0.01;
      this.vy = -8 - Math.random() * 3;
      this.done = false;
      this.scored = false;
      this.glow = 1;
      attempts++;
    }
    tick() {
      this.vy += 0.38;
      this.x += this.vx;
      this.y += this.vy;
      const dx = this.x - hX(), dy = this.y - hY;
      if (Math.sqrt(dx * dx + dy * dy) < hR + 9 && this.vy > 0 && !this.done) {
        this.done = true;
        if (Math.abs(dx) < hR * 0.7) {
          this.scored = true;
          made++;
          streak++;
          document.getElementById('bsmade').textContent = made;
          document.getElementById('bsstreak').textContent = streak;
        } else {
          streak = 0;
          document.getElementById('bsstreak').textContent = 0;
        }
        document.getElementById('bspct').textContent = Math.round((made / attempts) * 100) + '%';
      }
      if (this.y > H + 20) this.done = true;
      this.glow = Math.max(0, this.glow - 0.02);
    }
    render() {
      const grd = ctx.createRadialGradient(this.x - 2, this.y - 2, 1, this.x, this.y, 9);
      grd.addColorStop(0, '#ff8833');
      grd.addColorStop(1, '#c24400');
      ctx.beginPath();
      ctx.arc(this.x, this.y, 9, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      if (this.scored && this.glow > 0) {
        ctx.fillStyle = `rgba(0,220,100,${this.glow})`;
        ctx.font = 'bold 11px Cinzel';
        ctx.textAlign = 'center';
        ctx.fillText('+2', this.x, this.y - 14);
        ctx.textAlign = 'left';
      }
    }
  }

  cv.addEventListener('click', e => {
    const r = cv.getBoundingClientRect();
    balls.push(new Ball(e.clientX - r.left, e.clientY - r.top));
  });

  function loop() {
    draw();
    balls = balls.filter(b => !b.done);
    balls.forEach(b => {
      b.tick();
      b.render();
    });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* 4. LEADERBOARD & WIN-RATE */
(function() {
  const board = document.getElementById('lboard');
  if (!board) return;
  const P = [
    { n: 'P J Tivin Elvis', s: 2847, y: true },
    { n: 'Alex Chen', s: 2731 },
    { n: 'Riya Patel', s: 2680 },
    { n: 'Jordan Kim', s: 2540 },
    { n: 'Sam Torres', s: 2410 }
  ];
  const R = ['#1', '#2', '#3', '#4', '#5'], RC = ['gd', 'sv', 'br', '', ''];
  board.innerHTML = P.map((p, i) =>
    `<div class="lrow"><span class="lrank ${RC[i]}">${R[i]}</span><span class="lname">${p.n + (p.y ? ' <span style="color:var(--gold);font-size:.46rem">YOU</span>' : '')}</span><span class="lscore">${p.s.toLocaleString()}</span></div><div class="lbar"><div class="lfill" data-w="${Math.round((p.s / 2847) * 100)}" style="width:0"></div></div>`
  ).join('');

  const wio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.lfill').forEach(f => setTimeout(() => f.style.width = f.dataset.w + '%', 400));
        setTimeout(() => {
          const cb = document.getElementById('cbfill');
          if (cb) cb.style.width = '74%';
          const cp = document.getElementById('cbpct');
          if (cp) cp.textContent = '74%';
        }, 600);
        wio.disconnect();
      }
    });
  }, { threshold: 0.2 });

  wio.observe(board);
})();

/* 5. FORMULA 1 RACING TRACK */
(function() {
  const c = document.getElementById('tcv2');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H;

  function resize() {
    W = c.width = c.offsetWidth;
    H = c.height = 220;
  }
  resize();
  window.addEventListener('resize', resize);

  function getPts() {
    const a = [], n = 80, cx = W / 2, cy = H / 2, rx = W * 0.38, ry = H * 0.36;
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2;
      a.push({
        x: cx + rx * (Math.cos(t) + Math.sin(t * 2) * 0.08),
        y: cy + ry * (Math.sin(t) + Math.cos(t * 3) * 0.07)
      });
    }
    return a;
  }

  function tPos(t, p) {
    const n = p.length, f = (((t % 1) + 1) % 1) * n, i = Math.floor(f) % n, nx = (i + 1) % n, fr = f - Math.floor(f);
    return {
      x: p[i].x + (p[nx].x - p[i].x) * fr,
      y: p[i].y + (p[nx].y - p[i].y) * fr,
      dx: p[nx].x - p[i].x,
      dy: p[nx].y - p[i].y
    };
  }

  const CARS = [
    { t: 0,    spd: 0.0014, col: '#d4af37', g: 'rgba(212,175,55,',  tr: [], n: '#44' },
    { t: 0.34, spd: 0.001,  col: '#cc2200', g: 'rgba(204,34,0,',    tr: [], n: '#1' },
    { t: 0.67, spd: 0.0015, col: '#7799ff', g: 'rgba(119,153,255,', tr: [], n: '#16' }
  ];
  let boost = false;

  c.addEventListener('click', () => {
    boost = true;
    CARS.forEach(ca => { ca._s = ca.spd; ca.spd *= 1.8; });
    setTimeout(() => { CARS.forEach(ca => ca.spd = ca._s); boost = false; }, 1400);
  });

  function loop() {
    ctx.fillStyle = '#020205';
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(212,175,55,.015)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Track path
    const p = getPts();
    ctx.beginPath();
    ctx.moveTo(p[0].x, p[0].y);
    p.forEach(pt => ctx.lineTo(pt.x, pt.y));
    ctx.closePath();
    ctx.strokeStyle = '#18181f';
    ctx.lineWidth = 28;
    ctx.stroke();

    // Kerbs
    for (let i = 0; i < p.length; i += 3) {
      const pt = p[i], nx2 = p[(i + 1) % p.length], a = Math.atan2(nx2.y - pt.y, nx2.x - pt.x) + Math.PI / 2;
      ctx.strokeStyle = i % 6 === 0 ? 'rgba(200,0,0,.3)' : 'rgba(255,255,255,.1)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(pt.x + Math.cos(a) * 13, pt.y + Math.sin(a) * 13);
      ctx.lineTo(pt.x - Math.cos(a) * 13, pt.y - Math.sin(a) * 13);
      ctx.stroke();
    }

    // Centre dash
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.moveTo(p[0].x, p[0].y);
    p.forEach(pt => ctx.lineTo(pt.x, pt.y));
    ctx.closePath();
    ctx.strokeStyle = 'rgba(212,175,55,.09)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // Cars
    CARS.forEach(car => {
      car.t += car.spd;
      const pos = tPos(car.t, p), ang = Math.atan2(pos.dy, pos.dx);
      car.tr.push({ x: pos.x, y: pos.y });
      if (car.tr.length > 40) car.tr.shift();
      car.tr.forEach((tp, idx) => {
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, 0.9, 0, Math.PI * 2);
        ctx.fillStyle = car.g + (idx / car.tr.length) * 0.3 + ')';
        ctx.fill();
      });

      const grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 14);
      grd.addColorStop(0, car.g + (boost ? 0.4 : 0.2) + ')');
      grd.addColorStop(1, car.g + '0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(ang);
      ctx.shadowColor = car.col;
      ctx.shadowBlur = boost ? 14 : 6;
      ctx.fillStyle = car.col;
      ctx.beginPath();
      ctx.moveTo(9, 0);
      ctx.lineTo(-6, 3.5);
      ctx.lineTo(-8, 0);
      ctx.lineTo(-6, -3.5);
      ctx.closePath();
      ctx.fill();

      if (boost) {
        ctx.strokeStyle = 'rgba(255,180,0,.85)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-8, 0);
        ctx.lineTo(-8 - Math.random() * 10, 0);
        ctx.stroke();
      }
      ctx.restore();
    });

    // Leaderboard HUD
    const sorted = [...CARS].sort((a, b) => b.t - a.t);
    ctx.font = '600 10px Cinzel';
    sorted.forEach((car, i) => {
      ctx.fillStyle = 'rgba(5,5,15,.85)';
      ctx.fillRect(12, 14 + i * 20, 88, 15);
      ctx.fillStyle = car.col;
      ctx.fillText('P' + (i + 1) + ' ' + car.n, 16, 25 + i * 20);
    });

    // Boost status label
    if (boost) {
      ctx.font = '700 12px Cinzel';
      ctx.fillStyle = 'rgba(212,175,55,.95)';
      ctx.textAlign = 'center';
      ctx.fillText('TURBO BOOST!', W / 2, H - 10);
      ctx.textAlign = 'left';
    } else {
      ctx.font = '200 8px Raleway';
      ctx.fillStyle = 'rgba(150,130,80,.35)';
      ctx.textAlign = 'center';
      ctx.fillText('Click track for boost', W / 2, H - 8);
      ctx.textAlign = 'left';
    }
    requestAnimationFrame(loop);
  }
  loop();
})();
