/* ═══════════════════════════════════════════════════════════
   animations.js — Canvas particules + Intersection Observer
═══════════════════════════════════════════════════════════ */

/* ─── 1. CANVAS PARTICULES HERO ──────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: null, y: null };

  function goldColor(alpha) {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return dark ? `rgba(201,168,76,${alpha})` : `rgba(184,148,31,${alpha})`;
  }

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function spawn(n) {
    particles = [];
    for (let i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.4 + .4,
        vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
        a: Math.random() * .45 + .08,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = goldColor(p.a); ctx.fill();
    }

    /* Connexions entre particules proches */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = goldColor((1 - d / 120) * .07);
          ctx.lineWidth = .5; ctx.stroke();
        }
      }
    }

    /* Connexion souris */
    if (mouse.x !== null) {
      for (const p of particles) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (d < 160) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = goldColor((1 - d / 160) * .18);
          ctx.lineWidth = .7; ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); spawn(65); });
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  }, { passive: true });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  resize(); spawn(65); draw();
})();

/* ─── 2. INTERSECTION OBSERVER ───────────────────────────── */
(function initScrollAnim() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view', 'visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-up, .fade-left, .fade-right, .reveal')
    .forEach(el => obs.observe(el));

  /* Hero : déclencher immédiatement */
  document.querySelectorAll('.hero-content .reveal').forEach(el => el.classList.add('visible'));
})();

/* ─── 3. BARRES COMPÉTENCES ──────────────────────────────── */
(function initBars() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.sb-fill').forEach(b => obs.observe(b));
})();

/* ─── 4. COMPTEURS ANIMÉS ────────────────────────────────── */
(function initCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.target;
      const step = 16, inc = target / (1600 / step);
      let cur = 0;
      const t = setInterval(() => {
        cur += inc; if (cur >= target) { cur = target; clearInterval(t); }
        el.textContent = Math.floor(cur);
      }, step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num[data-target]').forEach(c => obs.observe(c));
})();
