/* ═══════════════════════════════════════════════════════════
   main.js — Navbar · Thème · Burger · Scroll · Formulaire
═══════════════════════════════════════════════════════════ */

/* ─── 1. NAVBAR & BACK-TO-TOP ────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('backTop');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    backTop.classList.toggle('visible', y > 300);

    /* Active link */
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-links a');
    sections.forEach(sec => {
      const top  = sec.offsetTop - 130;
      const bot  = top + sec.offsetHeight;
      const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
      if (link) link.classList.toggle('active', y >= top && y < bot);
    });
  }, { passive: true });

  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ─── 2. BURGER MOBILE ───────────────────────────────────── */
(function initBurger() {
  const burger   = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  function close() {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('click', e => {
    if (!burger.contains(e.target) && !navLinks.contains(e.target)) close();
  });
})();

/* ─── 3. DARK / LIGHT TOGGLE ─────────────────────────────── */
(function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const html   = document.documentElement;
  const saved  = localStorage.getItem('theme');
  const sys    = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  html.setAttribute('data-theme', saved || sys);

  toggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

/* ─── 4. SCROLL FLUIDE ───────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ─── 5. FORMULAIRE DE CONTACT ───────────────────────────── */
(function initForm() {
  const form = document.getElementById('contactForm');
  const ok   = document.getElementById('formOk');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name  = form.name.value.trim();
    const email = form.email.value.trim();
    const msg   = form.message.value.trim();

    if (!name || !email || !msg) { shake(form); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { shake(form.email); return; }

    const btn    = form.querySelector('.btn');
    const btnTxt = btn.querySelector('.btn-txt');
    btn.disabled = true;
    btnTxt.textContent = 'Envoi en cours…';

    try {
      /* FormSubmit.co — aucun compte requis.
         Premier envoi : un email de validation arrive sur aitbenhachem.youness@gmail.com
         (cliquer "Activate Form"), ensuite tous les messages arrivent directement. */
      const res = await fetch('https://formsubmit.co/ajax/aitbenhachem.youness@gmail.com', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name:    name,
          email:   email,
          org:     form.org    ? form.org.value.trim()     : '',
          subject: form.subject ? form.subject.value.trim() : 'Contact depuis portfolio',
          message: msg,
        }),
      });

      if (res.ok) {
        form.reset();
        ok.classList.add('visible');
        setTimeout(() => ok.classList.remove('visible'), 6000);
      } else {
        alert('Erreur lors de l\'envoi. Réessayez ou écrivez directement à aitbenhachem.youness@gmail.com');
      }
    } catch (_) {
      alert('Connexion impossible. Écrivez directement à aitbenhachem.youness@gmail.com');
    } finally {
      btn.disabled = false;
      btnTxt.textContent = 'Envoyer le message';
    }
  });

  function shake(el) {
    el.style.animation = 'none'; el.offsetHeight;
    el.style.animation = 'shake .4s ease';
    setTimeout(() => el.style.animation = '', 400);
  }
})();

/* ─── 6. CURSOR GLOW (desktop) ──────────────────────────── */
(function initGlow() {
  if (window.matchMedia('(hover: none)').matches) return;
  const g = document.createElement('div');
  g.style.cssText = `
    position:fixed;width:280px;height:280px;border-radius:50%;
    background:radial-gradient(circle,rgba(201,168,76,.05) 0%,transparent 70%);
    pointer-events:none;transform:translate(-50%,-50%);
    transition:left .1s,top .1s;z-index:0;
  `;
  document.body.appendChild(g);
  document.addEventListener('mousemove', e => { g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; }, { passive: true });
})();

/* ─── 7. KEYFRAME SHAKE (injecté en JS) ──────────────────── */
(function() {
  const s = document.createElement('style');
  s.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`;
  document.head.appendChild(s);
})();
