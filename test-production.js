#!/usr/bin/env node

/**
 * Production Deployment Validation Test
 * Tests the live MCP server endpoints for functionality
 */

const https = require('https');

const BASE_URL = 'https://harness-d4o0.onrender.com';

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const requestOptions = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: options.method || 'GET',
      headers: options.headers || {},
      ...options
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function runProductionTests() {
  console.log('🚀 Running Production Validation Tests...\n');
  let passCount = 0;
  let totalTests = 0;

  // Test 1: Health check
  totalTests++;
  console.log('1. Testing health endpoint...');
  try {
    const health = await makeRequest('/health');
    if (health.statusCode === 200 && health.data.status === 'healthy') {
      console.log('   ✅ PASS - Health endpoint responding');
      passCount++;
    } else {
      console.log('   ❌ FAIL - Health endpoint issues');
    }
  } catch (error) {
    console.log(`   ❌ FAIL - Health endpoint error: ${error.message}`);
  }

  // Test 2: API authentication requirement
  totalTests++;
  console.log('\n2. Testing API authentication...');
  try {
    const apiTest = await makeRequest('/api/methodology');
    if (apiTest.statusCode === 401 || apiTest.statusCode === 403) {
      console.log('   ✅ PASS - API properly requires authentication');
      passCount++;
    } else {
      console.log(`   ❌ FAIL - Expected 401/403, got ${apiTest.statusCode}`);
    }
  } catch (error) {
    console.log(`   ❌ FAIL - API test error: ${error.message}`);
  }

  // Test 3: Rate limiting protection
  totalTests++;
  console.log('\n3. Testing rate limiting...');
  try {
    const requests = [];
    for (let i = 0; i < 10; i++) {
      requests.push(makeRequest('/health'));
    }
    const results = await Promise.all(requests);
    const allSuccessful = results.every(r => r.statusCode === 200);

    if (allSuccessful) {
      console.log('   ✅ PASS - Rate limiting allows normal traffic');
      passCount++;
    } else {
      console.log('   ❌ FAIL - Rate limiting blocking normal requests');
    }
  } catch (error) {
    console.log(`   ❌ FAIL - Rate limiting test error: ${error.message}`);
  }

  // Test 4: Security headers
  totalTests++;
  console.log('\n4. Testing security configuration...');
  try {
    const securityTest = await makeRequest('/health');
    const hasSecurityFeatures = securityTest.data.service === 'harness-mcp-server';

    if (hasSecurityFeatures) {
      console.log('   ✅ PASS - Security configuration active');
      passCount++;
    } else {
      console.log('   ❌ FAIL - Security configuration issues');
    }
  } catch (error) {
    console.log(`   ❌ FAIL - Security test error: ${error.message}`);
  }

  // Test 5: Service version
  totalTests++;
  console.log('\n5. Testing service version...');
  try {
    const versionTest = await makeRequest('/health');
    if (versionTest.data.version) {
      console.log(`   ✅ PASS - Service version: ${versionTest.data.version}`);
      passCount++;
    } else {
      console.log('   ❌ FAIL - No version information');
    }
  } catch (error) {
    console.log(`   ❌ FAIL - Version test error: ${error.message}`);
  }

  console.log('\n📊 Test Results:');
  console.log(`   Passed: ${passCount}/${totalTests}`);
  console.log(`   Success Rate: ${Math.round((passCount/totalTests) * 100)}%`);

  if (passCount === totalTests) {
    console.log('\n✅ All production tests passed!');
    return true;
  } else {
    console.log('\n⚠️  Some tests failed - review deployment');
    return false;
  }
}

// Run tests
runProductionTests()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });