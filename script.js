
/* ── 1. LOADER ─────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    // kick off entrance animations after loader hides
    document.body.style.overflow = '';
    initReveal();
    animateCounters();
    initSkillBars();
  }, 2000);
});

// Prevent scroll during load
document.body.style.overflow = 'hidden';


/* ── 2. NEURAL CANVAS (Hero Background) ───── */
(function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, nodes = [], mouse = { x: -9999, y: -9999 };
  const NODE_COUNT = 80;
  const MAX_DIST    = 140;
  const NODE_RADIUS = 2;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function spawnNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r:  NODE_RADIUS + Math.random() * 1.5
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // move
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // mouse connections
    nodes.forEach(n => {
      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAX_DIST * 1.5) {
        const alpha = (1 - dist / (MAX_DIST * 1.5)) * 0.5;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    });

    // dots
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(108,99,255,0.65)';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  document.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  window.addEventListener('resize', () => { resize(); spawnNodes(); });

  resize();
  spawnNodes();
  draw();
})();


/* ── 3. TYPING ANIMATION ───────────────────── */
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'LLM-powered applications',
    'RAG pipelines',
    'AI chatbots',
    'semantic search systems',
    'prompt engineering solutions',
  ];

  let phraseIndex = 0, charIndex = 0, deleting = false;

  function type() {
    const current = phrases[phraseIndex];
    if (!deleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
      setTimeout(type, 75);
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
      setTimeout(type, 40);
    }
  }

  setTimeout(type, 800);
})();


/* ── 4. NAVBAR SCROLL BEHAVIOUR ────────────── */
(function initNavbar() {
  const nav      = document.getElementById('navbar');
  const links    = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // sticky style
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else                      nav.classList.remove('scrolled');

    // back-to-top
    const btt = document.getElementById('back-to-top');
    if (window.scrollY > 400) btt.classList.add('visible');
    else                       btt.classList.remove('visible');

    // active link highlight
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });
    links.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── 5. MOBILE MENU ─────────────────────────── */
(function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
  });

  document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
    });
  });
})();


/* ── 6. SCROLL REVEAL ───────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io  = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}


/* ── 7. COUNTER ANIMATION ───────────────────── */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    let current  = 0;
    const step   = Math.ceil(target / 40);
    const timer  = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current + (target >= 10 ? '+' : '');
    }, 45);
  });
}


/* ── 8. SKILL BAR ANIMATION ─────────────────── */
function initSkillBars() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill').forEach(fill => {
          fill.style.width = fill.dataset.w + '%';
        });
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.skill-card').forEach(card => io.observe(card));
}


