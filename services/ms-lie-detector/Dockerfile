FROM node:18-alpine

# OpenContainers labels for GitHub Container Registry linking
ARG GIT_REPOSITORY=""
LABEL org.opencontainers.image.source=${GIT_REPOSITORY}
LABEL org.opencontainers.image.licenses="Apache-2.0"
LABEL org.opencontainers.image.description="AuditMesh Lie Detector Service - AI-powered truth verification"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["npm", "start"]
