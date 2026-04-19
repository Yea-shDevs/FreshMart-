// ─────────────────────────────────────────────
// FreshMart — Cart & Checkout Module
// ─────────────────────────────────────────────

const Cart = {
  drawer: null,
  overlay: null,
  body: null,
  footer: null,
  badge: null,
  isOpen: false,
  data: null,

  init() {
    this.drawer = document.getElementById("cart-drawer");
    this.overlay = document.getElementById("cart-overlay");
    this.body = document.getElementById("cart-body");
    this.footer = document.getElementById("cart-footer");
    this.badge = document.getElementById("cart-badge");

    document.getElementById("cart-btn").addEventListener("click", () => this.open());
    document.getElementById("cart-close").addEventListener("click", () => this.close());
    this.overlay.addEventListener("click", () => this.close());
    document.getElementById("checkout-btn").addEventListener("click", () => this.openCheckout());

    this.initCheckout();
    this.refresh();
  },

  async refresh() {
    try {
      const { data } = await API.getCart();
      this.data = data;
      this.updateBadge(data.itemCount);
      this.render(data);
    } catch (err) {
      console.error("Failed to refresh cart:", err);
    }
  },

  updateBadge(count) {
    this.badge.textContent = count;
    if (count > 0) {
      this.badge.classList.add("header__cart-badge--visible");
      this.badge.classList.add("header__cart-badge--bump");
      setTimeout(() => this.badge.classList.remove("header__cart-badge--bump"), 400);
    } else {
      this.badge.classList.remove("header__cart-badge--visible");
    }
  },

  open() {
    this.isOpen = true;
    this.drawer.classList.add("cart-drawer--open");
    this.overlay.classList.add("cart-overlay--open");
    document.body.style.overflow = "hidden";
    this.refresh();
  },

  close() {
    this.isOpen = false;
    this.drawer.classList.remove("cart-drawer--open");
    this.overlay.classList.remove("cart-overlay--open");
    document.body.style.overflow = "";
  },

  render(data) {
    if (!data.items.length) {
      this.body.innerHTML = `
        <div class="cart-drawer__empty">
          <span class="cart-drawer__empty-icon">🛒</span>
          <p>Your cart is empty</p>
          <p style="font-size: 0.82rem; margin-top: 0.5rem;">Start adding some fresh groceries!</p>
        </div>
      `;
      this.footer.style.display = "none";
      return;
    }

    this.footer.style.display = "block";

    this.body.innerHTML = data.items
      .map(
        (item) => `
      <div class="cart-item" id="cart-item-${item.product.id}">
        <img class="cart-item__image" src="${item.product.image}" alt="${item.product.name}"
             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22><rect fill=%22%231c2030%22 width=%2264%22 height=%2264%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2224%22>🥬</text></svg>'" />
        <div class="cart-item__info">
          <div class="cart-item__name">${item.product.name}</div>
          <div class="cart-item__price">$${item.product.price.toFixed(2)} / ${item.product.unit}</div>
          <div class="cart-item__actions">
            <button class="cart-item__qty-btn" onclick="Cart.updateQty('${item.product.id}', ${item.quantity - 1})">−</button>
            <span class="cart-item__qty">${item.quantity}</span>
            <button class="cart-item__qty-btn" onclick="Cart.updateQty('${item.product.id}', ${item.quantity + 1})">+</button>
            <button class="cart-item__remove" onclick="Cart.remove('${item.product.id}')" aria-label="Remove item">🗑</button>
          </div>
        </div>
        <div class="cart-item__total">$${item.itemTotal.toFixed(2)}</div>
      </div>
    `
      )
      .join("");

    // Update footer totals
    document.getElementById("cart-subtotal").textContent = `$${data.subtotal.toFixed(2)}`;
    document.getElementById("cart-tax").textContent = `$${data.tax.toFixed(2)}`;

    const deliveryEl = document.getElementById("cart-delivery");
    if (data.delivery === 0) {
      deliveryEl.textContent = "FREE";
      deliveryEl.className = "cart-delivery--free";
    } else {
      deliveryEl.textContent = `$${data.delivery.toFixed(2)}`;
      deliveryEl.className = "";
    }

    document.getElementById("cart-total").textContent = `$${data.total.toFixed(2)}`;
  },

  async updateQty(productId, quantity) {
    try {
      if (quantity <= 0) {
        await API.removeFromCart(productId);
      } else {
        await API.updateCartItem(productId, quantity);
      }
      this.refresh();
    } catch (err) {
      App.showToast(err.message || "Failed to update", "error");
    }
  },

  async remove(productId) {
    try {
      await API.removeFromCart(productId);
      this.refresh();
      App.showToast("Item removed", "success");
    } catch (err) {
      App.showToast(err.message || "Failed to remove", "error");
    }
  },

  // ── Checkout ─────────────────────────────
  initCheckout() {
    const checkoutOverlay = document.getElementById("checkout-overlay");
    const checkoutModal = document.getElementById("checkout-modal");
    const checkoutClose = document.getElementById("checkout-close");
    const checkoutForm = document.getElementById("checkout-form");

    checkoutClose.addEventListener("click", () => this.closeCheckout());
    checkoutOverlay.addEventListener("click", () => this.closeCheckout());

    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.placeOrder();
    });

    // Format card number as user types
    document.getElementById("checkout-card").addEventListener("input", (e) => {
      let val = e.target.value.replace(/\D/g, "").substring(0, 16);
      val = val.replace(/(\d{4})(?=\d)/g, "$1 ");
      e.target.value = val;
    });

    // Format expiry
    document.getElementById("checkout-expiry").addEventListener("input", (e) => {
      let val = e.target.value.replace(/\D/g, "").substring(0, 4);
      if (val.length >= 2) val = val.substring(0, 2) + "/" + val.substring(2);
      e.target.value = val;
    });

    // Success close
    document.getElementById("success-close").addEventListener("click", () => this.closeSuccess());
    document.getElementById("success-overlay").addEventListener("click", () => this.closeSuccess());
  },

  openCheckout() {
    if (!this.data || !this.data.items.length) return;

    this.close(); // Close cart drawer first

    document.getElementById("checkout-total").textContent = `$${this.data.total.toFixed(2)}`;
    document.getElementById("checkout-overlay").classList.add("modal-overlay--open");
    document.getElementById("checkout-modal").classList.add("modal--open");
    document.body.style.overflow = "hidden";
  },

  closeCheckout() {
    document.getElementById("checkout-overlay").classList.remove("modal-overlay--open");
    document.getElementById("checkout-modal").classList.remove("modal--open");
    document.body.style.overflow = "";
  },

  async placeOrder() {
    const btn = document.getElementById("place-order-btn");
    const originalText = btn.innerHTML;

    try {
      btn.disabled = true;
      btn.innerHTML = "⏳ Processing...";

      const deliveryInfo = {
        name: document.getElementById("checkout-name").value,
        address: document.getElementById("checkout-address").value,
        phone: document.getElementById("checkout-phone").value,
        deliveryTime: document.getElementById("checkout-time").value,
      };

      const { data: order } = await API.placeOrder(deliveryInfo);

      this.closeCheckout();
      this.showSuccess(order);
      this.refresh();

      // Reset form
      document.getElementById("checkout-form").reset();
    } catch (err) {
      App.showToast(err.message || "Order failed", "error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  },

  showSuccess(order) {
    const details = document.getElementById("success-details");
    details.innerHTML = `
      <p><span>Order #</span><span>${order.orderNumber}</span></p>
      <p><span>Items</span><span>${order.items.length} product${order.items.length !== 1 ? "s" : ""}</span></p>
      <p><span>Total</span><span style="color: var(--accent-light)">$${order.total.toFixed(2)}</span></p>
      <p><span>Status</span><span style="color: var(--accent)">✓ ${order.status}</span></p>
    `;

    document.getElementById("success-overlay").classList.add("modal-overlay--open");
    document.getElementById("success-modal").classList.add("modal--open");
    document.body.style.overflow = "hidden";
  },

  closeSuccess() {
    document.getElementById("success-overlay").classList.remove("modal-overlay--open");
    document.getElementById("success-modal").classList.remove("modal--open");
    document.body.style.overflow = "";
  },
};
