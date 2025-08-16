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

// Audit endpoint
app.post('/audit', (req, res) => {
  try {
    const { eventId, analysis, originalEvent } = req.body;
    
    // Validate request
    if (!eventId || !analysis || !originalEvent) {
      return res.status(400).json({
        error: 'Invalid audit data',
        required: ['eventId', 'analysis', 'originalEvent']
      });
    }

    // Create comprehensive audit record
    const auditRecord = {
      auditId: `audit_${Date.now()}`,
      eventId: eventId,
      timestamp: new Date().toISOString(),
      originalEvent: originalEvent,
      analysis: analysis,
      auditTrail: {
        gatewayReceived: new Date().toISOString(),
        lieDetectorAnalyzed: analysis.analysis?.timestamp || new Date().toISOString(),
        auditorProcessed: new Date().toISOString()
      },
      compliance: {
        gdpr: true,
        sox: true,
        pci: originalEvent.type !== 'payment',
        hipaa: originalEvent.type !== 'medical'
      },
      riskAssessment: {
        overallRisk: analysis.riskLevel,
        riskScore: analysis.riskScore,
        requiresReview: analysis.riskLevel === 'HIGH',
        escalationLevel: analysis.riskLevel === 'HIGH' ? 'IMMEDIATE' : 'NORMAL'
      },
      recommendations: analysis.recommendations || [],
      metadata: {
        service: 'ms-auditor',
        version: '1.0.0',
        environment: originalEvent.metadata?.environment || 'unknown'
      }
    };

    // Simulate storing to audit database
    console.log(`📊 Audit record created: ${auditRecord.auditId}`);

    res.status(200).json({
      success: true,
      auditId: auditRecord.auditId,
      auditRecord: auditRecord,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error creating audit record:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`📊 Auditor service running on port ${port}`);
});
