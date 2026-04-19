// ─────────────────────────────────────────────
// FreshMart — API Client
// ─────────────────────────────────────────────

const API = {
  base: "/api",

  async request(endpoint, options = {}) {
    try {
      const res = await fetch(`${this.base}${endpoint}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");
      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err.message);
      throw err;
    }
  },

  // ── Products ──────────────────────────────
  getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products${query ? `?${query}` : ""}`);
  },

  getCategories() {
    return this.request("/products/categories");
  },

  getProduct(id) {
    return this.request(`/products/${id}`);
  },

  // ── Cart ──────────────────────────────────
  getCart() {
    return this.request("/cart");
  },

  addToCart(productId, quantity = 1) {
    return this.request("/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  },

  updateCartItem(productId, quantity) {
    return this.request(`/cart/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
  },

  removeFromCart(productId) {
    return this.request(`/cart/${productId}`, {
      method: "DELETE",
    });
  },

  clearCart() {
    return this.request("/cart", { method: "DELETE" });
  },

  // ── Orders ────────────────────────────────
  placeOrder(deliveryInfo = {}) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify({ deliveryInfo }),
    });
  },

  getOrders() {
    return this.request("/orders");
  },
};
