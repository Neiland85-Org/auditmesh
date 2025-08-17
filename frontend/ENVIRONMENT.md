# Environment Variables & Secrets Configuration

## 🔐 Overview

This document describes all environment variables and secrets needed for the AuditMesh Console frontend application.

## 📁 Environment Files

### `.env.example` (Template)
- **Purpose**: Template file showing all required variables
- **Git Status**: ✅ Committed (safe to commit)
- **Usage**: Copy to create actual environment files

### `.env.local` (Development)
- **Purpose**: Local development overrides
- **Git Status**: ❌ Ignored (never committed)
- **Usage**: Local development settings

### `.env.production` (Production)
- **Purpose**: Production environment configuration
- **Git Status**: ❌ Ignored (never committed)
- **Usage**: Production deployment

### `.env.staging` (Staging)
- **Purpose**: Staging environment configuration
- **Git Status**: ❌ Ignored (never committed)
- **Usage**: Staging deployment

## 🌍 Environment Variables

### API Endpoints
```bash
# Base API URL for the application
VITE_API_BASE_URL=http://localhost:3000

# Individual microservice endpoints
VITE_GATEWAY_URL=http://localhost:3000
VITE_DETECTOR_URL=http://localhost:3001
VITE_AUDITOR_URL=http://localhost:3002
```

### External Services
```bash
# Redpanda Console for event streaming
VITE_REDPANDA_CONSOLE_URL=http://localhost:8080

# Jaeger for distributed tracing
VITE_JAEGER_URL=http://localhost:16686

# MinIO for object storage
VITE_MINIO_URL=http://localhost:9001
```

### Development Settings
```bash
# Enable/disable development mode
VITE_DEV_MODE=true

# Enable mock data for development
VITE_ENABLE_MOCK_DATA=false

# Logging level (debug, info, warn, error)
VITE_LOG_LEVEL=info
```

### Feature Flags
```bash
# Enable real-time metrics display
VITE_ENABLE_REAL_TIME_METRICS=true

# Enable event publishing functionality
VITE_ENABLE_EVENT_PUBLISHER=true

# Enable service monitoring dashboard
VITE_ENABLE_SERVICE_MONITORING=true
```

### Build Configuration
```bash
# Application title
VITE_APP_TITLE=AuditMesh Console

# Application version
VITE_APP_VERSION=0.1.0

# Application description
VITE_APP_DESCRIPTION=Modern Audit & Proof Management Console
```

## 🔒 Secrets & Sensitive Data

### What NOT to commit to Git:
- ❌ API keys
- ❌ Database credentials
- ❌ Private URLs
- ❌ Authentication tokens
- ❌ SSL certificates
- ❌ Analytics IDs
- ❌ CSP nonces

### What IS safe to commit:
- ✅ Default development URLs (localhost)
- ✅ Feature flags
- ✅ Build configuration
- ✅ Template files (.env.example)

## 🚀 Deployment Configuration

### Local Development
```bash
# Copy template and customize
cp .env.example .env.local

# Edit with local values
nano .env.local

# Start development server
npm run dev
```

### Staging Deployment
```bash
# Copy staging template
cp .env.staging.example .env.staging

# Configure with staging values
nano .env.staging

# Build for staging
npm run build:staging
```

### Production Deployment
```bash
# Copy production template
cp .env.production.example .env.production

# Configure with production values
nano .env.production

# Build for production
npm run build:production
```

## 🔧 CI/CD Integration

### GitHub Actions
```yaml
# Example workflow step
- name: Build Frontend
  env:
    VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
    VITE_GATEWAY_URL: ${{ secrets.GATEWAY_URL }}
    VITE_DETECTOR_URL: ${{ secrets.DETECTOR_URL }}
    VITE_AUDITOR_URL: ${{ secrets.AUDITOR_URL }}
  run: npm run build
```

### Docker Deployment
```dockerfile
# Copy environment file during build
COPY .env.production .env

# Or use build args
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
```

## 🛡️ Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use environment-specific files** (.env.local, .env.production)
3. **Rotate secrets regularly** in production
4. **Use secret management** in CI/CD pipelines
5. **Validate environment variables** at startup
6. **Log configuration errors** without exposing values

## 📝 Validation

The application validates environment variables at startup:

```typescript
// Example validation
const requiredVars = [
  'VITE_API_BASE_URL',
  'VITE_GATEWAY_URL',
  'VITE_DETECTOR_URL',
  'VITE_AUDITOR_URL'
]

requiredVars.forEach(varName => {
  if (!import.meta.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`)
  }
})
```

## 🔍 Troubleshooting

### Common Issues:
- **Build fails**: Check all required variables are set
- **API calls fail**: Verify endpoint URLs are correct
- **Features disabled**: Check feature flags are enabled
- **CORS errors**: Ensure backend allows frontend origin

### Debug Commands:
```bash
# Check environment variables
npm run env:check

# Validate configuration
npm run config:validate

# Show current environment
npm run env:show
```
