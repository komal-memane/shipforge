const { Pool } = require("pg");

const pool = new Pool({
  host: "shipforge-postgres",
  port: 5432,
  user: "shipforge",
  password: "shipforge_dev_password",
  database: "shipforge"
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL");
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL error:", error);
});

module.exports = pool;