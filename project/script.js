/**
 * NEXBECK — AUSTRALIAN TRADE & ELECTRICAL WEB DESIGN AGENCY
 * Shared JavaScript for: Home, Services, About, Contact
 * Pure Vanilla JavaScript — Zero Framework Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Subtle electrical ambient background with mouse interaction & click sparks
  initAmbientCanvas();

  // 2. Scroll-triggered reveal animations with auto-observing engine
  initScrollAnimations();

  // 3. Header scroll styling & multi-page active nav
  initHeaderAndNav();

  // 4. Mobile navigation drawer
  initMobileDrawer();

  // 5. Hero website showcase preview (Device Switcher, Live Mode Toggle, Interactive Services, Hotspots)
  initHeroShowcase();

  // 6. Interactive Job Payback / ROI Calculator with Live Volume Slider & Count-Up
  initPaybackCalculator();

  // 7. Interactive Suburb Turf Coverage & Demand Simulator
  initSuburbTurfSimulator();

  // 8. Interactive Package Scope & Inclusions Estimator (Services page)
  initScopeEstimator();

  // 9. FAQ Accordions (Homepage, Services, About, Contact)
  initFaqAccordions();

  // 10. Contact form handling with Live Progress & Trade Presets
  initContactFormHandler();

  // 11. Sticky mobile bar and back-to-top button
  initBackToTopAndMobileBar();

  // 12. Micro-interactions: 3D perspective tilt & tactile hover
  initTiltEffect();
});

/* ==========================================================================
   1. ELECTRICAL AMBIENT CANVAS (With Subtle Cursor Reaction & Click Sparks)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Respect user preference for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  let mouse = { x: -1000, y: -1000, active: false };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Click spark particle engine
  const clickSparks = [];
  window.addEventListener('click', (e) => {
    const numSparks = 10;
    for (let i = 0; i < numSparks; i++) {
      const angle = (Math.PI * 2 * i) / numSparks + (Math.random() - 0.5) * 0.6;
      const speed = Math.random() * 3.2 + 1.2;
      clickSparks.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: Math.random() * 0.035 + 0.025,
        color: Math.random() > 0.3 ? '201, 138, 44' : '28, 26, 23',
        size: Math.random() * 2 + 1
      });
    }
  });

  // Subtle electrical nodes with hairline connections
  const numNodes = 16;
  const nodes = [];

  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      radius: Math.random() * 1.5 + 1.0,
      alpha: Math.random() * 0.2 + 0.08
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw and update ambient floating electrical nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0) n.x = width;
      if (n.x > width) n.x = 0;
      if (n.y < 0) n.y = height;
      if (n.y > height) n.y = 0;

      // Mouse interactive attraction & glow
      let currentAlpha = n.alpha;
      if (mouse.active) {
        const mdx = mouse.x - n.x;
        const mdy = mouse.y - n.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 180) {
          currentAlpha = Math.min(0.45, n.alpha + (1 - mdist / 180) * 0.25);
          // Very gentle attraction drift
          n.x += (mdx / mdist) * 0.15;
          n.y += (mdy / mdist) * 0.15;

          // Draw faint spark hairline to cursor
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(201, 138, 44, ${(1 - mdist / 180) * 0.12})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw amber node particle
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 138, 44, ${currentAlpha})`;
      ctx.fill();

      // Draw subtle connecting hairlines between nearby nodes
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n.x - n2.x;
        const dy = n.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 155) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(201, 138, 44, ${0.05 * (1 - dist / 155)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // 2. Draw and update click sparks
    for (let i = clickSparks.length - 1; i >= 0; i--) {
      const s = clickSparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.06; // subtle gravity
      s.vx *= 0.97; // drag
      s.life -= s.decay;

      if (s.life <= 0) {
        clickSparks.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color}, ${s.life * 0.85})`;
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. SCROLL REVEAL ANIMATIONS (IntersectionObserver Auto Engine)
   ========================================================================== */
