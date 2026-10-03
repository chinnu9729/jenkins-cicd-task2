const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from Jenkins CI/CD Pipeline! 🚀');
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'jenkins-cicd-task2'
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
  });
}

module.exports = app;
