// ─────────────────────────────────────────────
// FreshMart — Express Server
// ─────────────────────────────────────────────

const express = require("express");
const cors = require("cors");
const path = require("path");

const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ── API Routes ────────────────────────────────
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// ── SPA Fallback ──────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ── Start ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🥬  FreshMart Grocery is live!`);
  console.log(`  ➜  http://localhost:${PORT}\n`);
});
