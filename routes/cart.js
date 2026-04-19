// ─────────────────────────────────────────────
// Cart Routes — CRUD /api/cart
// ─────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const products = require("../data/products");

// In-memory cart (keyed by product ID)
const cart = new Map();

// GET /api/cart — full cart with totals
router.get("/", (req, res) => {
  const items = [];
  let subtotal = 0;

  for (const [productId, quantity] of cart) {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const itemTotal = product.price * quantity;
      subtotal += itemTotal;
      items.push({
        product,
        quantity,
        itemTotal: Math.round(itemTotal * 100) / 100,
      });
    }
  }

  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const delivery = subtotal > 35 ? 0 : 4.99;
  const total = Math.round((subtotal + tax + delivery) * 100) / 100;

  res.json({
    success: true,
    data: {
      items,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: Math.round(subtotal * 100) / 100,
      tax,
      delivery,
      freeDeliveryThreshold: 35,
      total,
    },
  });
});

// POST /api/cart — add item { productId, quantity }
router.post("/", (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, message: "productId is required" });
  }

  const product = products.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  const current = cart.get(productId) || 0;
  const newQty = current + quantity;

  if (newQty > product.stock) {
    return res.status(400).json({ success: false, message: "Exceeds available stock" });
  }

  cart.set(productId, newQty);

  res.json({
    success: true,
    message: `${product.name} added to cart`,
    data: { productId, quantity: newQty },
  });
});

// PUT /api/cart/:productId — update quantity
router.put("/:productId", (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!cart.has(productId)) {
    return res.status(404).json({ success: false, message: "Item not in cart" });
  }

  const product = products.find((p) => p.id === productId);

  if (quantity <= 0) {
    cart.delete(productId);
    return res.json({ success: true, message: "Item removed from cart" });
  }

  if (quantity > product.stock) {
    return res.status(400).json({ success: false, message: "Exceeds available stock" });
  }

  cart.set(productId, quantity);
  res.json({
    success: true,
    message: "Quantity updated",
    data: { productId, quantity },
  });
});

// DELETE /api/cart/:productId — remove single item
router.delete("/:productId", (req, res) => {
  const { productId } = req.params;

  if (!cart.has(productId)) {
    return res.status(404).json({ success: false, message: "Item not in cart" });
  }

  const product = products.find((p) => p.id === productId);
  cart.delete(productId);

  res.json({
    success: true,
    message: `${product ? product.name : "Item"} removed from cart`,
  });
});

// DELETE /api/cart — clear entire cart
router.delete("/", (req, res) => {
  cart.clear();
  res.json({ success: true, message: "Cart cleared" });
});

// Export cart reference for orders
router.cart = cart;
module.exports = router;
