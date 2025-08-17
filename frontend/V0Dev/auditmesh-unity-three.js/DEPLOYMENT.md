# AuditMesh Deployment Guide

> Comprehensive deployment guide for AuditMesh platform

This guide covers deployment strategies, environment setup, and production considerations for the AuditMesh platform.

## 🎯 Deployment Overview

AuditMesh supports multiple deployment strategies:

1. **Docker Compose** - Recommended for single-server deployments
2. **Kubernetes** - For scalable, multi-server deployments
3. **Cloud Platforms** - AWS, GCP, Azure with managed services
4. **Hybrid** - Mix of containerized and managed services

## 🚀 Quick Production Deployment


### Prerequisites



- Docker and Docker Compose


- SSL certificates (for HTTPS)


- Domain name configured


- Minimum 2GB RAM, 2 CPU cores



### 1. Server Setup


\`\`\`bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create application directory
sudo mkdir -p /opt/auditmesh
cd /opt/auditmesh
\`\`\`


### 2. Application Deployment


\`\`\`bash
# Clone repository
git clone <repository-url> .

# Set up production environment
./scripts/setup-env.sh
# Select "production" when prompted

# Configure SSL (if using custom certificates)
sudo mkdir -p /etc/ssl/auditmesh
sudo cp your-certificate.crt /etc/ssl/auditmesh/
sudo cp your-private-key.key /etc/ssl/auditmesh/

# Build and start services
make build
make up

# Verify deployment
make health
\`\`\`

## 🔧 Environment Configuration


### Production Environment Variables


\`\`\`bash
# Application
COMPOSE_PROJECT_NAME=auditmesh-prod
NODE_ENV=production

# Web Frontend
WEB_PORT=80
VITE_API_BASE=https://api.yourdomain.com
VITE_APP_NAME=AuditMesh
VITE_NODE_ENV=production

# Security
JWT_SECRET=your-super-secure-jwt-secret-here
POSTGRES_PASSWORD=your-secure-database-password
REDIS_PASSWORD=your-secure-redis-password

# Domain Configuration
CORS_ORIGIN=https://app.yourdomain.com
ALLOWED_HOSTS=yourdomain.com,app.yourdomain.com,api.yourdomain.com

# SSL
SSL_CERT_PATH=/etc/ssl/auditmesh/certificate.crt
SSL_KEY_PATH=/etc/ssl/auditmesh/private.key
\`\`\`


### Security Checklist



- [ ] Change all default passwords


- [ ] Generate secure JWT secret (32+ characters)


- [ ] Configure HTTPS with valid SSL certificates


- [ ] Set up proper CORS origins


- [ ] Enable secure cookies


- [ ] Configure rate limiting


- [ ] Set up firewall rules


- [ ] Enable database encryption


- [ ] Configure backup strategy


## 🌐 Reverse Proxy Setup


### Nginx Configuration


```nginx
# /etc/nginx/sites-available/auditmesh
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/ssl/auditmesh/certificate.crt;
    ssl_certificate_key /etc/ssl/auditmesh/private.key;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;

    # Frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
