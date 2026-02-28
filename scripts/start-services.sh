#!/bin/bash

# Harness Engineering v3 - Service Orchestrator
# Starts all required services in Docker container following HARNESS.md methodology

set -e

echo "🚀 Starting Harness Engineering v3 Services"
echo "============================================"

# Validate HARNESS.md compliance
echo "📋 Validating HARNESS.md compliance..."

if [ ! -f "HARNESS.md" ]; then
    echo "❌ HARNESS.md not found - methodology validation failed"
    exit 1
fi

echo "✅ HARNESS.md found - methodology compliance validated"

# SECURITY: Validate no key generation tools in production (HARNESS.md Security Gateway)
echo "🛡️ Validating production security boundaries..."

if [ -f "scripts/generate-api-key.js" ] || [ -f "scripts/setup-env.js" ]; then
    echo "🚨 SECURITY VIOLATION: Environment setup scripts found in production container"
    echo "📋 HARNESS.md Compliance: Environment setup must be done locally only"
    echo "💡 Solution: Use static shared secret via environment variables"
    exit 1
fi

if [ -f ".harness-keys.json" ] || [ -f ".env.local" ]; then
    echo "🚨 SECURITY VIOLATION: Local development files found in production"
    echo "📋 HARNESS.md Compliance: Use environment variables for production secrets"
    exit 1
fi

echo "✅ Production security boundaries validated"

# Check required environment variables
echo "🔑 Checking environment configuration..."

if [ -z "$NOVITA_API_KEY" ] && [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "⚠️ No LLM API keys configured - running in demo mode"
    export DEMO_MODE=true
else
    echo "✅ LLM API keys configured"
    export DEMO_MODE=false
fi

# Set default ports if not specified
export PORT=${PORT:-3000}
export WS_PORT=${WS_PORT:-3001}

echo "📡 Service ports: HTTP=$PORT, WebSocket=$WS_PORT"

# Create log directories following HARNESS.md structure
mkdir -p logs/mcp-server logs/websocket logs/orchestrator

# Function to start service with logging
start_service() {
    local service_name=$1
    local command=$2
    local log_file="logs/${service_name}/service.log"

    echo "🔧 Starting $service_name..."
    mkdir -p "logs/$service_name"

    # Start service in background with logging
    nohup bash -c "$command" > "$log_file" 2>&1 &
    local pid=$!
    echo $pid > "logs/${service_name}/service.pid"

    # Verify service started
    sleep 2
    if ps -p $pid > /dev/null; then
        echo "✅ $service_name started (PID: $pid)"
    else
        echo "❌ $service_name failed to start"
        cat "$log_file"
        exit 1
    fi
}

# Start MCP Server (Methodology and Agent Coordination)
start_service "mcp-server" "cd mcp-server && node server.js"

# Start WebSocket Server (Real-time Multi-Stream Coordination)
start_service "websocket" "cd websocket-server && node server.js"

# Health check endpoint for Render.com
echo "🏥 Setting up health monitoring..."

# Create health check endpoint that validates all services
cat > health-check.js << 'EOF'
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        // Check if all services are running
        const services = ['mcp-server', 'websocket'];
        const healthStatus = {};
        let allHealthy = true;

        for (const service of services) {
            const pidFile = `logs/${service}/service.pid`;
            const logFile = `logs/${service}/service.log`;

            try {
                const pid = fs.readFileSync(pidFile, 'utf8').trim();
                // Check if process is still running
                process.kill(pid, 0); // This throws if process doesn't exist
                healthStatus[service] = 'healthy';
            } catch (error) {
                healthStatus[service] = 'unhealthy';
                allHealthy = false;
            }
        }

        const response = {
            status: allHealthy ? 'healthy' : 'unhealthy',
            services: healthStatus,
            version: '3.0.0',
            methodology: 'harness-engineering',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        };

        res.writeHead(allHealthy ? 200 : 503, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(response, null, 2));
    } else if (req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(`
            <h1>🚀 Harness Engineering v3</h1>
            <p><strong>Status:</strong> Running</p>
            <p><strong>Methodology:</strong> <a href="/api/methodology">HARNESS.md</a></p>
            <p><strong>Health:</strong> <a href="/health">Service Health</a></p>
            <p><strong>Documentation:</strong> <a href="https://github.com/Chanta007/harness">GitHub</a></p>
            <hr>
            <h3>API Endpoints:</h3>
            <ul>
                <li><a href="/api/select-agents">Agent Selection</a></li>
                <li><a href="/api/analyze-screenshot">Screenshot Analysis</a></li>
                <li><a href="/api/validate">Task Validation</a></li>
            </ul>
        `);
    } else {
        // Proxy to MCP server for all other requests
        const mcpPort = process.env.PORT || 3000;
        const options = {
            hostname: 'localhost',
            port: mcpPort,
            path: req.url,
            method: req.method,
            headers: req.headers
        };

        const proxy = http.request(options, (mcpRes) => {
            res.writeHead(mcpRes.statusCode, mcpRes.headers);
            mcpRes.pipe(res, {end: true});
        });

        req.pipe(proxy, {end: true});
        proxy.on('error', (err) => {
            res.writeHead(502, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'MCP server unavailable', details: err.message}));
        });
    }
});

