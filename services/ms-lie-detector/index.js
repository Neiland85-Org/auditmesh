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

// Event analysis endpoint
app.post('/analyze', (req, res) => {
  try {
    const event = req.body;
    
    // Validate event
    if (!event.eventId || !event.type) {
      return res.status(400).json({
        error: 'Invalid event data',
        required: ['eventId', 'type']
      });
    }

    // Simulate AI-powered lie detection analysis
    const riskFactors = [];
    let riskScore = 0;
    let confidence = 0.85;

    // Analyze IP address
    if (event.data?.ipAddress) {
      if (event.data.ipAddress.startsWith('192.168.')) {
        riskFactors.push('Internal network IP');
        riskScore += 10;
      } else if (event.data.ipAddress.includes('0.0.0.0')) {
        riskFactors.push('Invalid IP address');
        riskScore += 50;
      }
    }

    // Analyze user agent
    if (event.data?.userAgent) {
      if (event.data.userAgent.includes('bot') || event.data.userAgent.includes('crawler')) {
        riskFactors.push('Bot-like user agent');
        riskScore += 30;
      }
    }

    // Analyze location vs IP
    if (event.data?.location && event.data?.ipAddress) {
      if (event.data.location.includes('ES') && event.data.ipAddress.startsWith('192.168.')) {
        riskFactors.push('Location mismatch with internal IP');
        riskScore += 20;
      }
    }

    // Analyze timestamp patterns
    if (event.timestamp) {
      const eventTime = new Date(event.timestamp);
      const now = new Date();
      const timeDiff = Math.abs(now - eventTime);
      
      if (timeDiff > 24 * 60 * 60 * 1000) { // More than 24 hours
        riskFactors.push('Event timestamp too old');
        riskScore += 20;
      }
    }

    // Determine risk level
    let riskLevel = 'LOW';
    if (riskScore >= 50) riskLevel = 'HIGH';
    else if (riskScore >= 25) riskLevel = 'MEDIUM';

    const analysis = {
      eventId: event.eventId,
      riskScore: riskScore,
      riskLevel: riskLevel,
      confidence: confidence,
      riskFactors: riskFactors,
      analysis: {
        timestamp: new Date().toISOString(),
        algorithm: 'AuditMesh AI v1.0',
        version: '1.0.0'
      },
      recommendations: riskScore > 25 ? [
        'Review event details',
        'Verify user identity',
        'Check for suspicious patterns'
      ] : [
        'Event appears normal',
        'Continue monitoring'
      ]
    };

    res.status(200).json(analysis);

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
