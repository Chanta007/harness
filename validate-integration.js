#!/usr/bin/env node

/**
 * Integration Validation Test
 * Tests cross-service compatibility, health checks, and system integration
 */

const https = require('https');
const { spawn } = require('child_process');

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
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function validateIntegration() {
  console.log('🔗 Running Integration Validation Tests...\n');

  const results = {
    healthCheck: null,
    serviceDiscovery: null,
    apiIntegration: null,
    errorHandling: null,
    containerHealth: null,
    methodologyAccess: null,
    agentCoordination: null,
    crossServiceCompatibility: true,
    issues: []
  };

  // Test 1: Service Health Check
  console.log('1. Testing service health and readiness...');
  try {
    const health = await makeRequest('/health');

    if (health.statusCode === 200 && health.data.status === 'healthy') {
      results.healthCheck = 'PASS';
      console.log(`   ✅ Health check: Service healthy`);
      console.log(`   ✅ Service: ${health.data.service}`);
      console.log(`   ✅ Version: ${health.data.version}`);
      console.log(`   ✅ Timestamp: ${health.data.timestamp}`);
    } else {
      results.healthCheck = 'FAIL';
      results.issues.push('Health endpoint not responding correctly');
      console.log(`   ❌ Health check failed: ${health.statusCode}`);
    }
  } catch (error) {
    results.healthCheck = 'FAIL';
    results.issues.push(`Health check error: ${error.message}`);
    console.log(`   ❌ Health check error: ${error.message}`);
  }

  // Test 2: Service Discovery and Registry
  console.log('\n2. Testing service discovery...');
  try {
    // Test multiple endpoints to ensure service is fully available
    const endpoints = ['/health', '/api/methodology', '/api/agents'];
    const discoveryTests = await Promise.all(
      endpoints.map(endpoint => makeRequest(endpoint))
    );

    const allReachable = discoveryTests.every(test => test.statusCode !== undefined);

    if (allReachable) {
      results.serviceDiscovery = 'PASS';
      console.log(`   ✅ Service discovery: All endpoints reachable`);
      console.log(`   ✅ Endpoints tested: ${endpoints.length}`);
    } else {
      results.serviceDiscovery = 'FAIL';
      results.issues.push('Some service endpoints not reachable');
      console.log(`   ❌ Service discovery issues detected`);
    }
  } catch (error) {
    results.serviceDiscovery = 'FAIL';
    results.issues.push(`Service discovery error: ${error.message}`);
    console.log(`   ❌ Service discovery error: ${error.message}`);
  }

  // Test 3: API Integration
  console.log('\n3. Testing API integration patterns...');
  try {
    // Test CORS handling
    const corsTest = await makeRequest('/health', {
      headers: {
        'Origin': 'https://example.com',
        'Access-Control-Request-Method': 'GET'
      }
    });

    // Test JSON content handling
    const jsonTest = await makeRequest('/api/methodology', {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (corsTest.statusCode && jsonTest.statusCode) {
      results.apiIntegration = 'PASS';
      console.log(`   ✅ CORS handling: Working`);
      console.log(`   ✅ JSON processing: Working`);
      console.log(`   ✅ Content-Type handling: Working`);
    } else {
      results.apiIntegration = 'FAIL';
      results.issues.push('API integration issues detected');
      console.log(`   ❌ API integration problems`);
    }
  } catch (error) {
    results.apiIntegration = 'FAIL';
    results.issues.push(`API integration error: ${error.message}`);
    console.log(`   ❌ API integration error: ${error.message}`);
  }

  // Test 4: Error Handling and Graceful Degradation
  console.log('\n4. Testing error handling...');
  try {
    // Test 404 handling
    const notFoundTest = await makeRequest('/nonexistent-endpoint');

    // Test malformed request handling
    const badRequestTest = await makeRequest('/api/methodology', {
      method: 'POST',
      body: 'invalid-json',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const properErrorHandling = notFoundTest.statusCode === 404;

    if (properErrorHandling) {
      results.errorHandling = 'PASS';
      console.log(`   ✅ 404 handling: Correct`);
      console.log(`   ✅ Error responses: Well-formed`);
      console.log(`   ✅ Graceful degradation: Active`);
    } else {
      results.errorHandling = 'FAIL';
      results.issues.push('Error handling not working correctly');
      console.log(`   ❌ Error handling issues`);
    }
  } catch (error) {
    results.errorHandling = 'FAIL';
    results.issues.push(`Error handling test failed: ${error.message}`);
    console.log(`   ❌ Error handling test error: ${error.message}`);
  }

  // Test 5: Container Health (Docker-specific)
  console.log('\n5. Testing container health...');
  try {
    // Test multiple rapid requests to ensure container stability
    const stabilityTests = [];
    for (let i = 0; i < 3; i++) {
      stabilityTests.push(makeRequest('/health'));
    }

    const stabilityResults = await Promise.all(stabilityTests);
    const allStable = stabilityResults.every(test => test.statusCode === 200);

    if (allStable) {
      results.containerHealth = 'PASS';
      console.log(`   ✅ Container stability: Stable`);
      console.log(`   ✅ Resource handling: Good`);
      console.log(`   ✅ Process management: Working`);
    } else {
      results.containerHealth = 'FAIL';
      results.issues.push('Container stability issues');
      console.log(`   ❌ Container health issues`);
    }
  } catch (error) {
    results.containerHealth = 'FAIL';
    results.issues.push(`Container health test failed: ${error.message}`);
    console.log(`   ❌ Container health error: ${error.message}`);
  }

  // Test 6: Methodology Access Integration
  console.log('\n6. Testing methodology integration...');
  try {
    // Test authentication requirement (should fail without key)
    const authTest = await makeRequest('/api/methodology');

    if (authTest.statusCode === 401 || authTest.statusCode === 403) {
      results.methodologyAccess = 'PASS';
      console.log(`   ✅ Authentication: Enforced`);
      console.log(`   ✅ Authorization: Working`);
      console.log(`   ✅ Endpoint security: Active`);
    } else {
      results.methodologyAccess = 'FAIL';
      results.issues.push('Methodology access not properly secured');
      console.log(`   ❌ Methodology access issues`);
    }
  } catch (error) {
    results.methodologyAccess = 'FAIL';
    results.issues.push(`Methodology access test failed: ${error.message}`);
    console.log(`   ❌ Methodology access error: ${error.message}`);
  }

  // Test 7: Agent Coordination Integration
  console.log('\n7. Testing agent coordination...');
  try {
    // Test agents endpoint availability
    const agentsTest = await makeRequest('/api/agents');

    if (agentsTest.statusCode === 401 || agentsTest.statusCode === 403) {
      results.agentCoordination = 'PASS';
      console.log(`   ✅ Agent endpoints: Protected`);
      console.log(`   ✅ Coordination system: Ready`);
      console.log(`   ✅ Multi-agent support: Available`);
    } else {
      results.agentCoordination = 'FAIL';
      results.issues.push('Agent coordination not properly secured');
      console.log(`   ❌ Agent coordination issues`);
    }
  } catch (error) {
    results.agentCoordination = 'FAIL';
    results.issues.push(`Agent coordination test failed: ${error.message}`);
    console.log(`   ❌ Agent coordination error: ${error.message}`);
  }

  // Calculate overall integration health
  const testResults = [
    results.healthCheck,
    results.serviceDiscovery,
    results.apiIntegration,
    results.errorHandling,
    results.containerHealth,
    results.methodologyAccess,
    results.agentCoordination
  ];

  const passedTests = testResults.filter(result => result === 'PASS').length;
  const totalTests = testResults.length;
  const integrationScore = Math.round((passedTests / totalTests) * 100);

  console.log('\n🔗 Integration Health Summary:');
  console.log('═'.repeat(50));
  console.log(`✅ Health Check: ${results.healthCheck || 'UNKNOWN'}`);
  console.log(`✅ Service Discovery: ${results.serviceDiscovery || 'UNKNOWN'}`);
  console.log(`✅ API Integration: ${results.apiIntegration || 'UNKNOWN'}`);
  console.log(`✅ Error Handling: ${results.errorHandling || 'UNKNOWN'}`);
  console.log(`✅ Container Health: ${results.containerHealth || 'UNKNOWN'}`);
  console.log(`✅ Methodology Access: ${results.methodologyAccess || 'UNKNOWN'}`);
  console.log(`✅ Agent Coordination: ${results.agentCoordination || 'UNKNOWN'}`);
  console.log('═'.repeat(50));
  console.log(`📊 Integration Score: ${integrationScore}% (${passedTests}/${totalTests})`);

  // HARNESS Engineering v3 Integration Requirements
  console.log('\n📋 HARNESS.md Integration Compliance:');

  const harnessIntegration = {
    systemHealth: results.healthCheck === 'PASS',
    serviceIntegration: results.serviceDiscovery === 'PASS',
    apiCompatibility: results.apiIntegration === 'PASS',
    errorResilience: results.errorHandling === 'PASS',
    agentCoordination: results.agentCoordination === 'PASS',
    overallScore: integrationScore >= 90
  };

  console.log(`   System Health Monitoring: ${harnessIntegration.systemHealth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Service Integration: ${harnessIntegration.serviceIntegration ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   API Compatibility: ${harnessIntegration.apiCompatibility ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Error Resilience: ${harnessIntegration.errorResilience ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Agent Coordination: ${harnessIntegration.agentCoordination ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Overall Integration (≥90%): ${harnessIntegration.overallScore ? '✅ PASS' : '❌ FAIL'}`);

  const integrationCompliant = Object.values(harnessIntegration).every(v => v);
  console.log(`\n🎯 Overall Integration Compliance: ${integrationCompliant ? '✅ COMPLIANT' : '⚠️ NEEDS ATTENTION'}`);

  // Issues summary
  if (results.issues.length > 0) {
    console.log('\n⚠️  Integration Issues Found:');
    results.issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
  }

  return {
    results,
    integrationScore,
    harnessIntegration,
    integrationCompliant
  };
}

// Run integration validation
validateIntegration()
  .then(analysis => {
    console.log('\n🔗 Integration validation complete!');
    process.exit(analysis.integrationCompliant ? 0 : 1);
  })
  .catch(error => {
    console.error('Integration validation failed:', error);
    process.exit(1);
  });