const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'ms-lie-detector',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'AuditMesh Lie Detector',
    version: '1.0.0',
    description: 'AI-powered truth verification'
  });
});

app.listen(port, () => {
  console.log(`🔍 Lie Detector service running on port ${port}`);
});
