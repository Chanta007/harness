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

# Copy application code first (needed for install scripts)
COPY . .

# Debug: List files to check what's available
RUN ls -la && echo "Checking for package-lock.json..." && ls -la package*.json

# Install Node.js dependencies (fallback to npm install if lockfile missing)
RUN if [ -f package-lock.json ]; then \
        echo "Using npm ci with existing lockfile..." && \
        npm ci --omit=dev --ignore-scripts && npm cache clean --force; \
    else \
        echo "No lockfile found, using npm install..." && \
        npm install --omit=dev --ignore-scripts && npm cache clean --force; \
    fi

# Make scripts executable
RUN chmod +x harness setup-harness.sh quick-setup.sh 2>/dev/null || true
RUN chmod +x deploy/*.js 2>/dev/null || true

# Remove setup scripts for production security (HARNESS.md compliance)
RUN rm -f scripts/setup-env.js .env.local .harness-keys.json

# Create necessary directories
RUN mkdir -p logs tmp uploads

# Set up environment
ENV NODE_ENV=production
ENV PORT=3000
ENV WS_PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:$PORT/health || exit 1

# Expose ports
EXPOSE 3000 3001

# Start the MCP server for production deployment
CMD ["node", "mcp-server/server.js"]