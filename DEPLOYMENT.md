# 🚀 Harness Engineering v3 Deployment Guide

Complete deployment strategy for render.com, novita.com, and GitHub infrastructure.

## 📦 Distribution Architecture

### **GitHub** - Primary Distribution Hub
```bash
# Repository structure
https://github.com/Chanta007/harness
├── @harness/orchestrator (NPM package)
├── GitHub Pages (documentation)
└── Template repository (project setup)
```

### **render.com** - MCP Server Infrastructure
```yaml
# Three deployed services:
1. harness-mcp-server     (Port 3000) - Methodology & agent coordination
2. harness-websocket      (Port 8080) - Real-time communication
3. harness-docs           (Static)    - Documentation hosting
```

### **novita.com** - LLM Model Infrastructure
```yaml
# Optimized model routing:
Primary: moonshot-ai/kimi-k2.5    (128K context, multimodal)
Fast:    anthropic/claude-3-haiku (200K context, structured)
Complex: openai/gpt-4-turbo       (128K context, reasoning)
```

## 🔧 Installation Methods

### **Method 1: NPM Global Install** (Recommended)
```bash
# Install globally via NPM
npm install -g @harness/orchestrator

# Verify installation
harness --version

# Setup project
harness-setup
```

### **Method 2: Direct GitHub Clone**
```bash
# Clone template repository
git clone https://github.com/Chanta007/harness.git
cd harness-engineering-v3

# Setup
chmod +x harness setup-harness.sh
./setup-harness.sh
```

### **Method 3: Project Template**
```bash
# Use GitHub template
gh repo create my-project --template Chanta007/harness
cd my-project
./setup-harness.sh
```

## ⚙️ Environment Configuration

### **Required Environment Variables**
```bash
# Core API Keys
export NOVITA_API_KEY="your-novita-api-key"
export ANTHROPIC_API_KEY="your-anthropic-key"  # Optional fallback

# MCP Server Endpoints (auto-configured)
export HARNESS_MCP_URL="https://harness-mcp-server.onrender.com"
export HARNESS_WS_URL="wss://harness-websocket.onrender.com"

# Optional customization
export HARNESS_MODEL="moonshot-ai/kimi-k2.5"
export HARNESS_MAX_STREAMS=3
export HARNESS_WORKSPACE_DIR=".harness-workspace"
```

### **Configuration File** (`.harnessrc`)
```json
{
  "mcpServer": "https://harness-mcp-server.onrender.com",
  "websocketUrl": "wss://harness-websocket.onrender.com",
  "defaultModel": "moonshot-ai/kimi-k2.5",
  "maxStreams": 3,
  "autoScreenshot": true,
  "validateMethodology": true,
  "workspaceDir": ".harness-workspace"
}
```

## 🌐 Service Endpoints

### **MCP Server** (render.com)
```
Base URL: https://harness-mcp-server.onrender.com

Endpoints:
GET  /health                    - Health check
GET  /api/methodology          - HARNESS.md content
GET  /api/agents               - Agent definitions
POST /api/validate             - Task validation
POST /api/select-agents        - LLM agent selection
POST /api/analyze-screenshot   - Screenshot analysis
```

### **WebSocket Server** (render.com)
```
URL: wss://harness-websocket.onrender.com

Channels:
- orchestrator/status          - Real-time progress
- stream/{id}/progress        - Multi-stream updates
- agent/{name}/communication  - Agent coordination
- conflict/detection          - File conflict alerts
```

### **Documentation** (GitHub Pages)
```
URL: https://chanta007.github.io/harness

Sections:
/                             - Quick start guide
/methodology                  - Complete HARNESS.md
/agents                       - Agent documentation
/examples                     - Usage examples
/api                          - MCP server API docs
```

## 🚀 Deployment Commands

### **Initial Deployment**
```bash
# 1. Deploy MCP server to render.com
npm run deploy:mcp

# 2. Deploy documentation to GitHub Pages
npm run deploy:docs

# 3. Publish NPM package
npm publish

# 4. Update template repository
git push origin main
```

### **Update Deployment**
```bash
# Update methodology
curl -X POST https://harness-mcp-server.onrender.com/api/reload

# Update NPM package
npm version patch
npm publish

# Update documentation
npm run deploy:docs
```

## 💰 Cost Optimization

### **Novita.com Pricing Strategy**
```yaml
Cost Structure:
- KIMI 2.5: $0.002/1K tokens (primary)
- Claude Haiku: $0.0025/1K tokens (fast)
- GPT-4 Turbo: $0.01/1K tokens (complex)

Monthly Budget (estimated):
- Light usage (10 tasks/day): $5-15
- Medium usage (50 tasks/day): $25-50
- Heavy usage (200 tasks/day): $100-200

Optimization:
- Caching: 40-60% cost reduction
- Model routing: 30-50% cost reduction
- Batch requests: 20-30% cost reduction
```

### **render.com Resources**
```yaml
Starter Plan ($7/month per service):
- harness-mcp-server: $7/month (0.1GB RAM, 0.1 CPU)
- harness-websocket: $7/month (0.1GB RAM, 0.1 CPU)
- harness-docs: Free (static site)

Total: $14/month + usage-based scaling
```

## 📊 Monitoring & Analytics

### **Health Monitoring**
```bash
# Service health checks
curl https://harness-mcp-server.onrender.com/health
curl https://harness-websocket.onrender.com/health

# Usage analytics
curl https://harness-mcp-server.onrender.com/api/stats
```

### **Performance Metrics**
- Response time: <200ms (MCP server)
- Uptime: >99.9% (render.com SLA)
- WebSocket latency: <50ms
- Model switching time: <100ms

## 🛠️ Maintenance

### **Weekly Tasks**
- Monitor API usage and costs
- Update agent definitions if needed
- Check service health and performance
- Review user feedback and bug reports

### **Monthly Tasks**
- Update model configurations
- Optimize routing based on usage patterns
- Update documentation
- Version bump and NPM publish

### **Quarterly Tasks**
- Evaluate new models on Novita.com
- Optimize infrastructure costs
- Major feature releases
- Community feedback integration

## 🔒 Security Considerations

### **API Security**
- Rate limiting: 1000 requests/hour per IP
- Authentication: API key validation
- Input validation: Sanitize all inputs
- CORS: Restricted to known domains

### **Data Privacy**
- No storage of user code or screenshots
- Ephemeral processing only
- Encrypted connections (HTTPS/WSS)
- GDPR compliant logging

## 📞 Support & Troubleshooting

### **Common Issues**
1. **Connection timeout**: Check internet connectivity and service health
2. **Model errors**: Verify Novita.com API key and quotas
3. **WebSocket disconnection**: Automatic reconnection implemented
4. **Methodology validation fails**: Update local cache with latest rules

### **Support Channels**
- GitHub Issues: Technical bugs and feature requests
- Documentation: https://chanta007.github.io/harness
- Discord Community: Real-time support and discussions
- GitHub Issues: https://github.com/Chanta007/harness/issues

---

## 🎯 Quick Start Summary

1. **Install**: `npm install -g @harness/orchestrator`
2. **Setup**: `harness-setup` (creates `.harnessrc`)
3. **Configure**: Add `NOVITA_API_KEY` to environment
4. **Use**: `harness "implement user authentication"`
5. **Enjoy**: ✨ Ultra-simple AI-powered development

**Cost**: ~$14/month infrastructure + $5-50/month AI usage
**Setup Time**: <5 minutes
**Learning Curve**: Zero - natural language interface