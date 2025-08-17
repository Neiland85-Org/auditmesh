#!/bin/bash

# ==============================================
# AuditMesh Environment Setup Script
# ==============================================

set -e

echo "🚀 Setting up AuditMesh environment..."

# Function to prompt for input with default value
prompt_with_default() {
    local prompt="$1"
    local default="$2"
    local result

    read -p "$prompt [$default]: " result
    echo "${result:-$default}"
}

# Function to generate random password
generate_password() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-25
}

# Detect environment
ENVIRONMENT=$(prompt_with_default "Environment (development/production)" "development")

# Copy appropriate template
if [ "$ENVIRONMENT" = "production" ]; then
    echo "📋 Setting up production environment..."
    cp .env.production .env
    
    echo "🔐 Generating secure passwords..."
    JWT_SECRET=$(generate_password)
    DB_PASSWORD=$(generate_password)
    REDIS_PASSWORD=$(generate_password)
    
    # Replace placeholders with generated values
    sed -i "s/CHANGE_THIS_TO_A_SECURE_RANDOM_STRING/$JWT_SECRET/g" .env
    sed -i "s/CHANGE_THIS_TO_A_SECURE_PASSWORD/$DB_PASSWORD/g" .env
    
    echo "⚠️  IMPORTANT: Review and update the following in .env:"
    echo "   - Domain names and URLs"
    echo "   - SSL certificate paths"
    echo "   - External service configurations"
    
elif [ "$ENVIRONMENT" = "development" ]; then
    echo "🛠️  Setting up development environment..."
    cp .env.development .env
    echo "✅ Development environment ready!"
else
    echo "📝 Setting up from template..."
    cp .env.example .env
    echo "✅ Please edit .env file with your configuration"
fi

# Make sure web/.env exists for Vite
if [ ! -f "web/.env" ]; then
    echo "📁 Creating web/.env for Vite..."
    grep "^VITE_" .env > web/.env || true
fi

echo ""
echo "✅ Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Review and update .env file"
echo "2. Run 'make build' to build services"
echo "3. Run 'make up' for production or 'make dev' for development"
echo ""
