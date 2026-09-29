const express = require("express");
const pool = require("./db/database");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "ShipForge Order Service",
    status: "running",
    version: "1.0.0"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy"
  });
});

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

app.post("/orders", async (req, res) => {
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({
      error: "product_id and quantity are required"
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO orders (product_id, quantity)
       VALUES ($1, $2)
       RETURNING *`,
      [product_id, quantity]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating order:", error);

    res.status(500).json({
      error: "Failed to create order"
    });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`ShipForge Order Service running on port ${PORT}`);
  });
}

module.exports = app;
