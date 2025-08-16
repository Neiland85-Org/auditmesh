FROM node:18-alpine

# OpenContainers labels for GitHub Container Registry linking
ARG GIT_REPOSITORY=""
LABEL org.opencontainers.image.source=${GIT_REPOSITORY}
LABEL org.opencontainers.image.licenses="Apache-2.0"
LABEL org.opencontainers.image.description="AuditMesh Gateway Service - API Gateway and routing layer"

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"]
