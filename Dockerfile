# Harness Engineering v3 - Multi-Service Docker Container
# Optimized for Render.com deployment

FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    bash \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application code (excluding setup scripts for production security)
COPY . .

# Remove setup scripts for production security (HARNESS.md compliance)
RUN rm -f scripts/setup-env.js .env.local .harness-keys.json

# Create necessary directories
RUN mkdir -p logs tmp uploads

# Make scripts executable
RUN chmod +x harness setup-harness.sh quick-setup.sh
RUN chmod +x deploy/*.js

# Set up environment
ENV NODE_ENV=production
ENV PORT=3000
ENV WS_PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:$PORT/health || exit 1

# Expose ports
EXPOSE 3000 3001

# Start script that runs all services
CMD ["./scripts/start-services.sh"]