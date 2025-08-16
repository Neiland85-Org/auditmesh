const express = require('express');
const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'ms-auditor',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'AuditMesh Auditor',
    version: '1.0.0',
    description: 'Audit trail and compliance logging'
  });
});

app.listen(port, () => {
  console.log(`📊 Auditor service running on port ${port}`);
});
