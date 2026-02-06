#!/usr/bin/env node

/**
 * Contact API Test with Rate Limit Bypass
 * Uses different IPs to test functionality
 */

const http = require('http');
const { URL } = require('url');

const BASE_URL = 'http://localhost:3000';
const API_ENDPOINT = '/api/contact';

function makeRequest(url, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname + urlObj.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Boreas-API-Test/1.0',
        // Simulate different IPs to bypass rate limiting
        'x-forwarded-for': `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
        ...headers
      }
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = http.request(options, (res) => {
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

async function testValidSubmission() {
  console.log('✅ Testing Valid Form Submission...\n');

  const testData = {
    name: "Carmen Rodriguez",
    email: `test-valid-${Date.now()}@example.com`,
    whatsapp: "+521234567890",
    company: "Salon Carmen",
    business_type: "salon",
    city: "Mexico City",
    message: "Quiero automatizar mis citas de WhatsApp"
  };

  console.log('📤 Sending valid data...');

  try {
    const response = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, 'POST', testData);

    console.log('Status Code:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 201 && response.body.success) {
      console.log('✅ SUCCESS: Valid submission works!');
      return true;
    } else {
      console.log('❌ FAILED: Valid submission rejected');
      return false;
    }

  } catch (error) {
    console.log('❌ ERROR:', error.message);
    return false;
  }
}

async function testValidation() {
  console.log('\n🔍 Testing Form Validation...\n');

  const tests = [
    {
      name: "Empty Name",
      data: {
        name: "",
        email: "test@example.com",
        whatsapp: "+521234567890",
        business_type: "salon",
        city: "Mexico City"
      }
    },
    {
      name: "Invalid Email",
      data: {
        name: "Test User",
        email: "invalid-email",
        whatsapp: "+521234567890",
        business_type: "salon",
        city: "Mexico City"
      }
    },
    {
      name: "Invalid WhatsApp",
      data: {
        name: "Test User",
        email: "test2@example.com",
        whatsapp: "123",
        business_type: "salon",
        city: "Mexico City"
      }
    }
  ];

  let passed = 0;

  for (const test of tests) {
    console.log(`Testing: ${test.name}`);

    try {
      const response = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, 'POST', test.data);

      if (response.statusCode === 400 && response.body.error?.code === 'VALIDATION_ERROR') {
        console.log('✅ Correctly rejected');
        passed++;
      } else {
        console.log(`❌ Expected validation error, got status ${response.statusCode}`);
      }

    } catch (error) {
      console.log('❌ ERROR:', error.message);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\nValidation Tests: ${passed}/${tests.length} passed`);
  return passed === tests.length;
}

async function testDuplicateEmail() {
  console.log('\n🔄 Testing Duplicate Email Handling...\n');

  const email = `duplicate-test-${Date.now()}@example.com`;
  const testData = {
    name: "Test User",
    email: email,
    whatsapp: "+521234567890",
    company: "Test Company",
    business_type: "restaurant",
    city: "Mexico City"
  };

  try {
    // First submission
    console.log('📤 First submission...');
    const first = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, 'POST', testData);

    if (first.statusCode === 201) {
      console.log('✅ First submission successful');

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Second submission with same email
      console.log('📤 Second submission (same email)...');
      const second = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, 'POST', testData);

      if (second.statusCode === 409 && second.body.error?.code === 'DUPLICATE_LEAD') {
        console.log('✅ SUCCESS: Duplicate correctly detected!');
        return true;
      } else {
        console.log(`❌ Expected 409 duplicate error, got ${second.statusCode}`);
        console.log('Response:', JSON.stringify(second.body, null, 2));
        return false;
      }

    } else {
      console.log('❌ First submission failed, cannot test duplicates');
      return false;
    }

  } catch (error) {
    console.log('❌ ERROR:', error.message);
    return false;
  }
}

async function testLeadScoring() {
  console.log('\n📊 Testing Lead Scoring...\n');

  const businessTypes = [
    { type: 'salon', expected: 50 },      // 30 + 20
    { type: 'restaurant', expected: 45 }, // 25 + 20
    { type: 'clinic', expected: 40 },     // 20 + 20
    { type: 'retail', expected: 30 },     // 10 + 20
  ];

  let passed = 0;

  for (const test of businessTypes) {
    const testData = {
      name: "Test User",
      email: `scoring-${test.type}-${Date.now()}@example.com`,
      whatsapp: "+521234567890",
      business_type: test.type,
      city: "Mexico City"
    };

    try {
      const response = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, 'POST', testData);

      if (response.statusCode === 201 && response.body.data?.lead_score === test.expected) {
        console.log(`✅ ${test.type}: Score ${response.body.data.lead_score} (expected ${test.expected})`);
        passed++;
      } else {
        console.log(`❌ ${test.type}: Expected score ${test.expected}, got ${response.body.data?.lead_score}`);
      }

    } catch (error) {
      console.log(`❌ ${test.type}: ERROR - ${error.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\nScoring Tests: ${passed}/${businessTypes.length} passed`);
  return passed === businessTypes.length;
}

async function main() {
  console.log('🚀 Boreas Contact API - Comprehensive Test');
  console.log('==========================================\n');

  const results = {
    validSubmission: false,
    validation: false,
    duplicates: false,
    scoring: false
  };

  results.validSubmission = await testValidSubmission();
  results.validation = await testValidation();
  results.duplicates = await testDuplicateEmail();
  results.scoring = await testLeadScoring();

  console.log('\n📊 Final Results:');
  console.log('================');
  console.log(`Valid Submission: ${results.validSubmission ? '✅' : '❌'}`);
  console.log(`Form Validation: ${results.validation ? '✅' : '❌'}`);
  console.log(`Duplicate Handling: ${results.duplicates ? '✅' : '❌'}`);
  console.log(`Lead Scoring: ${results.scoring ? '✅' : '❌'}`);

  const allPassed = Object.values(results).every(result => result);

  console.log('\n🎯 Summary:');
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED! Contact form API is working correctly.');
    console.log('✅ Ready for production deployment.');
  } else {
    console.log('⚠️ Some tests failed. Review the issues above.');
    console.log('🔧 Fix failing components before deployment.');
  }

  process.exit(allPassed ? 0 : 1);
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}