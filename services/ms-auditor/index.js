const express = require('express');
const { Pool } = require('pg');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

// Rate limiting configuration
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

// Apply rate limiting to all routes
app.use(limiter);

// Stricter rate limiting for database-intensive operations
const dbLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs for DB operations
  message: {
    error: 'Too many database requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://auditmesh:auditmesh123@172.18.0.2:5432/auditmesh',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Initialize database table if it doesn't exist
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_log (
        seq BIGSERIAL PRIMARY KEY,
        event_id TEXT NOT NULL UNIQUE,
        prev_hash TEXT NULL,
        hash TEXT NOT NULL,
        finding_json JSONB NOT NULL,
        occurred_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_audit_log_hash ON audit_log(hash);
    `);
    client.release();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// Get the last hash from the audit log
async function getLastHash() {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT hash FROM audit_log ORDER BY seq DESC LIMIT 1'
    );
    client.release();
    return result.rows.length > 0 ? result.rows[0].hash : null;
  } catch (error) {
    console.error('Error getting last hash:', error);
    return null;
  }
}

// Append finding to audit log with Merkle chain
async function appendFinding(eventId, findingJson) {
  try {
    const client = await pool.connect();

    // Get the previous hash
    const prevHash = await getLastHash();

    // Create the current hash
    const hashData = JSON.stringify({
      eventId,
      prevHash,
      finding: findingJson,
      timestamp: new Date().toISOString()
    });
    const hash = crypto.createHash('sha256').update(hashData).digest('hex');

    // Insert into audit log
    const result = await client.query(
      'INSERT INTO audit_log (event_id, prev_hash, hash, finding_json) VALUES ($1, $2, $3, $4) RETURNING seq, hash',
      [eventId, prevHash, hash, findingJson]
    );

    client.release();

    return {
      seq: result.rows[0].seq,
      hash: result.rows[0].hash,
      prevHash: prevHash
    };
  } catch (error) {
    console.error('Error appending finding:', error);
    throw error;
  }
}

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
    description: 'Audit trail and compliance logging with Merkle persistence'
  });
});

// Get Merkle root endpoint
app.get('/merkle/root', dbLimiter, async (req, res) => {
  try {
    const lastHash = await getLastHash();
    res.status(200).json({
      merkleRoot: lastHash,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting Merkle root:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get audit log endpoint
app.get('/audit/log', dbLimiter, async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT seq, event_id, prev_hash, hash, occurred_at FROM audit_log ORDER BY seq DESC LIMIT 100'
    );
    client.release();

    res.status(200).json({
      auditLog: result.rows,
      count: result.rows.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting audit log:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Audit endpoint
app.post('/audit', dbLimiter, async (req, res) => {
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

    // Store to Postgres with Merkle persistence
    const merkleResult = await appendFinding(eventId, auditRecord);

    console.log(`📊 Audit record created and persisted: ${auditRecord.auditId}`);
    console.log(`🔗 Merkle hash: ${merkleResult.hash}`);

    res.status(200).json({
      success: true,
      auditId: auditRecord.auditId,
      auditRecord: auditRecord,
      merkle: {
        seq: merkleResult.seq,
        hash: merkleResult.hash,
        prevHash: merkleResult.prevHash
      },
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

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`📊 Auditor service running on port ${port}`);
    console.log(`🔗 Merkle persistence enabled with Postgres`);
  });
}).catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});