function initScrollAnimations() {
  const autoSelectors = [
    '.section-header',
    '.comp-asymmetric-split',
    '.calc-open-container',
    '.editorial-pillars-grid > *',
    '.editorial-value-split',
    '.process-timeline-flow > *',
    '.faq-editorial-item',
    '.final-cta-open',
    '.pricing-card',
    '.feature-matrix-table',
    '.about-mission-open',
    '.about-diff-row',
    '.turf-simulator-container'
  ];

  autoSelectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      if (!el.classList.contains('reveal-on-scroll') && !el.classList.contains('reveal-stagger')) {
        el.classList.add('reveal-on-scroll');
      }
    });
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-on-scroll, .reveal-stagger').forEach((el) => {
      el.classList.add('is-visible');
    });
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.06
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const targets = document.querySelectorAll('.reveal-on-scroll, .reveal-stagger');
  targets.forEach((target) => observer.observe(target));
}

/* ==========================================================================
   2. HEADER SCROLL & MULTI-PAGE NAVIGATION
   ========================================================================== */
function initHeaderAndNav() {
  const header = document.getElementById('main-header');

  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  const path = window.location.pathname;
  let pageName = path.substring(path.lastIndexOf('/') + 1);
  if (!pageName || pageName === '/' || pageName === 'index.html') {
    pageName = 'index.html';
  }

  // Desktop links
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');
  desktopLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === 'index.html' && (href === 'index.html' || href === './' || href === ''))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Mobile links
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === 'index.html' && (href === 'index.html' || href === './' || href === ''))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   3. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const menuIcon = document.getElementById('mobile-menu-icon');

  if (!menuBtn || !drawer) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = drawer.classList.toggle('open');
    if (menuIcon) {
      menuIcon.textContent = isOpen ? 'close' : 'menu';
    }
  });

  const links = drawer.querySelectorAll('a');
  links.forEach((a) => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      if (menuIcon) menuIcon.textContent = 'menu';
    });
  });

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !menuBtn.contains(e.target)) {
      drawer.classList.remove('open');
      if (menuIcon) menuIcon.textContent = 'menu';
    }
  });
}

/* ==========================================================================
   4. HERO WEBSITE SHOWCASE INTERACTION (LIVE PREVIEW CONTROLS)
   ========================================================================== */
