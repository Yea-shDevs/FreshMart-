// ─────────────────────────────────────────────
// FreshMart — Product Listing Module
// ─────────────────────────────────────────────

const Products = {
  container: null,
  countEl: null,
  titleEl: null,
  emptyEl: null,
  currentCategory: "All",
  allProducts: [],
  detailQty: 1,
  detailProduct: null,

  init() {
    this.container = document.getElementById("products-grid");
    this.countEl = document.getElementById("products-count");
    this.titleEl = document.getElementById("products-title");
    this.emptyEl = document.getElementById("products-empty");
    this.loadCategories();
    this.loadProducts();
    this.initDetailModal();
  },

  async loadCategories() {
    try {
      const { data: categories } = await API.getCategories();
      const tabsContainer = document.getElementById("category-tabs");
      tabsContainer.innerHTML = "";

      categories.forEach((cat) => {
        const btn = document.createElement("button");
        btn.className = `categories__tab${cat === "All" ? " categories__tab--active" : ""}`;
        btn.textContent = cat;
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", cat === "All");
        btn.addEventListener("click", () => this.selectCategory(cat, btn));

        // Apply glass surface to the button pill itself
        GlassSurface.apply(btn, {
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
        });

        // Then wrap with BorderGlow (outer edge-proximity glow)
        const wrappedTab = BorderGlow.wrapTab(btn);
        tabsContainer.appendChild(wrappedTab);
      });
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  },

  selectCategory(category, tabEl) {
    this.currentCategory = category;

    document.querySelectorAll(".categories__tab").forEach((t) => {
      t.classList.remove("categories__tab--active");
      t.setAttribute("aria-selected", "false");
    });
    tabEl.classList.add("categories__tab--active");
    tabEl.setAttribute("aria-selected", "true");

    this.titleEl.textContent = category === "All" ? "All Products" : category;
    this.loadProducts();
  },

  async loadProducts(search = "") {
    try {
      const params = {};
      if (this.currentCategory !== "All") params.category = this.currentCategory;
      if (search) params.search = search;

      const { data: products, count } = await API.getProducts(params);
      this.allProducts = products;

      this.countEl.textContent = `${count} item${count !== 1 ? "s" : ""}`;
      this.container.innerHTML = "";

      if (products.length === 0) {
        this.emptyEl.style.display = "block";
        this.container.style.display = "none";
        return;
      }

      this.emptyEl.style.display = "none";
      this.container.style.display = "grid";

      products.forEach((product, i) => {
        const card    = this.createCard(product, i);
        const wrapped = BorderGlow.wrapNew(card);
        this.container.appendChild(wrapped);
      });
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  },

  createCard(product, index) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.animationDelay = `${index * 0.06}s`;
    card.style.cursor = "pointer";
    card.id = `product-${product.id}`;

    card.innerHTML = `
      <div class="product-card__image-wrap">
        <img class="product-card__image" src="${product.image}" alt="${product.name}"
             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22><rect fill=%22%231c2030%22 width=%22200%22 height=%22200%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2248%22>🥬</text></svg>'" />
        ${product.badge ? `<span class="product-card__badge">${product.badge}</span>` : ""}
      </div>
      <div class="product-card__body">
        <div class="product-card__category">${product.category}</div>
        <h3 class="product-card__name">${product.name}</h3>
        <p class="product-card__description">${product.description}</p>
        <div class="product-card__footer">
          <div>
            <span class="product-card__price">₹${product.price.toFixed(2)}</span>
            <span class="product-card__price-unit">/ ${product.unit}</span>
          </div>
          <button class="product-card__add-btn" id="add-btn-${product.id}" data-add-btn="${product.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add
          </button>
        </div>
      </div>
    `;

    // Click anywhere on card opens the detail modal
    card.addEventListener("click", (e) => {
      // Don't open modal if clicking the Add button
      if (e.target.closest("[data-add-btn]")) return;
      this.openDetail(product);
    });

    // Add button handler
    const addBtn = card.querySelector("[data-add-btn]");
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.addToCart(product.id, addBtn);
    });

    return card;
  },

  // ── Detail Modal ──────────────────────────
  initDetailModal() {
    const overlay = document.getElementById("product-detail-overlay");
    const closeBtn = document.getElementById("product-detail-close");
    const minusBtn = document.getElementById("product-detail-qty-minus");
    const plusBtn = document.getElementById("product-detail-qty-plus");
    const addBtn = document.getElementById("product-detail-add");

    overlay.addEventListener("click", () => this.closeDetail());
    closeBtn.addEventListener("click", () => this.closeDetail());

    minusBtn.addEventListener("click", () => {
      if (this.detailQty > 1) {
        this.detailQty--;
        document.getElementById("product-detail-qty").textContent = this.detailQty;
      }
    });

    plusBtn.addEventListener("click", () => {
      if (this.detailProduct && this.detailQty < this.detailProduct.stock) {
        this.detailQty++;
        document.getElementById("product-detail-qty").textContent = this.detailQty;
      }
    });

    addBtn.addEventListener("click", () => {
      if (this.detailProduct) {
        this.addToCartFromDetail(this.detailProduct.id, this.detailQty);
      }
    });

    // Escape key closes modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeDetail();
    });
  },

  openDetail(product) {
    this.detailProduct = product;
    this.detailQty = 1;

    const fallbackSrc = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 400%22><rect fill=%22%231c2030%22 width=%22400%22 height=%22400%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2264%22>🥬</text></svg>";

    document.getElementById("product-detail-image").src = product.image;
    document.getElementById("product-detail-image").alt = product.name;
    document.getElementById("product-detail-image").onerror = function () { this.src = fallbackSrc; };
    document.getElementById("product-detail-badge").textContent = product.badge || "";
    document.getElementById("product-detail-category").textContent = product.category;
    document.getElementById("product-detail-name").textContent = product.name;
    document.getElementById("product-detail-description").textContent = product.description;
    document.getElementById("product-detail-price").textContent = `₹${product.price.toFixed(2)}`;
    document.getElementById("product-detail-unit").textContent = product.unit;
    document.getElementById("product-detail-stock").textContent = `${product.stock} units`;
    document.getElementById("product-detail-qty").textContent = "1";

    document.getElementById("product-detail-overlay").classList.add("modal-overlay--open");
    document.getElementById("product-detail-modal").classList.add("modal--open");
    document.body.style.overflow = "hidden";
  },

  closeDetail() {
    document.getElementById("product-detail-overlay").classList.remove("modal-overlay--open");
    document.getElementById("product-detail-modal").classList.remove("modal--open");
    document.body.style.overflow = "";
    this.detailProduct = null;
  },

  async addToCartFromDetail(productId, quantity) {
    const btn = document.getElementById("product-detail-add");
    const original = btn.innerHTML;

    try {
      btn.innerHTML = "✓ Added!";
      btn.disabled = true;

      await API.addToCart(productId, quantity);
      Cart.refresh();
      App.showToast(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart!`, "success");

      setTimeout(() => {
        this.closeDetail();
        btn.innerHTML = original;
        btn.disabled = false;
      }, 800);
    } catch (err) {
      btn.innerHTML = original;
      btn.disabled = false;
      App.showToast(err.message || "Failed to add", "error");
    }
  },

  async addToCart(productId, btnEl) {
    try {
      btnEl.classList.add("product-card__add-btn--added");
      btnEl.innerHTML = "✓ Added";

      await API.addToCart(productId);
      Cart.refresh();
      App.showToast("Added to cart!", "success");

      setTimeout(() => {
        btnEl.classList.remove("product-card__add-btn--added");
        btnEl.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add
        `;
      }, 1200);
    } catch (err) {
      btnEl.classList.remove("product-card__add-btn--added");
      App.showToast(err.message || "Failed to add", "error");
    }
  },
};
