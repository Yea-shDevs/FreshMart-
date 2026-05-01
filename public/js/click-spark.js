// ─────────────────────────────────────────────
// ClickSpark — Vanilla JS Port
// Based on @react-bits/ClickSpark
// Attaches a full-page canvas and fires sparks
// on every click anywhere on the document.
// ─────────────────────────────────────────────

const ClickSpark = {
  // ── Config ─────────────────────────────────
  sparkColor:  '#ffffff',
  sparkSize:   10,
  sparkRadius: 15,
  sparkCount:  8,
  duration:    400,
  easing:      'ease-out',
  extraScale:  1.0,

  // ── State ──────────────────────────────────
  canvas:  null,
  ctx:     null,
  sparks:  [],
  rafId:   null,

  // ── Easing ─────────────────────────────────
  ease(t) {
    switch (this.easing) {
      case 'linear':     return t;
      case 'ease-in':    return t * t;
      case 'ease-in-out':return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      default:           return t * (2 - t);   // ease-out
    }
  },

  // ── Canvas setup ───────────────────────────
  _createCanvas() {
    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, {
      position:      'fixed',
      inset:         '0',
      width:         '100%',
      height:        '100%',
      pointerEvents: 'none',
      zIndex:        '99999',
      display:       'block',
      userSelect:    'none',
    });
    document.body.appendChild(canvas);
    return canvas;
  },

  _resize() {
    if (!this.canvas) return;
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  // ── Animation loop ─────────────────────────
  _draw(timestamp) {
    const { ctx, canvas, sparks } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.sparks = sparks.filter(spark => {
      const elapsed  = timestamp - spark.startTime;
      if (elapsed >= this.duration) return false;

      const progress = elapsed / this.duration;
      const eased    = this.ease(progress);
      const distance = eased * this.sparkRadius * this.extraScale;
      const lineLen  = this.sparkSize * (1 - eased);
      const alpha    = 1 - eased;

      const x1 = spark.x + distance             * Math.cos(spark.angle);
      const y1 = spark.y + distance             * Math.sin(spark.angle);
      const x2 = spark.x + (distance + lineLen) * Math.cos(spark.angle);
      const y2 = spark.y + (distance + lineLen) * Math.sin(spark.angle);

      ctx.globalAlpha = alpha;
      ctx.strokeStyle = this.sparkColor;
      ctx.lineWidth   = 2;
      ctx.lineCap     = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      return true;
    });

    ctx.globalAlpha = 1;
    this.rafId = requestAnimationFrame(ts => this._draw(ts));
  },

  // ── Click handler ──────────────────────────
  _onClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    const now  = performance.now();

    for (let i = 0; i < this.sparkCount; i++) {
      this.sparks.push({
        x,
        y,
        angle:     (2 * Math.PI * i) / this.sparkCount,
        startTime: now,
      });
    }
  },

  // ── Public: init ───────────────────────────
  init(options = {}) {
    Object.assign(this, options);

    this.canvas = this._createCanvas();
    this.ctx    = this.canvas.getContext('2d');
    this._resize();

    window.addEventListener('resize', () => this._resize());
    document.addEventListener('click', e => this._onClick(e));

    this.rafId = requestAnimationFrame(ts => this._draw(ts));
  },
};

// Auto-init — script is at the bottom of <body>, DOM is already ready
ClickSpark.init({
  sparkColor:  '#4ade80',   // FreshMart green
  sparkSize:   12,
  sparkRadius: 22,
  sparkCount:  8,
  duration:    500,
  easing:      'ease-out',
  extraScale:  1.2,
});