function initHeroShowcase() {
  const showcaseContainer = document.getElementById('hero-showcase-container');
  if (!showcaseContainer) return;

  // Device toggle buttons (Desktop vs Mobile Preview)
  const deviceTabs = document.querySelectorAll('.showcase-device-btn');
  deviceTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      deviceTabs.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.getAttribute('data-view');
      if (view === 'mobile') {
        showcaseContainer.classList.add('mobile-mode');
      } else {
        showcaseContainer.classList.remove('mobile-mode');
      }
    });
  });

  // Emergency Mode vs Daytime Mode Switcher
  const modeBtns = document.querySelectorAll('.mockup-mode-btn');
  const previewStatusBadge = showcaseContainer.querySelector('.preview-badge-status');
  const previewHeroTitle = showcaseContainer.querySelector('.preview-hero-mock h4');
  const previewHeroDesc = showcaseContainer.querySelector('.preview-hero-mock p');
  const demoCallBtn = document.getElementById('preview-call-btn');
  const demoCallStatus = document.getElementById('preview-call-status');

  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      modeBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-mode');

      if (mode === 'emergency') {
        showcaseContainer.classList.add('emergency-mode-active');
        if (previewStatusBadge) {
          previewStatusBadge.innerHTML = `
            <span style="width: 6px; height: 6px; border-radius: 50%; background: #ef4444; animation: pulse-red 1s infinite;"></span>
            <span>⚡ 24/7 EMERGENCY DISPATCH</span>
          `;
        }
        if (previewHeroTitle) {
          previewHeroTitle.textContent = '🚨 Emergency Electrical Faults & Rapid Power Restorations';
        }
        if (previewHeroDesc) {
          previewHeroDesc.textContent = '25-minute emergency response across Sydney Metro for blown fuses, smoking switchboards, and storm blackouts.';
        }
        if (demoCallBtn) {
          demoCallBtn.innerHTML = `
            <span class="material-symbols-outlined" style="font-size: 15px;">crisis_alert</span>
            <span>Emergency: 0400 123 456</span>
          `;
        }
      } else {
        showcaseContainer.classList.remove('emergency-mode-active');
        if (previewStatusBadge) {
          previewStatusBadge.innerHTML = `
            <span style="width: 5px; height: 5px; border-radius: 50%; background: #10b981;"></span>
            <span>Sydney Metro</span>
          `;
        }
        if (previewHeroTitle) {
          previewHeroTitle.textContent = 'Domestic & Commercial Electrical Contractors';
        }
        if (previewHeroDesc) {
          previewHeroDesc.textContent = "Switchboard upgrades, EV wallbox chargers, LED rewiring, and 24/7 emergency dispatch across Sydney's Inner West & Eastern Suburbs.";
        }
        if (demoCallBtn) {
          demoCallBtn.innerHTML = `
            <span class="material-symbols-outlined" style="font-size: 15px;">call</span>
            <span>Call 0400 123 456</span>
          `;
        }
      }
    });
  });

  // Interactive Live Service Tags inside Preview
  const serviceTags = showcaseContainer.querySelectorAll('.preview-service-tag');
  const serviceDetails = {
    switchboard: {
      title: 'Main Switchboard Upgrades & RCD Safety Switches ($1,400 avg)',
      desc: 'Replace outdated ceramic fuses with AS/NZS 3000 compliant RCBO circuit breakers. Same-day completion across Sydney.'
    },
    evcharger: {
      title: 'Certified Tesla & Universal Home EV Charger Installations ($1,200 avg)',
      desc: 'Level 2 7kW to 22kW wallbox charging stations installed with dedicated circuit protection and safety certificate.'
    },
    solar: {
      title: 'Solar Inverter Upgrades & Home Battery Backup Systems ($2,800 avg)',
      desc: 'Hybrid inverter replacements, Tesla Powerwall integration, and emergency battery backup setups.'
    },
    compliance: {
      title: 'Safety Inspections & Certificates of Electrical Safety (COES)',
      desc: 'Mandatory rental compliance testing, smoke alarm certification, and thermal imaging switchboard audits.'
    }
  };

  serviceTags.forEach((tag) => {
    tag.addEventListener('click', () => {
      serviceTags.forEach((t) => t.classList.remove('active'));
      tag.classList.add('active');

      const tagText = tag.textContent.toLowerCase();
      let key = 'switchboard';
      if (tagText.includes('ev charger')) key = 'evcharger';
      else if (tagText.includes('solar')) key = 'solar';
      else if (tagText.includes('compliant') || tagText.includes('as/nzs')) key = 'compliance';

      const data = serviceDetails[key];
      if (previewHeroTitle && data) previewHeroTitle.textContent = data.title;
      if (previewHeroDesc && data) previewHeroDesc.textContent = data.desc;
    });
  });

  // Interactive dialer test button inside preview
  if (demoCallBtn && demoCallStatus) {
    demoCallBtn.addEventListener('click', (e) => {
      e.preventDefault();
      demoCallStatus.style.display = 'block';
      demoCallStatus.innerHTML = `
        <span style="display: inline-flex; align-items: center; gap: 6px; color: var(--color-success); font-weight: 700;">
          <span class="material-symbols-outlined" style="font-size: 14px; animation: spin 1s infinite;">call_in_progress</span>
          <span>Connecting to Mobile: 0400 123 456 (Jack Harrison • REC #38291)</span>
        </span>
      `;
      setTimeout(() => {
        demoCallStatus.innerHTML = `
          <span>✓ Direct line dialed. When homeowners search on mobile, 1-tap connects directly to your phone.</span>
        `;
      }, 2500);
    });
  }

  // Feature Hotspot Inspection Buttons
  const hotspotBtns = document.querySelectorAll('.hotspot-pill');
  const hotspotText = document.getElementById('hotspot-explanation-text');
  const hotspotExplanations = {
    call: '⚡ Instant Tap-to-Call: When someone has blown power or tripped fuses, they want to speak to a sparky in 5 seconds. One tap dials your mobile immediately.',
    rec: '🔒 REC & Master Electrician Licence: Prominently displaying your Registered Electrical Contractor licence builds instant credibility with discerning homeowners.',
    suburbs: '📍 Suburb Turf Targeting: We structure your page with local suburb schema and keywords so Google ranks you in your exact service radius.',
    highmargin: '💰 Switchboard & EV Charger Focus: Rather than just $80 smoke alarm swaps, your site spotlights high-value $1,400+ upgrades that drive serious profit.'
  };

  if (hotspotBtns.length && hotspotText) {
    hotspotBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        hotspotBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.getAttribute('data-feature');
        if (key && hotspotExplanations[key]) {
          hotspotText.textContent = hotspotExplanations[key];
          hotspotText.classList.add('visible');
        }
      });
    });
  }
}

