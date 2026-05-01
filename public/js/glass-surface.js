// ─────────────────────────────────────────────
// GlassSurface — Vanilla JS Port
// Based on @react-bits/GlassSurface
// ─────────────────────────────────────────────

const GlassSurface = {
  _counter: 0,

  // ── Browser Support Detection ─────────────────

  _svgFiltersOk: null,

  supportsSVGFilters() {
    if (this._svgFiltersOk !== null) return this._svgFiltersOk;
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return (this._svgFiltersOk = false);
    }
    const ua = navigator.userAgent;
    const isSafari  = /Safari/.test(ua) && !/Chrome/.test(ua);
    const isFirefox = /Firefox/.test(ua);
    if (isSafari || isFirefox) return (this._svgFiltersOk = false);

    const probe = document.createElement('div');
    probe.style.backdropFilter = 'url(#probe-test)';
    return (this._svgFiltersOk = probe.style.backdropFilter !== '');
  },

  // ── Displacement-map SVG data-URL ─────────────

  _generateMap(el, opts) {
    const rect = el.getBoundingClientRect();
    const w    = rect.width  || 200;
    const h    = rect.height || 40;
    const edgeSize = Math.min(w, h) * (opts.borderWidth * 0.5);
    const { redGradId, blueGradId, borderRadius, brightness, opacity, blur, mixBlendMode } = opts;

    const svg = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="red"/>
        </linearGradient>
        <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="blue"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${w}" height="${h}" fill="black"/>
      <rect x="0" y="0" width="${w}" height="${h}" rx="${borderRadius}" fill="url(#${redGradId})"/>
      <rect x="0" y="0" width="${w}" height="${h}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode:${mixBlendMode}"/>
      <rect x="${edgeSize}" y="${edgeSize}"
            width="${w - edgeSize * 2}" height="${h - edgeSize * 2}"
            rx="${borderRadius}"
            fill="hsl(0 0% ${brightness}% / ${opacity})"
            style="filter:blur(${blur}px)"/>
    </svg>`;

    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  },

  // ── Build the SVG filter element ──────────────

  _buildSVG(filterId, opts) {
    const NS = 'http://www.w3.org/2000/svg';
    const $ = (tag, attrs = {}) => {
      const el = document.createElementNS(NS, tag);
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      return el;
    };

    const svg    = $('svg');
    svg.classList.add('glass-surface__filter');

    const defs   = $('defs');
    const filter = $('filter', {
      id: filterId,
      colorInterpolationFilters: 'sRGB',
      x: '0%', y: '0%', width: '100%', height: '100%',
    });

    const feImage = $('feImage', {
      x: '0', y: '0', width: '100%', height: '100%',
      preserveAspectRatio: 'none', result: 'map',
    });

    const ch = (suffix, result, matrix) => {
      const disp = $('feDisplacementMap', {
        in: 'SourceGraphic', in2: 'map',
        scale: (opts.distortionScale + opts[`${suffix}Offset`]).toString(),
        xChannelSelector: opts.xChannel,
        yChannelSelector: opts.yChannel,
        result: `disp${suffix}`,
      });
      const mat = $('feColorMatrix', {
        in: `disp${suffix}`, type: 'matrix', values: matrix, result,
      });
      return [disp, mat];
    };

    const [rDisp, rMat] = ch('red',   'red',   '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0');
    const [gDisp, gMat] = ch('green', 'green', '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0');
    const [bDisp, bMat] = ch('blue',  'blue',  '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0');

    const blend1 = $('feBlend', { in: 'red',  in2: 'green', mode: 'screen', result: 'rg' });
    const blend2 = $('feBlend', { in: 'rg',   in2: 'blue',  mode: 'screen', result: 'output' });
    const gBlur  = $('feGaussianBlur', { in: 'output', stdDeviation: opts.displace.toString() });

    [feImage, rDisp, rMat, gDisp, gMat, bDisp, bMat, blend1, blend2, gBlur]
      .forEach(n => filter.appendChild(n));

    defs.appendChild(filter);
    svg.appendChild(defs);

    return { svg, feImage };
  },

  // ── Core apply() ──────────────────────────────

  apply(el, options = {}) {
    const id = ++this._counter;
    const filterId  = `glass-filter-${id}`;
    const redGradId = `red-grad-${id}`;
    const blueGradId= `blue-grad-${id}`;

    const opts = Object.assign({
      borderRadius:    999,
      borderWidth:     0.07,
      brightness:      45,
      opacity:         0.88,
      blur:            6,
      displace:        0,
      backgroundOpacity: 0,
      saturation:      1.3,
      distortionScale: -120,
      redOffset:       0,
      greenOffset:     8,
      blueOffset:      16,
      xChannel:        'R',
      yChannel:        'G',
      mixBlendMode:    'difference',
    }, options, { redGradId, blueGradId });

    const svgOk = this.supportsSVGFilters();

    // Classes & CSS vars
    el.classList.add('glass-surface');
    el.classList.add(svgOk ? 'glass-surface--svg' : 'glass-surface--fallback');
    el.style.setProperty('--glass-frost',      opts.backgroundOpacity);
    el.style.setProperty('--glass-saturation', opts.saturation);
    el.style.setProperty('--filter-id',        `url(#${filterId})`);

    if (!svgOk) return; // Fallback: CSS handles the rest

    // Build & inject SVG filter
    const { svg, feImage } = this._buildSVG(filterId, opts);
    el.insertBefore(svg, el.firstChild);

    // Update feImage with a rendered displacement map data-URL
    const update = () => feImage.setAttribute('href', this._generateMap(el, opts));
    setTimeout(update, 0);

    // Re-render when element resizes
    const ro = new ResizeObserver(() => setTimeout(update, 0));
    ro.observe(el);
    el._glassSurfaceObserver = ro;
  },

  // ── Apply to all category tab buttons ─────────

  applyToTabs(opts = {}) {
    document.querySelectorAll('.categories__tab').forEach(tab => {
      this.apply(tab, Object.assign({
        borderRadius:    999,
        brightness:      45,
        opacity:         0.88,
        blur:            5,
        distortionScale: -100,
        redOffset:       0,
        greenOffset:     7,
        blueOffset:      14,
        backgroundOpacity: 0.04,
        saturation:      1.4,
        displace:        0,
      }, opts));
    });
  },
};
