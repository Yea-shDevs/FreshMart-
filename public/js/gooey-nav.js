// ─────────────────────────────────────────────
// GooeyNav — Vanilla JS Port
// Fires gooey particle burst on search bar
// and cart button clicks.
// ─────────────────────────────────────────────

const GooeyNav = {
  particleCount:     15,
  particleDistances: [90, 10],
  particleR:         100,
  animationTime:     600,
  timeVariance:      300,
  colors:            [1, 2, 3, 1, 2, 3, 1, 4],

  containerEl: null,
  filterEl:    null,
  lastTarget:  null,

  // ── Helpers ───────────────────────────────
  noise(n = 1) { return n / 2 - Math.random() * n; },

  getXY(dist, idx, total) {
    const angle = ((360 + this.noise(8)) / total) * idx * (Math.PI / 180);
    return [dist * Math.cos(angle), dist * Math.sin(angle)];
  },

  makeParticle(i) {
    const { particleDistances: d, particleR: r, particleCount: pc, colors, animationTime, timeVariance } = this;
    const t  = animationTime * 2 + this.noise(timeVariance * 2);
    const rot = this.noise(r / 10);
    return {
      start: this.getXY(d[0],              pc - i, pc),
      end:   this.getXY(d[1] + this.noise(7), pc - i, pc),
      time:  t,
      scale: 1 + this.noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rot > 0 ? (rot + r / 20) * 10 : (rot - r / 20) * 10,
    };
  },

  // ── Particle burst ────────────────────────
  spawnParticles(el) {
    const bubbleTime = this.animationTime * 2 + this.timeVariance;
    el.style.setProperty('--time', `${bubbleTime}ms`);
    el.querySelectorAll('.gooey-particle').forEach(p => { try { el.removeChild(p); } catch {} });
    el.classList.remove('active');

    for (let i = 0; i < this.particleCount; i++) {
      const p = this.makeParticle(i);
      setTimeout(() => {
        const particle = document.createElement('span');
        const point    = document.createElement('span');
        particle.classList.add('gooey-particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x',   `${p.end[0]}px`);
        particle.style.setProperty('--end-y',   `${p.end[1]}px`);
        particle.style.setProperty('--time',    `${p.time}ms`);
        particle.style.setProperty('--scale',   `${p.scale}`);
        particle.style.setProperty('--color',   `var(--gooey-color-${p.color}, white)`);
        particle.style.setProperty('--rotate',  `${p.rotate}deg`);
        point.classList.add('gooey-point');
        particle.appendChild(point);
        el.appendChild(particle);
        requestAnimationFrame(() => el.classList.add('active'));
        setTimeout(() => { try { el.removeChild(particle); } catch {} }, p.time);
      }, 30);
    }
  },

  // ── Position effect over target ───────────
  position(targetEl) {
    const cRect = this.containerEl.getBoundingClientRect();
    const tRect = targetEl.getBoundingClientRect();
    Object.assign(this.filterEl.style, {
      left:   `${tRect.left - cRect.left}px`,
      top:    `${tRect.top  - cRect.top}px`,
      width:  `${tRect.width}px`,
      height: `${tRect.height}px`,
    });
  },

  // ── Trigger on click ──────────────────────
  trigger(targetEl) {
    this.lastTarget = targetEl;
    this.position(targetEl);
    this.filterEl.classList.remove('active');
    void this.filterEl.offsetWidth;           // force reflow
    this.spawnParticles(this.filterEl);
  },

  // ── Boot ──────────────────────────────────
  init() {
    this.containerEl = document.querySelector('.header');
    const cartEl     = document.getElementById('cart-btn');
    if (!this.containerEl || !cartEl) return;

    // NOTE: header is already position:fixed — that creates a positioning
    // context for absolute children. Do NOT override it with relative.

    // Create the gooey filter overlay
    this.filterEl = document.createElement('span');
    this.filterEl.className = 'gooey-effect gooey-filter';
    this.containerEl.appendChild(this.filterEl);

    // Only cart button triggers the gooey effect
    cartEl.addEventListener('click', () => this.trigger(cartEl));

    // Reposition on resize
    new ResizeObserver(() => {
      if (this.lastTarget) this.position(this.lastTarget);
    }).observe(this.containerEl);
  },
};

// Direct call — script is at bottom of <body>, DOM already ready
GooeyNav.init();
