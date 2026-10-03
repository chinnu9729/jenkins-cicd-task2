const test = require('node:test');
const assert = require('node:assert');
const app = require('./app');

test('Application should be defined', () => {
  assert.ok(app);
});

test('Health endpoint should exist', async () => {
  const server = app.listen(0);

  try {
    const port = server.address().port;

    const response = await fetch(`http://localhost:${port}/health`);
    const data = await response.json();

    assert.strictEqual(response.status, 200);
    assert.strictEqual(data.status, 'healthy');
    assert.strictEqual(data.service, 'jenkins-cicd-task2');
  } finally {
    server.close();
  }
});
