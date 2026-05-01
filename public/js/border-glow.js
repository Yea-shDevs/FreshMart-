// ─────────────────────────────────────────────
// BorderGlow — Vanilla JS Port
// Based on @react-bits/BorderGlow
// ─────────────────────────────────────────────

const BorderGlow = {
  // Config — tweak these to match the desired look
  config: {
    edgeSensitivity: 30,
    glowColor: '160 80 65',     // green-teal to match FreshMart
    borderRadius: 20,
    glowRadius: 40,
    glowIntensity: 1.0,
    coneSpread: 25,
    fillOpacity: 0.5,
    colors: ['#34d399', '#a78bfa', '#38bdf8'],  // emerald / violet / sky
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

  // ── Wrap a product card ───────────────────────

  wrapCard(productCard) {
    const cfg = this.config;

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'border-glow-card';

    // Apply static CSS vars
    wrapper.style.setProperty('--card-bg', 'var(--card-bg-color, #1c2030)');
    wrapper.style.setProperty('--edge-sensitivity', cfg.edgeSensitivity);
    wrapper.style.setProperty('--border-radius', `${cfg.borderRadius}px`);
    wrapper.style.setProperty('--glow-padding', `${cfg.glowRadius}px`);
    wrapper.style.setProperty('--cone-spread', cfg.coneSpread);
    wrapper.style.setProperty('--fill-opacity', cfg.fillOpacity);

    this.applyVars(wrapper, this.buildGlowVars(cfg.glowColor, cfg.glowIntensity));
    this.applyVars(wrapper, this.buildGradientVars(cfg.colors));

    // Edge light span
    const edgeLight = document.createElement('span');
    edgeLight.className = 'edge-light';
    wrapper.appendChild(edgeLight);

    // Inner div
    const inner = document.createElement('div');
    inner.className = 'border-glow-inner';

    // Move product card into inner
    productCard.parentNode && productCard.parentNode.insertBefore(wrapper, productCard);
    inner.appendChild(productCard);
    wrapper.appendChild(inner);

    // Pointer tracking
    wrapper.addEventListener('pointermove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const edge  = this.getEdgeProximity(wrapper, x, y);
      const angle = this.getCursorAngle(wrapper, x, y);

      wrapper.style.setProperty('--edge-proximity', (edge * 100).toFixed(3));
      wrapper.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
    });

    wrapper.addEventListener('pointerleave', () => {
      wrapper.style.setProperty('--edge-proximity', '0');
    });

    return wrapper;
  },

  // ── Init: wrap all existing product cards ─────

  init() {
    document.querySelectorAll('.product-card').forEach(card => {
      this.wrapCard(card);
    });
  },

  // ── Called after new cards are injected ───────

  wrapNew(productCard) {
    return this.wrapCard(productCard);
  },
};
