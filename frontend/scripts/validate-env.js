#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * Validates that all required environment variables are set
 */

import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Required environment variables
const requiredVars = [
  'VITE_API_BASE_URL',
  'VITE_GATEWAY_URL',
  'VITE_DETECTOR_URL',
  'VITE_AUDITOR_URL',
  'VITE_REDPANDA_CONSOLE_URL',
  'VITE_JAEGER_URL',
  'VITE_MINIO_URL'
]

// Optional environment variables with defaults
const optionalVars = {
  'VITE_DEV_MODE': 'true',
  'VITE_ENABLE_MOCK_DATA': 'false',
  'VITE_LOG_LEVEL': 'info',
  'VITE_ENABLE_REAL_TIME_METRICS': 'true',
  'VITE_ENABLE_EVENT_PUBLISHER': 'true',
  'VITE_ENABLE_SERVICE_MONITORING': 'true',
  'VITE_APP_TITLE': 'AuditMesh Console',
  'VITE_APP_VERSION': '0.1.0'
}

function validateEnvironment() {
  console.log('🔍 Validating environment variables...\n')
  
  let hasErrors = false
  const missingVars = []
  const invalidVars = []
  
  // Check required variables
  requiredVars.forEach(varName => {
    const value = process.env[varName]
    if (!value) {
      missingVars.push(varName)
      hasErrors = true
    } else {
      console.log(`✅ ${varName}: ${value}`)
    }
  })
  
  // Check optional variables
  Object.entries(optionalVars).forEach(([varName, defaultValue]) => {
    const value = process.env[varName] || defaultValue
    console.log(`ℹ️  ${varName}: ${value} ${!process.env[varName] ? '(default)' : ''}`)
  })
  
  // Report results
  console.log('\n📊 Validation Results:')
  
  if (missingVars.length > 0) {
    console.log(`❌ Missing required variables: ${missingVars.join(', ')}`)
    console.log('\n💡 To fix this:')
    console.log('1. Copy .env.example to .env.local')
    console.log('2. Fill in the missing values')
    console.log('3. Restart your development server')
  }
  
  if (invalidVars.length > 0) {
    console.log(`⚠️  Invalid variables: ${invalidVars.join(', ')}`)
  }
  
  if (!hasErrors) {
    console.log('✅ All required environment variables are set!')
    console.log('🚀 Your AuditMesh Console is ready to run.')
  }
  
  return !hasErrors
}

function showHelp() {
  console.log(`
🔐 AuditMesh Console - Environment Validation

Usage:
  node scripts/validate-env.js    # Validate current environment
  node scripts/validate-env.js --help  # Show this help

Environment Files:
  .env.example     - Template (safe to commit)
  .env.local       - Local development (ignored by git)
  .env.production  - Production (ignored by git)
  .env.staging     - Staging (ignored by git)

Required Variables:
  ${requiredVars.join('\n  ')}

Optional Variables:
  ${Object.keys(optionalVars).join('\n  ')}

Examples:
  # Copy template and customize
  cp .env.example .env.local
  
  # Edit with your values
  nano .env.local
  
  # Validate
  node scripts/validate-env.js
`)
}

// Main execution
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  showHelp()
  process.exit(0)
}

// Run validation
const isValid = validateEnvironment()
process.exit(isValid ? 0 : 1)