/* ── 9. PROJECT FILTER ───────────────────────── */
(function initFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.opacity   = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            card.style.opacity   = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();


/* ── 10. RESUME VIEWER ───────────────────────── */
(function initResume() {
  const viewBtn  = document.getElementById('view-resume-btn');
  const viewer   = document.getElementById('resume-viewer');
  const fsBtn    = document.getElementById('fullscreen-btn');
  const fsBtnIn  = document.getElementById('fs-btn-inner');
  const iframe   = document.getElementById('resume-iframe');
  const fallback = document.getElementById('pdf-fallback');

  // detect iframe load failure
  if (iframe) {
    iframe.addEventListener('error', () => {
      iframe.style.display = 'none';
      fallback.classList.add('show');
    });
  }

  if (viewBtn && viewer) {
    viewBtn.addEventListener('click', () => {
      const isVisible = viewer.classList.toggle('visible');
      viewBtn.innerHTML = isVisible
        ? '<i class="fas fa-eye-slash"></i> Hide Resume'
        : '<i class="fas fa-eye"></i> View Resume';
      if (isVisible) {
        viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  function toggleFS() {
    viewer.classList.toggle('resume-fullscreen');
    const isFS = viewer.classList.contains('resume-fullscreen');
    const icon = isFS ? 'fa-compress' : 'fa-expand';
    if (fsBtn)   fsBtn.innerHTML   = `<i class="fas ${icon}"></i> ${isFS ? 'Exit' : 'Fullscreen'}`;
    if (fsBtnIn) fsBtnIn.innerHTML = `<i class="fas ${icon}"></i>`;
    if (isFS) document.body.style.overflow = 'hidden';
    else      document.body.style.overflow = '';
  }

  if (fsBtn)   fsBtn.addEventListener('click', toggleFS);
  if (fsBtnIn) fsBtnIn.addEventListener('click', toggleFS);

  // ESC exits fullscreen
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && viewer && viewer.classList.contains('resume-fullscreen')) {
      toggleFS();
    }
  });
})();


/* ─────────────────────────────────────────────── */
(function initContactForm() {
  const FORMSPREE_URL = 'https://formspree.io/f/xwvdvgev'; // ← paste your ID here

  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name:    { el: form.querySelector('#name'),    err: form.querySelector('#name-error'),    rule: v => v.trim().length >= 2,  msg: 'Please enter your full name.' },
    email:   { el: form.querySelector('#email'),   err: form.querySelector('#email-error'),   rule: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Please enter a valid email address.' },
    subject: { el: form.querySelector('#subject'), err: form.querySelector('#subject-error'), rule: v => v.trim().length >= 3,  msg: 'Please enter a subject (min 3 chars).' },
    message: { el: form.querySelector('#message'), err: form.querySelector('#message-error'), rule: v => v.trim().length >= 10, msg: 'Message must be at least 10 characters.' },
  };

  function validate() {
    let valid = true;
    Object.values(fields).forEach(f => {
      if (!f.rule(f.el.value)) {
        f.err.textContent = f.msg;
        f.el.classList.add('error');
        valid = false;
      } else {
        f.err.textContent = '';
        f.el.classList.remove('error');
      }
    });
    return valid;
  }

  // Live validation on blur
  Object.values(fields).forEach(f => {
    f.el.addEventListener('blur', () => {
      if (!f.rule(f.el.value)) {
        f.err.textContent = f.msg;
        f.el.classList.add('error');
      } else {
        f.err.textContent = '';
        f.el.classList.remove('error');
      }
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) return;

    const btn        = form.querySelector('button[type="submit"]');
    const successBox = document.getElementById('form-success');
    const errorBox   = document.getElementById('form-send-error');

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    btn.disabled  = true;
    if (errorBox) errorBox.style.display = 'none';

    try {
      const response = await fetch(FORMSPREE_URL, {
        method:  'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    fields.name.el.value.trim(),
          email:   fields.email.el.value.trim(),
          subject: fields.subject.el.value.trim(),
          message: fields.message.el.value.trim(),
        }),
      });

      if (response.ok) {
        // ✅ Real success — email delivered to sworajsahoo05@gmail.com
        successBox.style.display = 'flex';
        form.reset();
        setTimeout(() => { successBox.style.display = 'none'; }, 6000);
      } else {
        const data = await response.json();
        const msg  = (data.errors || []).map(e => e.message).join(', ') || 'Submission failed. Please try again.';
        if (errorBox) { errorBox.textContent = msg; errorBox.style.display = 'flex'; }
      }
    } catch (err) {
      if (errorBox) {
        errorBox.textContent = 'Network error. Please check your connection and try again.';
        errorBox.style.display = 'flex';
      }
    } finally {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled  = false;
    }
  });
})();


/* ── 12. BACK TO TOP ─────────────────────────── */
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ── 13. THEME TOGGLE ────────────────────────── */
(function initTheme() {
  const btn  = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('theme') || 'dark';
  if (saved === 'light') {
    root.setAttribute('data-theme', 'light');
    btn.innerHTML = '<i class="fas fa-moon"></i>';
  }

  btn.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    root.setAttribute('data-theme', isLight ? 'dark' : 'light');
    btn.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isLight ? 'dark' : 'light');
  });
})();


/* ── 14. SMOOTH NAV LINKS ────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = document.getElementById('navbar').offsetHeight;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});


/* ── 15. FOOTER YEAR ─────────────────────────── */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
