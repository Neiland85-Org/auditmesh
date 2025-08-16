const express = require('express');
const http = require('http');
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

// Event publishing endpoint
app.post('/events', async (req, res) => {
  try {
    const event = req.body;
    
    // Validate event
    if (!event.eventId || !event.type) {
      return res.status(400).json({
        error: 'Invalid event data',
        required: ['eventId', 'type']
      });
    }

    // Forward to lie detector service
    const analysis = await new Promise((resolve, reject) => {
      const postData = JSON.stringify(event);
      const options = {
        hostname: 'ms-lie-detector',
        port: 3001,
        path: '/analyze',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const analysis = JSON.parse(data);
            resolve(analysis);
          } catch (e) {
            reject(new Error('Invalid response from lie detector'));
          }
        });
      });

      req.on('error', (e) => reject(e));
      req.write(postData);
      req.end();
    });

    // Forward to auditor service
    const auditResult = await new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        eventId: event.eventId,
        analysis: analysis,
        originalEvent: event
      });
      
      const options = {
        hostname: 'ms-auditor',
        port: 3002,
        path: '/audit',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            resolve(result);
          } catch (e) {
            reject(new Error('Invalid response from auditor'));
          }
        });
      });

      req.on('error', (e) => reject(e));
      req.write(postData);
      req.end();
    });

    res.status(200).json({
      success: true,
      eventId: event.eventId,
      analysis: analysis,
      audit: auditResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing event:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Gateway service running on port ${port}`);
});
