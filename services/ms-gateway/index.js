const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Environment variables for service hostnames
const LIE_DETECTOR_HOST = process.env.LIE_DETECTOR_HOST || 'localhost';
const LIE_DETECTOR_PORT = process.env.LIE_DETECTOR_PORT || 3001;
const AUDITOR_HOST = process.env.AUDITOR_HOST || 'localhost';
const AUDITOR_PORT = process.env.AUDITOR_PORT || 3002;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "http://localhost:*", "ws://localhost:*"]
    }
  }
}));

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8080',
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(express.json({ limit: '10mb' }));

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
        error: 'Missing required fields',
        required: ['eventId', 'type']
      });
    }

    // Forward to Lie Detector for analysis
    const analysis = await new Promise((resolve, reject) => {
      const postData = JSON.stringify(event);
      const options = {
        hostname: LIE_DETECTOR_HOST,
        port: LIE_DETECTOR_PORT,
        path: '/analyze',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            resolve(result);
          } catch (error) {
            reject(new Error('Invalid JSON response from Lie Detector'));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });

    // Forward to Auditor for audit record
    const auditRecord = await new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        eventId: event.eventId,
        analysis: analysis,
        originalEvent: event
      });

      const options = {
        hostname: AUDITOR_HOST,
        port: AUDITOR_PORT,
        path: '/audit',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            resolve(result);
          } catch (error) {
            reject(new Error('Invalid JSON response from Auditor'));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });

    // Return combined response
    res.json({
      success: true,
      eventId: event.eventId,
      analysis: analysis,
      audit: auditRecord,
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

app.listen(PORT, () => {
  console.log(`🚀 Gateway service running on port ${PORT}`);
});
