const express = require("express");
const pool = require("./db/database");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Home endpoint
app.get("/", (req, res) => {
  res.json({
    service: "ShipForge Order Service",
    status: "running",
    version: "1.0.0"
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy"
  });
});

// Get all orders
app.get("/orders", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM orders ORDER BY id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching orders:", error);

    res.status(500).json({
      error: "Failed to fetch orders"
    });
  }
});

// Create an order
app.post("/orders", async (req, res) => {
  const { product_name, quantity, customer_name } = req.body;

  if (!product_name || !quantity || !customer_name) {
    return res.status(400).json({
      error: "product_name, quantity and customer_name are required"
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO orders (product_name, quantity, customer_name)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [product_name, quantity, customer_name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating order:", error);

    res.status(500).json({
      error: "Failed to create order"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`ShipForge Order Service running on port ${PORT}`);
});