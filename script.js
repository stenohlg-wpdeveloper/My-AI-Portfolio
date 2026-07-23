/* =========================================================
   BANDHUDHAN MISRA — PORTFOLIO SCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 500);
  });
  // fallback in case 'load' already fired
  setTimeout(() => loader.classList.add('hidden'), 2500);

  /* ---------- AOS init ---------- */
  if (window.AOS) {
    AOS.init({ duration: 1000, once: true, offset: 60, easing: 'ease-out-cubic' });
  }

  /* ---------- Fallback reveal for [data-reveal] (in case AOS not used on them) ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Sticky header ---------- */
  const header = document.getElementById('site-header');
  const onScrollHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScrollHeader);
  onScrollHeader();

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 600);
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Mobile menu ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    navToggle.innerHTML = mobileMenu.classList.contains('open')
      ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }));

  /* ---------- Active nav link on scroll ---------- */
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });

  /* ---------- Cursor glow ---------- */
  const cursorGlow = document.getElementById('cursor-glow');
  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });

  /* ---------- Card spotlight (services) ---------- */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
  });

  /* ---------- Magnetic buttons ---------- */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });

  /* ---------- Vanilla Tilt on service cards ---------- */
  if (window.VanillaTilt) {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max: 6, speed: 400, glare: true, 'max-glare': 0.12, scale: 1.02
    });
  }

  /* ---------- Typed text (hero) ---------- */
  const typedEl = document.getElementById('typed');
  const typedWords = ['WordPress Developer', 'Elementor Pro Expert', 'WooCommerce Developer', 'Website Designer'];
  let twIndex = 0, twChar = 0, twDeleting = false;
  function typeLoop() {
    const word = typedWords[twIndex];
    if (!twDeleting) {
      twChar++;
      typedEl.textContent = word.slice(0, twChar);
      if (twChar === word.length) { twDeleting = true; setTimeout(typeLoop, 1400); return; }
      setTimeout(typeLoop, 70);
    } else {
      twChar--;
      typedEl.textContent = word.slice(0, twChar);
      if (twChar === 0) { twDeleting = false; twIndex = (twIndex + 1) % typedWords.length; }
      setTimeout(typeLoop, 35);
    }
  }
  typeLoop();

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1600;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  /* ---------- Skill rings ---------- */
  const skillItems = document.querySelectorAll('.skill-item');
  const RADIUS = 50; // matches circle r in generated SVG
  const CIRC = 2 * Math.PI * RADIUS;

  skillItems.forEach(item => {
    const pct = parseInt(item.getAttribute('data-pct'), 10);
    const name = item.getAttribute('data-name');
    item.innerHTML = `
      <div class="skill-ring">
        <svg viewBox="0 0 120 120">
          <circle class="bg" cx="60" cy="60" r="${RADIUS}"></circle>
          <circle class="bar" cx="60" cy="60" r="${RADIUS}" style="stroke-dasharray:${CIRC};stroke-dashoffset:${CIRC}"></circle>
        </svg>
        <div class="pct"><span class="pct-num">0</span>%</div>
      </div>
      <div class="name">${name}</div>
    `;
  });

  const ringObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target;
        const pct = parseInt(item.getAttribute('data-pct'), 10);
        const bar = item.querySelector('.bar');
        const numEl = item.querySelector('.pct-num');
        const offset = CIRC - (pct / 100) * CIRC;
        requestAnimationFrame(() => { bar.style.strokeDashoffset = offset; });
        // number tween (uses pct from data-pct, not the counter helper — numEl has no data-count)
        let cur = 0;
        const step = () => {
          cur += Math.max(1, Math.round(pct / 40));
          if (cur >= pct) { numEl.textContent = pct; return; }
          numEl.textContent = cur;
          requestAnimationFrame(step);
        };
        step();
        ringObserver.unobserve(item);
      }
    });
  }, { threshold: 0.4 });
  skillItems.forEach(i => ringObserver.observe(i));

  /* ---------- Portfolio data + render ---------- */
  const projects = [
    { title: 'Insuren — Trading Education Platform', cat: 'business', catLabel: 'Business Website', desc: 'Homepage for a crypto & forex trading education brand with live market ticker.', img: 'project-insuren-home.jpg' },
    { title: 'Insuren — Strategies Page', cat: 'landing', catLabel: 'Landing Page', desc: 'Dedicated strategies page breaking down trading frameworks for learners.', img: 'project-insuren-strategies.jpg' },
    { title: 'Fresh Grocery Store — Homepage', cat: 'woo', catLabel: 'WooCommerce Store', desc: 'MartFury-style grocery storefront with promotions and featured deals.', img: 'project-grocery-home.jpg' },
    { title: 'Fresh Grocery Store — Shop Categories', cat: 'woo', catLabel: 'WooCommerce Store', desc: 'Category browsing page with product listings and quick navigation.', img: 'project-grocery-categories.jpg' }
  ];

  /* Custom on-brand illustrations (no external images / no hotlinking) — one per project category */
  const CARD_ILLUSTRATIONS = {
    woo: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="gWoo" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#00E676" stop-opacity=".22"/><stop offset="100%" stop-color="#19D3A2" stop-opacity=".05"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#gWoo)"/>
      <circle cx="200" cy="150" r="88" fill="none" stroke="#00E676" stroke-opacity=".18" stroke-width="1.5"/>
      <g transform="translate(120,95)" stroke="#00E676" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 10h22l14 78h96l16-58H50"/>
        <circle cx="108" cy="118" r="9" fill="#00E676" stroke="none"/>
        <circle cx="150" cy="118" r="9" fill="#00E676" stroke="none"/>
      </g>
      <rect x="240" y="60" width="46" height="46" rx="10" fill="#111" stroke="#19D3A2" stroke-width="3"/>
      <path d="M255 83h16M263 75v16" stroke="#19D3A2" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
    business: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="gBiz" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#19D3A2" stop-opacity=".2"/><stop offset="100%" stop-color="#00E676" stop-opacity=".05"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#gBiz)"/>
      <g stroke="#00E676" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <rect x="110" y="130" width="180" height="90" rx="8"/>
        <path d="M150 130v-18a20 20 0 0 1 20-20h60a20 20 0 0 1 20 20v18"/>
        <path d="M110 168h180"/>
      </g>
      <g stroke="#19D3A2" stroke-width="5" fill="none" stroke-linecap="round">
        <path d="M140 100l24-26 20 16 40-44" opacity=".55"/>
        <path d="M204 46h20v20" opacity=".55"/>
      </g>
    </svg>`,
    portfolio: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="gPort" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#00E676" stop-opacity=".2"/><stop offset="100%" stop-color="#19D3A2" stop-opacity=".05"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#gPort)"/>
      <rect x="130" y="70" width="90" height="110" rx="6" fill="#111" stroke="#19D3A2" stroke-width="3" transform="rotate(-8 175 125)"/>
      <rect x="185" y="90" width="90" height="110" rx="6" fill="#0c0c0c" stroke="#00E676" stroke-width="3.5" transform="rotate(6 230 145)"/>
      <g transform="rotate(6 230 145)" stroke="#00E676" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <rect x="200" y="112" width="60" height="42" rx="4"/>
        <circle cx="215" cy="128" r="6"/>
        <path d="M200 148l16-16 12 10 14-16 18 18"/>
      </g>
    </svg>`,
    landing: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="gLand" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#19D3A2" stop-opacity=".22"/><stop offset="100%" stop-color="#00E676" stop-opacity=".05"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#gLand)"/>
      <circle cx="200" cy="150" r="60" fill="none" stroke="#00E676" stroke-opacity=".3" stroke-width="2"/>
      <circle cx="200" cy="150" r="34" fill="none" stroke="#00E676" stroke-opacity=".5" stroke-width="2"/>
      <circle cx="200" cy="150" r="10" fill="#00E676"/>
      <g stroke="#19D3A2" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M200 150l64-64"/>
        <path d="M244 78h28v28" />
      </g>
    </svg>`,
    education: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="gEdu" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#00E676" stop-opacity=".2"/><stop offset="100%" stop-color="#19D3A2" stop-opacity=".05"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#gEdu)"/>
      <g stroke="#00E676" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round">
        <path d="M120 120l80-34 80 34-80 34-80-34z"/>
        <path d="M160 138v40c0 10 18 20 40 20s40-10 40-20v-40" opacity=".7"/>
        <path d="M200 154v46" stroke="#19D3A2"/>
      </g>
      <circle cx="280" cy="122" r="4" fill="#19D3A2"/>
    </svg>`,
    corporate: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="gCorp" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#19D3A2" stop-opacity=".2"/><stop offset="100%" stop-color="#00E676" stop-opacity=".05"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#gCorp)"/>
      <g stroke="#00E676" stroke-width="4" fill="none" stroke-linejoin="round">
        <rect x="130" y="90" width="60" height="120"/>
        <rect x="200" y="60" width="70" height="150"/>
        <path d="M144 106h10M144 126h10M144 146h10M144 166h10M144 186h10" stroke-width="3" opacity=".6"/>
        <path d="M216 78h12M240 78h12M216 98h12M240 98h12M216 118h12M240 118h12M216 138h12M240 138h12M216 158h12M240 158h12M216 178h12M240 178h12" stroke-width="3" stroke="#19D3A2" opacity=".6"/>
      </g>
    </svg>`
  };

  const grid = document.getElementById('portfolioGrid');
  const PROJECTS_PER_PAGE = 4;
  let projPage = 0;

  function renderProjects() {
    grid.innerHTML = '';
    const start = projPage * PROJECTS_PER_PAGE;
    const slice = projects.slice(start, start + PROJECTS_PER_PAGE);
    slice.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'p-card';
      card.setAttribute('data-aos', 'fade-up');
      card.setAttribute('data-aos-delay', String(i * 100));
      const media = p.img
        ? `<img src="${p.img}" alt="${p.title} screenshot" loading="lazy">`
        : `<div class="ph-illustration">${CARD_ILLUSTRATIONS[p.cat] || ''}</div>`;
      card.innerHTML = `
        <div class="p-media">
          ${media}
          <div class="overlay">
            <div class="p-actions">
              <a href="#" class="btn btn-primary btn-sm">Live Preview</a>
              <a href="#" class="btn btn-outline btn-sm">View Details</a>
            </div>
          </div>
        </div>
        <div class="p-body">
          <span class="p-cat">${p.catLabel}</span>
          <h4>${p.title}</h4>
          <p>${p.desc}</p>
        </div>
      `;
      grid.appendChild(card);
    });
    if (window.AOS) AOS.refreshHard();
  }
  renderProjects();

  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
  const projNextBtn = document.getElementById('projNext');
  const projPrevBtn = document.getElementById('projPrev');
  if (totalPages <= 1) {
    if (projNextBtn) projNextBtn.style.display = 'none';
    if (projPrevBtn) projPrevBtn.style.display = 'none';
  }
  projNextBtn.addEventListener('click', () => {
    projPage = (projPage + 1) % totalPages;
    renderProjects();
  });
  projPrevBtn.addEventListener('click', () => {
    projPage = (projPage - 1 + totalPages) % totalPages;
    renderProjects();
  });

  /* ---------- Testimonials slider ---------- */
  const testimonials = [
    { name: 'Rohit Sharma', role: 'Founder, GreenLeaf Organics', quote: 'Bandhudhan rebuilt our store from scratch and checkout completion went up noticeably within the first month.', initials: 'RS' },
    { name: 'Ananya Verma', role: 'Marketing Lead, Horizon Consulting', quote: 'Clear communication, fast delivery, and a site that actually loads fast on mobile. Exactly what we needed.', initials: 'AV' },
    { name: 'James Cole', role: 'Owner, Pulse Fitness', quote: 'Our landing page conversion rate improved right after launch. Bandhudhan understood the brief perfectly.', initials: 'JC' }
  ];
  const testiContainer = document.getElementById('testiContainer');
  let testiIndex = 0;

  function renderTestimonial(i) {
    const t = testimonials[i];
    testiContainer.innerHTML = `
      <div class="testi-card">
        <div class="testi-stars">★★★★★</div>
        <p class="testi-quote">"${t.quote}"</p>
        <div class="testi-person">
          <div class="testi-avatar">${t.initials}</div>
          <div><b>${t.name}</b><span>${t.role}</span></div>
        </div>
      </div>
    `;
  }
  renderTestimonial(testiIndex);

  document.getElementById('testiNext').addEventListener('click', () => {
    testiIndex = (testiIndex + 1) % testimonials.length;
    renderTestimonial(testiIndex);
  });
  document.getElementById('testiPrev').addEventListener('click', () => {
    testiIndex = (testiIndex - 1 + testimonials.length) % testimonials.length;
    renderTestimonial(testiIndex);
  });

  let testiAuto = setInterval(() => {
    testiIndex = (testiIndex + 1) % testimonials.length;
    renderTestimonial(testiIndex);
  }, 6000);
  [document.getElementById('testiNext'), document.getElementById('testiPrev')].forEach(btn => {
    btn.addEventListener('click', () => { clearInterval(testiAuto); });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---------- Video modal ---------- */
  const videoModal = document.getElementById('videoModal');
  const introVideo = document.getElementById('introVideo');
  const playBtn = document.getElementById('playIntroVideo');
  const closeBtn = document.getElementById('videoModalClose');
  const backdrop = document.getElementById('videoModalBackdrop');

  function openVideoModal() {
    videoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    introVideo.play().catch(() => {});
  }
  function closeVideoModal() {
    videoModal.classList.remove('open');
    document.body.style.overflow = '';
    introVideo.pause();
    introVideo.currentTime = 0;
  }
  if (playBtn) playBtn.addEventListener('click', openVideoModal);
  if (closeBtn) closeBtn.addEventListener('click', closeVideoModal);
  if (backdrop) backdrop.addEventListener('click', closeVideoModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('open')) closeVideoModal();
  });

  /* ---------- Newsletter form (client-side only) ---------- */
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = newsletterForm.querySelector('button');
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i>';
      newsletterForm.reset();
      setTimeout(() => { btn.innerHTML = original; }, 2200);
    });
  }

  /* ---------- Search toggle (decorative) ---------- */
  const searchToggle = document.getElementById('searchToggle');
  if (searchToggle) {
    searchToggle.addEventListener('click', () => {
      searchToggle.querySelector('i').classList.toggle('fa-magnifying-glass');
      searchToggle.querySelector('i').classList.toggle('fa-xmark');
    });
  }

  /* ---------- Contact form (client-side only) ---------- */
  const contactForm = document.querySelector('.contact-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = 'Message Sent <i class="fa-solid fa-check"></i>';
    contactForm.reset();
    setTimeout(() => { btn.innerHTML = original; }, 2600);
  });

});
