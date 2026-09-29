const test = require("node:test");
const assert = require("node:assert");

const app = require("../src/server");

test("GET /health returns healthy status", async () => {
  const server = app.listen(0);

  try {
    const port = server.address().port;

    const response = await fetch(`http://localhost:${port}/health`);
    const body = await response.json();

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(body, {
      status: "healthy"
    });
  } finally {
    server.close();
  }
});