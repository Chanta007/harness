#!/bin/bash

# Harness Engineering v3 - Quick Setup Script
# Complete installation and configuration in under 2 minutes

set -e

echo "🚀 Harness Engineering v3 - Quick Setup"
echo "======================================"
echo

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --silent

# Make scripts executable
echo "🔧 Setting up executables..."
chmod +x harness
chmod +x setup-harness.sh
chmod +x deploy/deploy-digitalocean.js

# Check for API keys
echo
echo "🔑 Checking API configuration..."

if [ -z "$NOVITA_API_KEY" ]; then
    echo "⚠️  NOVITA_API_KEY not set"
    echo "   Get your key from: https://dashboard.novita.ai"
    echo "   Export: export NOVITA_API_KEY=your_key_here"
    echo
fi

if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "💡 Optional: ANTHROPIC_API_KEY for enhanced Claude features"
    echo "   Get your key from: https://console.anthropic.com"
    echo "   Export: export ANTHROPIC_API_KEY=your_key_here"
    echo
fi

# Test basic functionality
echo "🧪 Testing basic functionality..."

if ./harness --version &> /dev/null; then
    echo "✅ Orchestrator executable working"
else
    echo "❌ Orchestrator test failed"
    exit 1
fi

# Setup complete
echo
echo "🎉 Setup Complete!"
echo "=================="
echo
echo "Quick Start:"
echo "  ./harness \"implement user authentication\""
echo "  ./harness \"fix performance issue\" --screenshot=\"error.png\""
echo "  ./harness \"build dashboard\" --interactive"
echo
echo "Multi-Stream Development:"
echo "  ./harness multi \\"
echo "    --stream1=\"add auth\" --branch1=\"feature/auth\" \\"
echo "    --stream2=\"fix bugs\" --branch2=\"bugfix/critical\""
echo
echo "Interactive Mode Commands:"
echo "  > modify     # Make real-time changes"
echo "  > status     # Check progress"
echo "  > pause      # Pause execution"
echo "  > screenshot \"error.png\"  # Add visual context"
echo
echo "Deployment:"
echo "  npm run deploy:do    # Deploy to Digital Ocean"
echo "  ./harness status     # Check system status"
echo
echo "Documentation:"
echo "  ./harness help       # Detailed usage examples"
echo "  cat HARNESS.md       # Core methodology"
echo "  cat README.md        # Feature overview"
echo
echo "🚀 Ready for natural language development!"

# Create .env template if it doesn't exist
if [ ! -f .env ]; then
    echo
    echo "📝 Creating .env template..."
    cat > .env << EOF
# Harness Engineering v3 Configuration
# Copy this to your actual .env file and add your API keys

# Required: Novita AI for LLM coordination
NOVITA_API_KEY=your_novita_api_key_here

# Optional: Anthropic Claude for enhanced features
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Custom MCP server URL
HARNESS_MCP_URL=https://your-mcp-server.app

# Optional: Custom WebSocket port
WS_PORT=8080
EOF
    echo "✅ .env template created"
fi

echo
echo "💡 Tip: Source your API keys or add them to .env for persistent configuration"