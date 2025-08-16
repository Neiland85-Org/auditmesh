const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'ms-gateway',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'AuditMesh Gateway',
    version: '1.0.0',
    description: 'API Gateway and routing layer'
  });
});

app.listen(port, () => {
  console.log(`🚀 Gateway service running on port ${port}`);
});
