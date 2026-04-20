// ─────────────────────────────────────────────
// Order Routes — /api/orders
// ─────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const products = require("../data/products");
const cartRouter = require("./cart");

// In-memory order store
const orders = [];

// POST /api/orders — place an order from current cart
router.post("/", (req, res) => {
  const cart = cartRouter.cart;

  if (cart.size === 0) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
  }

  const items = [];
  let subtotal = 0;

  for (const [productId, quantity] of cart) {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const itemTotal = product.price * quantity;
      subtotal += itemTotal;
      items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        itemTotal: Math.round(itemTotal * 100) / 100,
      });
    }
  }

  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const delivery = subtotal > 500 ? 0 : 49;
  const total = Math.round((subtotal + tax + delivery) * 100) / 100;

  const order = {
    id: uuidv4(),
    orderNumber: `FM-${Date.now().toString(36).toUpperCase()}`,
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    tax,
    delivery,
    total,
    status: "confirmed",
    createdAt: new Date().toISOString(),
    deliveryInfo: req.body.deliveryInfo || null,
  };

  orders.push(order);

  // Clear the cart after placing order
  cart.clear();

  res.status(201).json({
    success: true,
    message: "Order placed successfully!",
    data: order,
  });
});

// GET /api/orders — list all orders
router.get("/", (req, res) => {
  res.json({
    success: true,
    count: orders.length,
    data: orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  });
});

// GET /api/orders/:id — single order
router.get("/:id", (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  res.json({ success: true, data: order });
});

module.exports = router;
