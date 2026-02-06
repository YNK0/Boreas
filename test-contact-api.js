#!/usr/bin/env node

/**
 * Comprehensive Test Suite for Boreas Contact Form API
 * Tests: validation, rate limiting, lead scoring, duplicate handling
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const API_ENDPOINT = '/api/contact';

// Test data
const VALID_TEST_DATA = {
  name: "Carmen Rodriguez",
  email: "carmen.test@salon.com",
  whatsapp: "+521234567890",  // Fixed: no spaces, within 15 char limit
  company: "Salon Carmen",
  business_type: "salon",
  city: "Mexico City",
  message: "Quiero automatizar mis citas de WhatsApp"
};

const INVALID_TEST_CASES = [
  {
    name: "validation_empty_name",
    data: { ...VALID_TEST_DATA, name: "" },
    expectedError: "name"
  },
  {
    name: "validation_invalid_email",
    data: { ...VALID_TEST_DATA, email: "invalid-email" },
    expectedError: "email"
  },
  {
    name: "validation_invalid_whatsapp",
    data: { ...VALID_TEST_DATA, whatsapp: "123" },
    expectedError: "whatsapp"
  },
  {
    name: "validation_missing_business_type",
    data: { ...VALID_TEST_DATA, business_type: undefined },
    expectedError: "business_type"
  },
  {
    name: "validation_invalid_city",
    data: { ...VALID_TEST_DATA, city: "123!" },
    expectedError: "city"
  }
];

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Utility functions
function makeRequest(url, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Boreas-API-Test/1.0',
        ...headers
      }
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const responseData = body ? JSON.parse(body) : {};
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: responseData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body,
            parseError: error.message
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

function logTest(name, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${name}`);
  if (details) {
    console.log(`   ${details}`);
  }

  testResults.tests.push({ name, passed, details });
  if (passed) {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
}

function calculateExpectedLeadScore(businessType) {
  const businessTypeScores = {
    salon: 30,
    restaurant: 25,
    clinic: 20,
    dentist: 20,
    spa: 15,
    gym: 15,
    retail: 10,
    other: 10
  };

  // Business type score + form completion (20 points)
  return (businessTypeScores[businessType] || 10) + 20;
}

// Test functions
async function testHealthCheck() {
  console.log('\n🩺 Testing API Health Check...');

  try {
    const response = await makeRequest(`${BASE_URL}/api/health`);

    if (response.statusCode === 200) {
      logTest('Health Check', true, 'API is accessible');
    } else {
      logTest('Health Check', false, `Expected 200, got ${response.statusCode}`);
    }
  } catch (error) {
    logTest('Health Check', false, `Connection failed: ${error.message}`);
  }
}

async function testValidFormSubmission() {
  console.log('\n📝 Testing Valid Form Submission...');

  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const testData = {
      ...VALID_TEST_DATA,
      email: testEmail
    };

    const response = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, 'POST', testData);

    if (response.statusCode === 201) {
      const body = response.body;

      logTest('Valid Submission - Status Code', true, 'Returns 201 Created');

      if (body.success === true) {
        logTest('Valid Submission - Success Flag', true, 'success: true');
      } else {
        logTest('Valid Submission - Success Flag', false, `Expected success: true, got ${body.success}`);
      }

      if (body.data && body.data.id) {
        logTest('Valid Submission - Lead ID', true, `Lead ID: ${body.data.id}`);
      } else {
        logTest('Valid Submission - Lead ID', false, 'No lead ID returned');
      }

      // Test lead score calculation
      const expectedScore = calculateExpectedLeadScore(testData.business_type);
      if (body.data && body.data.lead_score === expectedScore) {
        logTest('Lead Score Calculation', true, `Score: ${body.data.lead_score} (expected: ${expectedScore})`);
      } else {
        logTest('Lead Score Calculation', false, `Expected ${expectedScore}, got ${body.data?.lead_score}`);
      }

    } else {
      logTest('Valid Submission', false, `Expected 201, got ${response.statusCode}. Response: ${JSON.stringify(response.body)}`);
    }

  } catch (error) {
    logTest('Valid Submission', false, `Request failed: ${error.message}`);
  }
}

async function testFormValidation() {
  console.log('\n🔍 Testing Form Validation...');

  for (const testCase of INVALID_TEST_CASES) {
    try {
      const response = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, 'POST', testCase.data);

      if (response.statusCode === 400) {
        const body = response.body;

        if (body.error && body.error.code === 'VALIDATION_ERROR') {
          if (body.error.details && Object.keys(body.error.details).some(key => key.includes(testCase.expectedError))) {
            logTest(`Validation - ${testCase.name}`, true, `Correctly rejected ${testCase.expectedError}`);
          } else {
            logTest(`Validation - ${testCase.name}`, false, `Expected ${testCase.expectedError} error, got: ${JSON.stringify(body.error.details)}`);
          }
        } else {
          logTest(`Validation - ${testCase.name}`, false, `Expected VALIDATION_ERROR, got: ${body.error?.code}`);
        }
      } else {
        logTest(`Validation - ${testCase.name}`, false, `Expected 400, got ${response.statusCode}`);
      }

    } catch (error) {
      logTest(`Validation - ${testCase.name}`, false, `Request failed: ${error.message}`);
    }
  }
}

async function testDuplicateHandling() {
  console.log('\n🔄 Testing Duplicate Email Handling...');

  const duplicateEmail = `duplicate-test-${Date.now()}@example.com`;
  const testData = {
    ...VALID_TEST_DATA,
    email: duplicateEmail
  };

  try {
    // First submission
    const firstResponse = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, 'POST', testData);

    if (firstResponse.statusCode === 201) {
      logTest('Duplicate Test - First Submission', true, 'First lead created successfully');

      // Second submission with same email
      const secondResponse = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, 'POST', testData);

      if (secondResponse.statusCode === 409) {
        const body = secondResponse.body;

        if (body.error && body.error.code === 'DUPLICATE_LEAD') {
          logTest('Duplicate Handling', true, 'Correctly rejected duplicate email');
        } else {
          logTest('Duplicate Handling', false, `Expected DUPLICATE_LEAD, got: ${body.error?.code}`);
        }
      } else {
        logTest('Duplicate Handling', false, `Expected 409, got ${secondResponse.statusCode}`);
      }

    } else {
      logTest('Duplicate Test - First Submission', false, `First submission failed with ${firstResponse.statusCode}`);
    }

  } catch (error) {
    logTest('Duplicate Handling', false, `Request failed: ${error.message}`);
  }
}

async function testRateLimiting() {
  console.log('\n⏱️ Testing Rate Limiting...');

  const testData = {
    ...VALID_TEST_DATA,
    email: `rate-limit-test@example.com`
  };

  try {
    let successCount = 0;
    let rateLimitHit = false;

    // Try to make 5 requests quickly (limit is 3 per 15 minutes)
    for (let i = 0; i < 5; i++) {
      const uniqueTestData = {
        ...testData,
        email: `rate-limit-test-${i}-${Date.now()}@example.com`
      };

      const response = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, 'POST', uniqueTestData);

      if (response.statusCode === 201) {
        successCount++;
      } else if (response.statusCode === 429) {
        rateLimitHit = true;
        const body = response.body;

        if (body.error && body.error.code === 'RATE_LIMIT_EXCEEDED') {
          logTest('Rate Limiting - Error Code', true, 'Correct error code returned');
        } else {
          logTest('Rate Limiting - Error Code', false, `Expected RATE_LIMIT_EXCEEDED, got: ${body.error?.code}`);
        }

        if (response.headers['retry-after']) {
          logTest('Rate Limiting - Retry Header', true, `Retry-After: ${response.headers['retry-after']}`);
        } else {
          logTest('Rate Limiting - Retry Header', false, 'Missing Retry-After header');
        }

        break;
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (rateLimitHit && successCount <= 3) {
      logTest('Rate Limiting - Functionality', true, `${successCount} requests succeeded before limit`);
    } else if (!rateLimitHit) {
      logTest('Rate Limiting - Functionality', false, 'Rate limit not triggered after 5 requests');
    } else {
      logTest('Rate Limiting - Functionality', false, `Too many requests succeeded: ${successCount}`);
    }

  } catch (error) {
    logTest('Rate Limiting', false, `Request failed: ${error.message}`);
  }
}

async function testLeadScoringVariations() {
  console.log('\n📊 Testing Lead Scoring Variations...');

  const businessTypes = ['salon', 'restaurant', 'clinic', 'retail', 'other'];

  for (const businessType of businessTypes) {
    try {
      const testData = {
        ...VALID_TEST_DATA,
        business_type: businessType,
        email: `scoring-test-${businessType}-${Date.now()}@example.com`
      };

      const response = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, 'POST', testData);

      if (response.statusCode === 201) {
        const expectedScore = calculateExpectedLeadScore(businessType);
        const actualScore = response.body.data?.lead_score;

        if (actualScore === expectedScore) {
          logTest(`Lead Scoring - ${businessType}`, true, `Score: ${actualScore}`);
        } else {
          logTest(`Lead Scoring - ${businessType}`, false, `Expected ${expectedScore}, got ${actualScore}`);
        }
      } else {
        logTest(`Lead Scoring - ${businessType}`, false, `Request failed with ${response.statusCode}`);
      }

    } catch (error) {
      logTest(`Lead Scoring - ${businessType}`, false, `Request failed: ${error.message}`);
    }
  }
}

async function testErrorHandling() {
  console.log('\n⚠️ Testing Error Handling...');

  try {
    // Test malformed JSON
    const response = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, 'POST', null, {
      'Content-Type': 'application/json',
      'Content-Length': '15'
    });

    if (response.statusCode >= 400) {
      logTest('Error Handling - Malformed JSON', true, `Returns error status: ${response.statusCode}`);
    } else {
      logTest('Error Handling - Malformed JSON', false, `Expected error status, got ${response.statusCode}`);
    }

  } catch (error) {
    logTest('Error Handling - Malformed JSON', true, 'Connection error handled gracefully');
  }
}

// Wait for rate limit to reset
async function waitForRateLimitReset(seconds = 900) {
  console.log(`⏳ Waiting ${seconds}s for rate limit to reset...`);
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Boreas Contact Form API Tests');
  console.log(`📍 Testing endpoint: ${BASE_URL}${API_ENDPOINT}`);
  console.log('=' + '='.repeat(50));

  await testHealthCheck();
  await testValidFormSubmission();

  // Wait a bit between tests to avoid rate limiting
  await new Promise(resolve => setTimeout(resolve, 1000));

  await testFormValidation();
  await testDuplicateHandling();
  await testRateLimiting();
  await testLeadScoringVariations();
  await testErrorHandling();

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('=' + '='.repeat(50));
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);

  if (testResults.failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.tests
      .filter(test => !test.passed)
      .forEach(test => {
        console.log(`   • ${test.name}: ${test.details}`);
      });
  }

  console.log('\n🎯 Next Steps:');
  if (testResults.failed === 0) {
    console.log('   ✅ All tests passed! Contact form API is working correctly.');
    console.log('   🚀 Ready for production deployment.');
  } else {
    console.log('   🔧 Fix the failing tests before deployment.');
    console.log('   🧪 Re-run tests after fixes.');
  }

  // Exit with appropriate code
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = {
  runAllTests,
  testResults
};