const express = require("express");
const pool = require("./db/database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Home endpoint
app.get("/", (req, res) => {
  res.json({
    service: "ShipForge Product Service",
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

// Get all products from PostgreSQL
app.get("/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      error: "Failed to fetch products"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`ShipForge Product Service running on port ${PORT}`);
});