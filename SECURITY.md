# 🛡️ HARNESS ENGINEERING v3 SECURITY GUIDE

> **CRITICAL**: Following HARNESS.md Security Gateway Pattern

## 🚨 Security Principles

### Core Security Boundaries

1. **Key Generation**: LOCAL DEVELOPMENT ONLY
2. **Production Deployment**: Environment variables only
3. **No Public Key Generation**: Never expose generation endpoints
4. **Container Security**: No local dev files in production containers

## 🔑 API Key Management

### Local Development (SAFE)

```bash
# Generate API key on your local machine
npm run keygen

# This creates:
# - .harness-keys.json (local key store)
# - .env.local (development environment)
```

### Production Deployment (SECURE)

```bash
# 1. Generate key locally first
npm run keygen production

# 2. Copy the generated key from output
# Output: harness_a1b2c3d4e5f6...

# 3. Set in Render.com dashboard
# Environment Variables → HARNESS_API_KEY → harness_a1b2c3d4e5f6...

# 4. Deploy securely
npm run deploy
```

## 🚫 Security Violations (NEVER DO)

### ❌ Production Key Generation
```bash
# NEVER run key generation on public servers
curl https://server.com/generate-key      # BLOCKED
ssh server.com "npm run keygen"           # BLOCKED
```

### ❌ Exposing Generation Tools
```bash
# Key generation scripts are excluded from Docker containers
# via .dockerignore and security checks
```

### ❌ Local Files in Production
```bash
# These files are automatically blocked in production:
.harness-keys.json  # Local key store
.env.local          # Local environment
.env               # Development environment
```

## 🛡️ Security Validation Layers

### Layer 1: Script-Level Protection
```javascript
// generate-api-key.js validates execution context
validateSecurityContext() {
  if (isProduction || hasRenderEnv || hasPublicPort) {
    console.error('🚨 SECURITY VIOLATION: Blocked in production');
    process.exit(1);
  }
}
```

### Layer 2: Docker Exclusions
```dockerfile
# .dockerignore prevents inclusion
scripts/generate-api-key.js  # Excluded
.harness-keys.json          # Excluded
.env.local                  # Excluded
```

### Layer 3: Container Startup Validation
```bash
# start-services.sh checks for violations
if [ -f "scripts/generate-api-key.js" ]; then
  echo "🚨 SECURITY VIOLATION: Key generation in production"
  exit 1
fi
```

### Layer 4: MCP Server Authentication
```javascript
// All /api/* endpoints require X-API-Key header
app.use('/api', validateApiKey);
```

## 📋 Secure Deployment Checklist

### Pre-Deployment
- [ ] Generate API key locally: `npm run keygen`
- [ ] Copy key from console output
- [ ] Set HARNESS_API_KEY in Render.com dashboard
- [ ] Verify .dockerignore excludes sensitive files

### Deployment Validation
- [ ] Deploy: `npm run deploy`
- [ ] Check deployment logs for security validation
- [ ] Test MCP authentication: `curl -H "X-API-Key: KEY" https://server/api/methodology`
- [ ] Verify key generation scripts not in container

### Post-Deployment
- [ ] Test orchestrator with API key: `./harness "test deployment"`
- [ ] Monitor authentication logs
- [ ] Rotate API keys periodically

## 🔧 Key Management Commands

```bash
# Generate new API key
npm run keygen [keyname]

# List all stored keys
npm run keys:list

# Get help
npm run keys:help

# Revoke a key (local development)
node scripts/generate-api-key.js --revoke keyname
```

## 🚨 Incident Response

### If API Key Compromised
1. Generate new key locally: `npm run keygen emergency`
2. Update Render.com environment variable immediately
3. Restart services: Render dashboard → Manual Deploy
4. Revoke old key: `npm run keys:list` and note for rotation

### If Generation Script Exposed
1. Immediately remove from public server
2. Generate new API keys for all services
3. Update all environment variables
4. Audit access logs for unauthorized usage

## 📊 Security Monitoring

### Key Usage Patterns
- API key should only appear in MCP server logs
- No key generation activity in production logs
- Failed authentication attempts logged

### Validation Checks
- Container startup security validation
- MCP endpoint authentication
- Environment variable presence

## 🎯 Security Compliance

Following **HARNESS.md Security Gateway Pattern**:
- ✅ API key authentication required
- ✅ Local-only key generation
- ✅ Environment variable deployment
- ✅ Production boundary enforcement
- ✅ Multi-layer security validation

---

**Remember**: Security is not optional. Following these guidelines protects the entire Harness Engineering ecosystem and ensures compliance with methodology requirements.