/* ==========================================================================
   ANIMATED NUMBER COUNTER ENGINE
   Smooth numerical count-up easing
   ========================================================================== */
function animateNumber(element, startVal, endVal, prefix = '', suffix = '', duration = 400) {
  if (!element) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.textContent = `${prefix}${endVal.toLocaleString('en-AU')}${suffix}`;
    return;
  }

  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.round(startVal + (endVal - startVal) * easeProgress);

    element.textContent = `${prefix}${currentVal.toLocaleString('en-AU')}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = `${prefix}${endVal.toLocaleString('en-AU')}${suffix}`;
    }
  }

  requestAnimationFrame(step);
}

/* ==========================================================================
   5. INTERACTIVE JOB PAYBACK / ROI CALCULATOR & VOLUME SLIDER
   Demonstrates how 1 booked electrical job pays for the entire website
   ========================================================================== */
function initPaybackCalculator() {
  const calcButtons = document.querySelectorAll('.calc-job-btn');
  const jobTitleEl = document.getElementById('calc-selected-job-title');
  const jobValueEl = document.getElementById('calc-selected-job-value');
  const packageComparisonEl = document.getElementById('calc-selected-comparison');
  const profitMarginEl = document.getElementById('calc-profit-margin-value');
  const paybackJobsEl = document.getElementById('calc-payback-jobs-count');

  // Interactive Volume Slider elements
  const volumeSlider = document.getElementById('calc-volume-slider');
  const volumeCountBadge = document.getElementById('calc-volume-count');
  const annualRevenueEl = document.getElementById('calc-annual-revenue');
  const hipagesWasteEl = document.getElementById('calc-hipages-waste');
  const netSavingsEl = document.getElementById('calc-net-savings');

  if (!calcButtons.length || !jobTitleEl) return;

  const jobData = {
    switchboard: {
      name: 'Main Switchboard Upgrade & RCD Safety Switches',
      avgTicket: 1400,
      netProfit: 950,
      note: 'One single switchboard replacement completely pays off your $890 Full Site Package with $60 instant net profit on day one.'
    },
    evcharger: {
      name: 'Home EV Wallbox Charger Installation',
      avgTicket: 1200,
      netProfit: 800,
      note: 'Installing just 1 Tesla / universal EV home charger pays for your website. Every customer booking after that is pure profit.'
    },
    battery: {
      name: 'Solar Inverter or Home Battery Storage System',
      avgTicket: 2800,
      netProfit: 1600,
      note: 'A single home battery or solar retrofit enquiry generates over $1,600 net margin — more than double the cost of the entire site.'
    },
    rewire: {
      name: 'Full Home LED Downlight Upgrade or Safety Rewire',
      avgTicket: 3600,
      netProfit: 2200,
      note: 'Just 1 renovation rewire covers the site nearly 3 times over. No more bidding against 5 sparkies on HiPages.'
    },
    aircon: {
      name: 'Split System Air Conditioning Installation',
      avgTicket: 1600,
      netProfit: 1050,
      note: 'One split system supply-and-install job covers your entire 5-page custom website with cash left in your pocket.'
    },
    emergency: {
      name: 'After-Hours Emergency Power Outage Callout',
      avgTicket: 450,
      netProfit: 350,
      note: 'Just 2 emergency night/weekend callouts pay off your Starter Package ($490 AUD) entirely.'
    }
  };

  let currentJobKey = 'switchboard';
  let previousProfit = 0;
  let previousRevenue = 0;
  let previousWaste = 0;

  function updateCalculatorView() {
    const data = jobData[currentJobKey] || jobData.switchboard;
    const monthlyJobs = volumeSlider ? parseInt(volumeSlider.value, 10) : 3;

    if (jobTitleEl) jobTitleEl.textContent = data.name;
    if (packageComparisonEl) packageComparisonEl.textContent = data.note;
    if (paybackJobsEl) paybackJobsEl.textContent = (data.netProfit >= 890 || data.avgTicket >= 890) ? '1 Job' : '1–2 Jobs';

    // Animated count-up for single ticket profit
    if (profitMarginEl) {
      animateNumber(profitMarginEl, previousProfit, data.netProfit, '+$', '', 350);
      previousProfit = data.netProfit;
    }

    if (jobValueEl) {
      animateNumber(jobValueEl, 0, data.avgTicket, '$', ' AUD', 350);
    }

    // Volume Slider Calculations
    if (volumeCountBadge) {
      volumeCountBadge.textContent = `${monthlyJobs} ${monthlyJobs === 1 ? 'Job' : 'Jobs'} / Month`;
    }

    const calculatedAnnualRevenue = monthlyJobs * data.avgTicket * 12;
    const calculatedHiPagesWaste = Math.round(monthlyJobs * 2.2 * 65 * 12);
    const calculatedNetSavings = calculatedAnnualRevenue - 890;

    if (annualRevenueEl) {
      animateNumber(annualRevenueEl, previousRevenue, calculatedAnnualRevenue, '$', ' AUD/yr', 450);
      previousRevenue = calculatedAnnualRevenue;
    }

    if (hipagesWasteEl) {
      animateNumber(hipagesWasteEl, previousWaste, calculatedHiPagesWaste, '$', ' AUD/yr Wasted', 450);
      previousWaste = calculatedHiPagesWaste;
    }

    if (netSavingsEl) {
      animateNumber(netSavingsEl, 0, calculatedNetSavings, '+$', ' Net Gain', 450);
    }
  }

  // Job selection button handlers
  calcButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      calcButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentJobKey = btn.getAttribute('data-job') || 'switchboard';
      updateCalculatorView();
    });
  });

  // Slider change handler
  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      updateCalculatorView();
    });
  }

  // Initialize initial state
  updateCalculatorView();
}

/* ==========================================================================
   6. INTERACTIVE PACKAGE SCOPE ESTIMATOR (Services Page)
   ========================================================================== */
function initScopeEstimator() {
  const estimatorContainer = document.getElementById('scope-estimator');
  if (!estimatorContainer) return;

  const pkgRadios = estimatorContainer.querySelectorAll('input[name="estimator-pkg"]');
  const addonCheckboxes = estimatorContainer.querySelectorAll('.estimator-addon-check');
  const totalCostEl = document.getElementById('estimator-total-cost');
  const deliveryTimeEl = document.getElementById('estimator-delivery-time');
  const breakevenJobsEl = document.getElementById('estimator-breakeven-jobs');
  const selectBtn = document.getElementById('estimator-select-btn');

  function calculateScope() {
    let basePrice = 890;
    let selectedPkgKey = 'full';
    let deliveryDays = '7 to 14 Days';

    pkgRadios.forEach((radio) => {
      if (radio.checked) {
        selectedPkgKey = radio.value;
        if (selectedPkgKey === 'starter') {
          basePrice = 490;
          deliveryDays = 'Within 7 Days';
        }
      }
    });

    // Check add-on state visually
    addonCheckboxes.forEach((checkbox) => {
      const parentLabel = checkbox.closest('.estimator-toggle-item');
      if (parentLabel) {
        if (checkbox.checked) {
          parentLabel.classList.add('checked');
        } else {
          parentLabel.classList.remove('checked');
        }
      }
    });

    if (totalCostEl) {
      animateNumber(totalCostEl, 0, basePrice, '$', ' AUD', 300);
    }
    if (deliveryTimeEl) {
      deliveryTimeEl.textContent = deliveryDays;
    }
    if (breakevenJobsEl) {
      breakevenJobsEl.textContent = '1 Booked Job (100% Breakeven)';
    }
    if (selectBtn) {
      selectBtn.setAttribute('href', `contact.html?package=${selectedPkgKey}`);
    }
  }

  pkgRadios.forEach((r) => r.addEventListener('change', calculateScope));
  addonCheckboxes.forEach((c) => c.addEventListener('change', calculateScope));

  calculateScope();
}

/* ==========================================================================
   5. FAQ ACCORDION SYSTEM (Works across all pages)
   ========================================================================== */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item, .faq-editorial-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger, .faq-editorial-trigger');
    const panel = item.querySelector('.faq-panel, .faq-editorial-panel');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close sibling FAQs in the same container for clean accordion flow
      const container = item.closest('.faq-accordion-container, .faq-editorial-container');
      if (container) {
        const siblings = container.querySelectorAll('.faq-item.active, .faq-editorial-item.active');
        siblings.forEach((sibling) => {
          if (sibling !== item) {
            sibling.classList.remove('active');
            const sibTrigger = sibling.querySelector('.faq-trigger, .faq-editorial-trigger');
            if (sibTrigger) sibTrigger.setAttribute('aria-expanded', 'false');
            const sibPanel = sibling.querySelector('.faq-panel, .faq-editorial-panel');
            if (sibPanel) sibPanel.style.maxHeight = '0px';
          }
        });
      }

      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 32 + 'px';
      }
    });
  });

  // Category filter tabs if present (e.g. Services page)
  const filterBtns = document.querySelectorAll('.faq-filter-btn');
  const faqGroups = document.querySelectorAll('.faq-group-wrapper');

  if (filterBtns.length && faqGroups.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.getAttribute('data-category');
        faqGroups.forEach((group) => {
          if (cat === 'all' || group.getAttribute('data-group') === cat) {
            group.style.display = 'block';
          } else {
            group.style.display = 'none';
          }
        });
      });
    });
  }
}

/* ==========================================================================
   9. CONTACT FORM HANDLER (WITH LIVE PROGRESS & TRADE PRESETS)
   ========================================================================== */
function initContactFormHandler() {
  const form = document.getElementById('trade-quote-form');
  const packageSelect = document.getElementById('package-select');

  // Pre-select package from URL parameter (?package=starter or ?package=full)
  if (packageSelect) {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedPkg = urlParams.get('package');
    if (selectedPkg === 'starter') {
      packageSelect.value = 'starter';
    } else if (selectedPkg === 'full') {
      packageSelect.value = 'full';
    }
  }

  // Trade Preset Profile Chips
  const presetChips = document.querySelectorAll('.trade-preset-chip');
  const projectNotesField = document.getElementById('project-notes');
  const presetNotes = {
    domestic: 'Specializing in residential switchboard upgrades, LED downlight rewires, and domestic safety inspections. Want more high-margin local suburb enquiries.',
    commercial: 'Commercial fitouts, 3-phase power upgrades, test and tag, and scheduled facility maintenance contracts.',
    solar: 'Tesla wallbox and universal EV charger installations, solar inverter upgrades, and home battery backup storage systems.',
    emergency: '24/7 emergency dispatch, rapid fault finding, tripped RCDs, and storm damage power restorations.'
  };

  presetChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      presetChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const presetType = chip.getAttribute('data-preset');
      if (projectNotesField && presetNotes[presetType]) {
        projectNotesField.value = presetNotes[presetType];
      }
      if (packageSelect) {
        if (presetType === 'commercial' || presetType === 'solar') {
          packageSelect.value = 'full';
        }
      }
      updateFormProgress();
    });
  });

  // Live Form Progress Bar Calculation
  const progressFill = document.getElementById('form-progress-fill');
  const progressPercentText = document.getElementById('form-progress-percent');

  function updateFormProgress() {
    if (!form || !progressFill) return;
    const requiredInputs = form.querySelectorAll('input[required], select[required]');
    let filledCount = 0;

    requiredInputs.forEach((input) => {
      if (input.value && input.value.trim().length > 0) {
        filledCount++;
      }
    });

    // Optional field bonus
    if (projectNotesField && projectNotesField.value.trim().length > 0) {
      filledCount += 0.5;
    }

    const totalFields = requiredInputs.length + 0.5;
    const percentage = Math.min(100, Math.round((filledCount / totalFields) * 100));

    progressFill.style.width = `${Math.max(15, percentage)}%`;
    if (progressPercentText) {
      progressPercentText.textContent = `${percentage}% Complete`;
    }
  }

  if (form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach((input) => {
      input.addEventListener('input', updateFormProgress);
      input.addEventListener('change', updateFormProgress);
    });
  }

  if (!form) return;

  const submitBtn = document.getElementById('quote-submit-btn');
  const successCard = document.getElementById('quote-success-card');
  const successClientName = document.getElementById('success-client-name');
  const successPackageName = document.getElementById('success-package-name');
  const resetBtn = document.getElementById('reset-quote-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameVal = document.getElementById('client-name')?.value.trim() || 'Electrical Contractor';
    const bizVal = document.getElementById('business-name')?.value.trim() || 'Electrical Business';
    const selectedPkg = packageSelect ? packageSelect.options[packageSelect.selectedIndex].text : 'Standard Package';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span>
        <span>Sending Request...</span>
      `;
    }

    setTimeout(() => {
      form.style.display = 'none';
      if (successCard) {
        successCard.style.display = 'flex';
        if (successClientName) successClientName.textContent = `${nameVal} (${bizVal})`;
        if (successPackageName) successPackageName.textContent = selectedPkg;
        successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 700);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      if (successCard) successCard.style.display = 'none';
      presetChips.forEach((c) => c.classList.remove('active'));
      updateFormProgress();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Get a Free Quote</span>
          <span class="material-symbols-outlined">arrow_forward</span>
        `;
      }
    });
  }

  // Initial progress computation
  updateFormProgress();
}

/* ==========================================================================
   7. BACK TO TOP & STICKY MOBILE ACTION BAR
   ========================================================================== */
function initBackToTopAndMobileBar() {
  const bttBtn = document.getElementById('back-to-top-btn');
  const mobileBar = document.getElementById('mobile-action-bar');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (bttBtn) {
      if (scrollY > 500) {
        bttBtn.style.display = 'flex';
      } else {
        bttBtn.style.display = 'none';
      }
    }

    if (mobileBar) {
      if (scrollY > 300) {
        mobileBar.classList.add('visible');
      } else {
        mobileBar.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (bttBtn) {
    bttBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   11. INTERACTIVE SUBURB TURF & KEYWORD VISIBILITY SIMULATOR
   ========================================================================== */
function initSuburbTurfSimulator() {
  const container = document.getElementById('suburb-turf-simulator');
  if (!container) return;

  const tabs = container.querySelectorAll('.turf-region-btn');
  const regionNameEl = document.getElementById('turf-region-name');
  const suburbsListEl = document.getElementById('turf-suburbs-list');
  const searchVolumeEl = document.getElementById('turf-monthly-searches');
  const avgValueEl = document.getElementById('turf-avg-job-value');
  const annualOpportunityEl = document.getElementById('turf-annual-opportunity');
  const previewSnippetTitle = document.getElementById('turf-snippet-title');
  const customInput = document.getElementById('turf-custom-suburb-input');
  const customBtn = document.getElementById('turf-custom-suburb-btn');
  const customFeedback = document.getElementById('turf-custom-feedback');

  const regionData = {
    sydney: {
      name: 'Sydney Metro & Eastern Suburbs Radius',
      suburbs: ['Marrickville', 'Bondi', 'Newtown', 'Surry Hills', 'Coogee', 'Balmain', 'Paddington', 'Leichhardt', 'Randwick', 'Alexandria', 'Double Bay', 'Rose Bay', 'Rozelle', 'Annandale'],
      searches: 3850,
      avgTicket: 1350,
      annualOpp: 46200,
      sampleSnippet: 'Apex Electrical Sydney • 24/7 Emergency Electrician Inner West & Bondi'
    },
    melbourne: {
      name: 'Melbourne Bayside & Inner East Territory',
      suburbs: ['Richmond', 'Brighton', 'St Kilda', 'Hawthorn', 'Brunswick', 'Fitzroy', 'South Yarra', 'Camberwell', 'Prahran', 'Port Melbourne', 'Collingwood', 'Elsternwick', 'Footscray'],
      searches: 3400,
      avgTicket: 1280,
      annualOpp: 40960,
      sampleSnippet: 'Apex Electrical Melbourne • REC Licensed Electrician Bayside & Inner East'
    },
    brisbane: {
      name: 'Brisbane Metro & Gold Coast Corridor',
      suburbs: ['New Farm', 'Fortitude Valley', 'Paddington (QLD)', 'Bulimba', 'West End', 'Chermside', 'Indooroopilly', 'Carindale', 'Surfers Paradise', 'Southport', 'Robina', 'Burleigh Heads'],
      searches: 2950,
      avgTicket: 1200,
      annualOpp: 35400,
      sampleSnippet: 'Apex Electrical QLD • Fast Switchboard Upgrades & EV Chargers Brisbane'
    },
    perth: {
      name: 'Perth Metro & Coastal Corridor',
      suburbs: ['Cottesloe', 'Fremantle', 'Subiaco', 'Scarborough', 'Joondalup', 'Mount Lawley', 'Claremont', 'South Perth', 'Victoria Park', 'Applecross', 'Nedlands'],
      searches: 2300,
      avgTicket: 1250,
      annualOpp: 28750,
      sampleSnippet: 'Apex Electrical WA • EC Licensed Contractors Perth Metro & Fremantle'
    },
    adelaide: {
      name: 'Adelaide Metro & Hills Territory',
      suburbs: ['Norwood', 'Glenelg', 'Unley', 'Prospect', 'Burnside', 'North Adelaide', 'Brighton (SA)', 'Stirling', 'Mawson Lakes', 'Henley Beach', 'Hyde Park'],
      searches: 1850,
      avgTicket: 1150,
      annualOpp: 22200,
      sampleSnippet: 'Apex Electrical SA • Emergency Electrician Adelaide Metro & Coastal'
    }
  };

  let previousSearches = 0;
  let previousOpp = 0;

  function renderRegion(key) {
    const data = regionData[key] || regionData.sydney;

    if (regionNameEl) regionNameEl.textContent = data.name;
    if (previewSnippetTitle) previewSnippetTitle.textContent = data.sampleSnippet;

    if (suburbsListEl) {
      suburbsListEl.innerHTML = data.suburbs.map(sub => `
        <span class="turf-suburb-tag">
          <span class="material-symbols-outlined" style="font-size: 13px; color: var(--color-accent);">location_on</span>
          <span>${sub}</span>
        </span>
      `).join('');
    }

    if (searchVolumeEl) {
      animateNumber(searchVolumeEl, previousSearches, data.searches, '', ' /mo', 400);
      previousSearches = data.searches;
    }

    if (avgValueEl) {
      avgValueEl.textContent = `$${data.avgTicket.toLocaleString('en-AU')} AUD`;
    }

    if (annualOpportunityEl) {
      animateNumber(annualOpportunityEl, previousOpp, data.annualOpp, '+$', ' AUD/yr', 450);
      previousOpp = data.annualOpp;
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const reg = tab.getAttribute('data-region') || 'sydney';
      renderRegion(reg);
    });
  });

  // Custom Suburb Search Handler
  if (customBtn && customInput) {
    const handleCustomSuburb = () => {
      const query = customInput.value.trim();
      if (!query) return;

      if (customFeedback) {
        customFeedback.style.display = 'block';
        customFeedback.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px; color: var(--color-accent); font-weight: 700;">
            <span class="material-symbols-outlined" style="font-size: 16px; animation: spin 1s infinite;">sync</span>
            <span>Calculating 15km Local Schema Turf for "${query}"...</span>
          </div>
        `;
        setTimeout(() => {
          customFeedback.innerHTML = `
            <div style="padding: 12px 14px; background: rgba(52, 211, 153, 0.08); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: var(--radius-sm); color: #34d399; font-size: 0.8125rem;">
              <strong>✓ Ready for Launch:</strong> We configure Google Schema.org <code>areaServed</code> tags for <strong>${query}</strong> + surrounding adjacent suburbs so when local homeowners search, your phone rings directly without HiPages lead auction fees.
            </div>
          `;
        }, 500);
      }
    };

    customBtn.addEventListener('click', handleCustomSuburb);
    customInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCustomSuburb();
      }
    });
  }

  // Initialize Sydney by default
  renderRegion('sydney');
}

/* ==========================================================================
   12. MICRO-INTERACTIONS: 3D PERSPECTIVE TILT
   ========================================================================== */
function initTiltEffect() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window) return;

  // 1. Hero Showcase Browser Frame (Subtle Floating Animation + 3D Perspective Tilt on Mouse-Hover)
  const heroWrapper = document.querySelector('#home-hero .hero-visual .showcase-wrapper');
  const heroFrame = heroWrapper ? heroWrapper.querySelector('.browser-frame') : null;

  if (heroFrame) {
    heroFrame.addEventListener('mousemove', (e) => {
      const rect = heroFrame.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4.5;
      const rotateY = ((x - centerX) / centerX) * 4.5;

      heroFrame.style.animationPlayState = 'paused';
      heroFrame.style.transform = `perspective(1200px) translateY(-10px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.012, 1.012, 1.012)`;
    });

    heroFrame.addEventListener('mouseleave', () => {
      heroFrame.style.animationPlayState = 'running';
      heroFrame.style.transform = '';
      heroFrame.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
    });

    heroFrame.addEventListener('mouseenter', () => {
      heroFrame.style.transition = 'transform 0.12s ease-out, box-shadow 0.3s ease';
    });
  }

  // 2. Featured cards tilt
  const otherTiltElements = document.querySelectorAll('.tradie-comp-card.highlight, .pricing-card.featured');
  otherTiltElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3.5;
      const rotateY = ((x - centerX) / centerX) * 3.5;

      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'transform 0.1s ease-out';
    });
  });
}
