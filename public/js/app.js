// ─────────────────────────────────────────────
// FreshMart — Main Application Controller
// ─────────────────────────────────────────────

const App = {
  searchDebounce: null,

  init() {
    Products.init();
    Cart.init();
    this.initSearch();
    this.initScrollEffects();
    this.initHeroButtons();
  },

  // ── Search ────────────────────────────────
  initSearch() {
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", (e) => {
      clearTimeout(this.searchDebounce);
      this.searchDebounce = setTimeout(() => {
        Products.loadProducts(e.target.value.trim());
      }, 300);
    });
  },

  // ── Scroll Effects ────────────────────────
  initScrollEffects() {
    const header = document.getElementById("header");
    let lastScroll = 0;

    window.addEventListener("scroll", () => {
      const scroll = window.scrollY;
      if (scroll > 50) {
        header.classList.add("header--scrolled");
      } else {
        header.classList.remove("header--scrolled");
      }
      lastScroll = scroll;
    });
  },

  // ── Hero Buttons ──────────────────────────
  initHeroButtons() {
    document.getElementById("hero-shop-btn").addEventListener("click", () => {
      document.getElementById("products-section").scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("hero-categories-btn").addEventListener("click", () => {
      document.getElementById("categories-section").scrollIntoView({ behavior: "smooth" });
    });
  },

  // ── Toast Notifications ───────────────────
  showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <span class="toast__icon">${type === "success" ? "✅" : "❌"}</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast--out");
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  },
};

// ── Boot ────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => App.init());
