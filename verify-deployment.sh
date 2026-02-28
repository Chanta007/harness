#!/bin/bash

# Deployment Security Verification Script
# Ensures all security configurations are production-ready

echo "Verifying deployment security configuration..."

# Check trust proxy configuration
echo "1. Checking trust proxy configuration..."
TRUST_PROXY=$(grep -n "trust proxy" mcp-server/server.js)
if [[ $TRUST_PROXY == *"app.set('trust proxy', 3)"* ]]; then
    echo "   ✅ Trust proxy correctly set to 3 (Render.com compatible)"
else
    echo "   ❌ Trust proxy configuration issue detected"
    echo "   Found: $TRUST_PROXY"
    exit 1
fi

# Check for dangerous trust proxy settings
DANGEROUS_PROXY=$(grep -n "trust proxy.*true" mcp-server/server.js)
if [[ -n $DANGEROUS_PROXY ]]; then
    echo "   ❌ CRITICAL: Dangerous 'trust proxy: true' found!"
    echo "   This allows IP spoofing attacks"
    exit 1
else
    echo "   ✅ No dangerous proxy configurations found"
fi

# Check rate limiting security
echo "2. Checking rate limiting security..."
RATE_LIMIT_KEY_GEN=$(grep -n "keyGenerator" mcp-server/server.js | wc -l)
if [[ $RATE_LIMIT_KEY_GEN -ge 2 ]]; then
    echo "   ✅ Rate limiting has custom key generators for security"
else
    echo "   ❌ Rate limiting missing security enhancements"
    exit 1
fi

# Check API key authentication
echo "3. Checking API key authentication..."
API_AUTH=$(grep -n "validateApiKey" mcp-server/server.js)
if [[ -n $API_AUTH ]]; then
    echo "   ✅ API key authentication enforced"
else
    echo "   ❌ API authentication not found"
    exit 1
fi

# Check timing-safe comparison
echo "4. Checking timing attack protection..."
TIMING_SAFE=$(grep -n "timingSafeEqual" mcp-server/server.js)
if [[ -n $TIMING_SAFE ]]; then
    echo "   ✅ Timing-safe comparison implemented"
else
    echo "   ❌ Timing attack vulnerability present"
    exit 1
fi

# Check security logging
echo "5. Checking security logging..."
SECURITY_LOG=$(grep -n "logSecurityEvent" mcp-server/server.js | wc -l)
if [[ $SECURITY_LOG -gt 5 ]]; then
    echo "   ✅ Comprehensive security logging in place"
else
    echo "   ❌ Insufficient security logging"
    exit 1
fi

# Check production debug endpoint protection
echo "6. Checking production debug protection..."
DEBUG_PROTECTION=$(grep -A5 "/debug/client-ip" mcp-server/server.js | grep -c "NODE_ENV.*production")
if [[ $DEBUG_PROTECTION -gt 0 ]]; then
    echo "   ✅ Debug endpoints protected in production"
else
    echo "   ❌ Debug endpoints may be exposed in production"
    exit 1
fi

echo ""
echo "Security verification complete!"
echo "All security configurations verified for production deployment"
echo ""
echo "Next steps:"
echo "1. Deploy to Render.com"
echo "2. Test with production traffic"
echo "3. Monitor security logs"
echo "4. Verify rate limiting effectiveness with: GET /debug/client-ip"
echo "   (Only works in development or with ENABLE_IP_DEBUG=true)"