const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();
const port = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000', // ms-gateway
    'http://localhost:5173', // frontend
    process.env.ALLOWED_ORIGINS?.split(',') || []
  ].filter(Boolean),
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
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

// Event analysis endpoint
app.post('/analyze', (req, res) => {
  try {
    const event = req.body;

    if (!event.eventId) {
      return res.status(400).json({
        error: 'Missing eventId'
      });
    }

    let riskScore = 0;
    const riskFactors = [];

    // Analyze IP address
    if (event.data && event.data.ipAddress) {
      if (event.data.ipAddress.startsWith('192.168.')) {
        riskFactors.push('Internal network IP');
        riskScore += 10;
      } else if (event.data.ipAddress === '0.0.0.0') {
        riskFactors.push('Invalid IP address');
        riskScore += 50;
      } else if (event.data.ipAddress === '127.0.0.1') {
        riskFactors.push('Localhost access');
        riskScore += 20;
      }
    }

    // Analyze user agent
    if (event.data && event.data.userAgent) {
      if (event.data.userAgent.includes('bot')) {
        riskFactors.push('Bot-like user agent');
        riskScore += 30;
      }
    }

    // Analyze timestamp for unusual patterns
    if (event.timestamp) {
      const eventTime = new Date(event.timestamp);
      const hour = eventTime.getHours();
      if (hour < 6 || hour > 22) {
        riskFactors.push('Unusual access time');
        riskScore += 15;
      }
    }

    // Determine risk level
    let riskLevel = 'LOW';
    if (riskScore >= 50) {
      riskLevel = 'HIGH';
    } else if (riskScore >= 25) {
      riskLevel = 'MEDIUM';
    }

    // Generate recommendations
    const recommendations = [];
    if (riskLevel === 'HIGH') {
      recommendations.push('Immediate investigation required');
      recommendations.push('Block access temporarily');
    } else if (riskLevel === 'MEDIUM') {
      recommendations.push('Monitor closely');
      recommendations.push('Review access patterns');
    } else {
      recommendations.push('Continue monitoring');
    }

    const analysis = {
      eventId: event.eventId,
      riskScore: riskScore,
      riskLevel: riskLevel,
      riskFactors: riskFactors,
      recommendations: recommendations,
      confidence: 0.85,
      timestamp: new Date().toISOString()
    };

    res.json(analysis);

  } catch (error) {
    console.error('Error analyzing event:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`🔍 Lie Detector service running on port ${port}`);
});