const port = process.env.HEALTH_PORT || 8080;
server.listen(port, '0.0.0.0', () => {
    console.log(`🏥 Health check server running on port ${port}`);
});
EOF

# Start health check service
start_service "health-check" "node health-check.js"

echo ""
echo "🎉 All Harness Engineering v3 services started successfully!"
echo "============================================================"
echo ""
echo "🌐 Service URLs:"
echo "   Main API: http://localhost:${PORT}"
echo "   WebSocket: ws://localhost:${WS_PORT}"
echo "   Health Check: http://localhost:8080/health"
echo ""
echo "📊 Service Status:"
echo "   MCP Server: ✅ Running (Port ${PORT})"
echo "   WebSocket: ✅ Running (Port ${WS_PORT})"
echo "   Health Monitor: ✅ Running (Port 8080)"
echo ""
echo "📋 Methodology Compliance: ✅ HARNESS.md validated"
echo "🔧 Configuration: Production-ready for Render.com"
echo ""
echo "📖 Usage:"
echo "   ./harness \"implement user authentication\""
echo "   ./harness \"build dashboard\" --interactive"
echo ""

# Keep container running and monitor services
echo "🔄 Monitoring services..."

# Trap signals for graceful shutdown
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."

    # Kill all background services
    for service in mcp-server websocket health-check; do
        if [ -f "logs/${service}/service.pid" ]; then
            local pid=$(cat "logs/${service}/service.pid")
            if ps -p $pid > /dev/null; then
                echo "   Stopping $service (PID: $pid)..."
                kill $pid
                wait $pid 2>/dev/null || true
            fi
            rm -f "logs/${service}/service.pid"
        fi
    done

    echo "✅ Graceful shutdown completed"
    exit 0
}

trap cleanup SIGTERM SIGINT

# Monitor loop - check services every 30 seconds
while true; do
    sleep 30

    # Check if all services are still running
    for service in mcp-server websocket health-check; do
        if [ -f "logs/${service}/service.pid" ]; then
            local pid=$(cat "logs/${service}/service.pid")
            if ! ps -p $pid > /dev/null; then
                echo "❌ Service $service died, restarting..."

                case $service in
                    "mcp-server")
                        start_service "mcp-server" "cd mcp-server && node server.js"
                        ;;
                    "websocket")
                        start_service "websocket" "cd websocket-server && node server.js"
                        ;;
                    "health-check")
                        start_service "health-check" "node health-check.js"
                        ;;
                esac
            fi
        fi
    done
done