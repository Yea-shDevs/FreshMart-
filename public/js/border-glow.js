// ─────────────────────────────────────────────
// BorderGlow — Vanilla JS Port
// Based on @react-bits/BorderGlow
// ─────────────────────────────────────────────

const BorderGlow = {
  // Config for product cards
  config: {
    edgeSensitivity: 30,
    glowColor: '160 80 65',
    borderRadius: 20,
    glowRadius: 40,
    glowIntensity: 1.0,
    coneSpread: 25,
    fillOpacity: 0.5,
    colors: ['#34d399', '#a78bfa', '#38bdf8'],
  },

  // Config for category tab pills
  tabConfig: {
    edgeSensitivity: 20,
    glowColor: '160 85 60',
    borderRadius: 999,
    glowRadius: 18,
    glowIntensity: 1.2,
    coneSpread: 30,
    fillOpacity: 0.35,
    colors: ['#34d399', '#818cf8', '#22d3ee'],
  },

  // ── Helpers ───────────────────────────────────

  parseHSL(hslStr) {
    const m = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
    if (!m) return { h: 160, s: 80, l: 65 };
    return { h: parseFloat(m[1]), s: parseFloat(m[2]), l: parseFloat(m[3]) };
  },

  buildGlowVars(glowColor, intensity) {
    const { h, s, l } = this.parseHSL(glowColor);
    const base = `${h}deg ${s}% ${l}%`;
    return {
      '--glow-color':    `hsl(${base} / ${Math.min(100  * intensity, 100)}%)`,
      '--glow-color-60': `hsl(${base} / ${Math.min( 60  * intensity, 100)}%)`,
      '--glow-color-50': `hsl(${base} / ${Math.min( 50  * intensity, 100)}%)`,
      '--glow-color-40': `hsl(${base} / ${Math.min( 40  * intensity, 100)}%)`,
      '--glow-color-30': `hsl(${base} / ${Math.min( 30  * intensity, 100)}%)`,
      '--glow-color-20': `hsl(${base} / ${Math.min( 20  * intensity, 100)}%)`,
      '--glow-color-10': `hsl(${base} / ${Math.min( 10  * intensity, 100)}%)`,
    };
  },

  buildGradientVars(colors) {
    const positions = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
    const keys      = ['--gradient-one','--gradient-two','--gradient-three','--gradient-four','--gradient-five','--gradient-six','--gradient-seven'];
    const colorMap  = [0, 1, 2, 0, 1, 2, 1];
    const vars = {};
    for (let i = 0; i < 7; i++) {
      const c = colors[Math.min(colorMap[i], colors.length - 1)];
      vars[keys[i]] = `radial-gradient(at ${positions[i]}, ${c} 0px, transparent 50%)`;
    }
    vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`;
    return vars;
  },

  // ── Per-card logic ────────────────────────────

  getCenterOf(el) {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  },

  getEdgeProximity(el, x, y) {
    const [cx, cy] = this.getCenterOf(el);
    const dx = x - cx, dy = y - cy;
    let kx = Infinity, ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  },

  getCursorAngle(el, x, y) {
    const [cx, cy] = this.getCenterOf(el);
    const dx = x - cx, dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    let deg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (deg < 0) deg += 360;
    return deg;
  },

  // ── Apply vars to a card element ──────────────

  applyVars(card, vars) {
    for (const [k, v] of Object.entries(vars)) {
      card.style.setProperty(k, v);
    }
  },

  // ── Shared wrap helper (used by both cards & tabs) ──

  _wrap(el, cfg, extraClass = '') {
    const wrapper = document.createElement('div');
    wrapper.className = `border-glow-card${extraClass ? ' ' + extraClass : ''}`;

    wrapper.style.setProperty('--card-bg', 'var(--card-bg-color, #1c2030)');
    wrapper.style.setProperty('--edge-sensitivity', cfg.edgeSensitivity);
    wrapper.style.setProperty('--border-radius', `${cfg.borderRadius}px`);
    wrapper.style.setProperty('--glow-padding', `${cfg.glowRadius}px`);
    wrapper.style.setProperty('--cone-spread', cfg.coneSpread);
    wrapper.style.setProperty('--fill-opacity', cfg.fillOpacity);

    this.applyVars(wrapper, this.buildGlowVars(cfg.glowColor, cfg.glowIntensity));
    this.applyVars(wrapper, this.buildGradientVars(cfg.colors));

    const edgeLight = document.createElement('span');
    edgeLight.className = 'edge-light';
    wrapper.appendChild(edgeLight);

    const inner = document.createElement('div');
    inner.className = 'border-glow-inner';

    el.parentNode && el.parentNode.insertBefore(wrapper, el);
    inner.appendChild(el);
    wrapper.appendChild(inner);

    wrapper.addEventListener('pointermove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      wrapper.style.setProperty('--edge-proximity', (this.getEdgeProximity(wrapper, x, y) * 100).toFixed(3));
      wrapper.style.setProperty('--cursor-angle', `${this.getCursorAngle(wrapper, x, y).toFixed(3)}deg`);
    });

    wrapper.addEventListener('pointerleave', () => {
      wrapper.style.setProperty('--edge-proximity', '0');
    });

    return wrapper;
  },

  // ── Wrap a product card ───────────────────────

  wrapCard(productCard) {
    return this._wrap(productCard, this.config);
  },

  // ── Wrap a category tab pill ──────────────────

  wrapTab(tabEl) {
    return this._wrap(tabEl, this.tabConfig, 'border-glow-card--tab');
  },

  // ── Init: wrap all existing product cards ─────

  init() {
    document.querySelectorAll('.product-card').forEach(card => this.wrapCard(card));
  },

  // ── Public API ────────────────────────────────

  wrapNew(productCard) { return this.wrapCard(productCard); },
};
