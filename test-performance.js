#!/usr/bin/env node

/**
 * Performance Validation Test for Harness MCP Server
 * Tests response times and load handling capabilities
 */

const https = require('https');

const BASE_URL = 'https://harness-d4o0.onrender.com';

function makeTimedRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
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
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        try {
          resolve({
            statusCode: res.statusCode,
            responseTime,
            headers: res.headers,
            data: JSON.parse(data),
            size: Buffer.byteLength(data, 'utf8')
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            responseTime,
            headers: res.headers,
            data: data,
            size: Buffer.byteLength(data, 'utf8')
          });
        }
      });
    });

    req.on('error', (error) => {
      const endTime = Date.now();
      reject({
        error: error.message,
        responseTime: endTime - startTime
      });
    });

    req.end();
  });
}

async function runPerformanceTests() {
  console.log('⚡ Running Performance Validation Tests...\n');

  const results = {
    healthEndpoint: [],
    coldStart: null,
    averageResponseTime: 0,
    maxResponseTime: 0,
    minResponseTime: Infinity,
    successRate: 0,
    throughput: 0
  };

  // Test 1: Cold start performance
  console.log('1. Testing cold start performance...');
  try {
    const coldStart = await makeTimedRequest('/health');
    results.coldStart = coldStart.responseTime;
    console.log(`   ✅ Cold start: ${coldStart.responseTime}ms (target: <3000ms)`);
  } catch (error) {
    console.log(`   ❌ Cold start failed: ${error.error}`);
  }

  // Test 2: Repeated requests for consistency
  console.log('\n2. Testing response time consistency (10 requests)...');
  const requests = [];
  for (let i = 0; i < 10; i++) {
    requests.push(makeTimedRequest('/health'));
  }

  try {
    const responses = await Promise.all(requests);
    results.healthEndpoint = responses;

    const responseTimes = responses.map(r => r.responseTime);
    results.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    results.maxResponseTime = Math.max(...responseTimes);
    results.minResponseTime = Math.min(...responseTimes);
    results.successRate = responses.filter(r => r.statusCode === 200).length / responses.length * 100;

    console.log(`   ✅ Average response time: ${Math.round(results.averageResponseTime)}ms`);
    console.log(`   ✅ Min/Max: ${results.minResponseTime}ms / ${results.maxResponseTime}ms`);
    console.log(`   ✅ Success rate: ${results.successRate}%`);
  } catch (error) {
    console.log(`   ❌ Consistency test failed: ${error.message}`);
  }

  // Test 3: Concurrent requests
  console.log('\n3. Testing concurrent load handling (5 parallel requests)...');
  const concurrentRequests = [];
  const startTime = Date.now();

  for (let i = 0; i < 5; i++) {
    concurrentRequests.push(makeTimedRequest('/health'));
  }

  try {
    const concurrentResponses = await Promise.all(concurrentRequests);
    const totalTime = Date.now() - startTime;
    const concurrentSuccess = concurrentResponses.filter(r => r.statusCode === 200).length;
    results.throughput = (concurrentResponses.length / totalTime) * 1000; // requests per second

    console.log(`   ✅ Concurrent requests: ${concurrentSuccess}/${concurrentResponses.length} successful`);
    console.log(`   ✅ Total time: ${totalTime}ms`);
    console.log(`   ✅ Throughput: ${results.throughput.toFixed(2)} req/sec`);
  } catch (error) {
    console.log(`   ❌ Concurrent test failed: ${error.message}`);
  }

  // Test 4: API endpoint response time (without auth for timing)
  console.log('\n4. Testing API endpoint response time...');
  try {
    const apiResponse = await makeTimedRequest('/api/methodology');
    console.log(`   ✅ API response time: ${apiResponse.responseTime}ms (expected 401/403)`);
    console.log(`   ✅ Status code: ${apiResponse.statusCode}`);
  } catch (error) {
    console.log(`   ❌ API test failed: ${error.error}`);
  }

  // Performance evaluation
  console.log('\n📊 Performance Analysis:');

  const performanceScore = {
    coldStart: results.coldStart <= 3000 ? 'EXCELLENT' : results.coldStart <= 5000 ? 'GOOD' : 'NEEDS_IMPROVEMENT',
    averageResponse: results.averageResponseTime <= 200 ? 'EXCELLENT' : results.averageResponseTime <= 500 ? 'GOOD' : 'NEEDS_IMPROVEMENT',
    consistency: (results.maxResponseTime - results.minResponseTime) <= 500 ? 'EXCELLENT' : 'GOOD',
    reliability: results.successRate >= 99 ? 'EXCELLENT' : results.successRate >= 95 ? 'GOOD' : 'NEEDS_IMPROVEMENT'
  };

  console.log(`   Cold Start Performance: ${performanceScore.coldStart} (${results.coldStart}ms)`);
  console.log(`   Average Response Time: ${performanceScore.averageResponse} (${Math.round(results.averageResponseTime)}ms)`);
  console.log(`   Response Consistency: ${performanceScore.consistency}`);
  console.log(`   Reliability: ${performanceScore.reliability} (${results.successRate}%)`);

  // HARNESS Engineering v3 Performance Requirements Check
  console.log('\n📋 HARNESS.md Performance Compliance:');

  const harnessCompliant = {
    apiResponseTime: results.averageResponseTime <= 200, // <200ms for API calls
    loadTime: results.coldStart <= 3000, // <3s load times
    reliability: results.successRate >= 99.9 // 99.9% uptime equivalent
  };

  console.log(`   API Response Time (<200ms): ${harnessCompliant.apiResponseTime ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Load Time (<3s): ${harnessCompliant.loadTime ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Reliability (≥99.9%): ${harnessCompliant.reliability ? '✅ PASS' : '❌ FAIL'}`);

  const overallCompliant = Object.values(harnessCompliant).every(v => v);
  console.log(`\n🎯 Overall HARNESS Performance Compliance: ${overallCompliant ? '✅ COMPLIANT' : '⚠️ NEEDS ATTENTION'}`);

  return {
    results,
    performanceScore,
    harnessCompliant,
    overallCompliant
  };
}

// Run performance tests
runPerformanceTests()
  .then(analysis => {
    console.log('\n⚡ Performance validation complete!');
    process.exit(analysis.overallCompliant ? 0 : 1);
  })
  .catch(error => {
    console.error('Performance test execution failed:', error);
    process.exit(1);
  });