#!/usr/bin/env node

/**
 * Simple Contact Form API Test
 * Tests basic functionality without hitting rate limits
 */

const http = require('http');
const { URL } = require('url');

const BASE_URL = 'http://localhost:3000';
const API_ENDPOINT = '/api/contact';

function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname + urlObj.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Boreas-API-Simple-Test/1.0',
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

async function testSingleValidSubmission() {
  console.log('🧪 Testing Single Valid Form Submission...\n');

  const testData = {
    name: "Carmen Rodriguez",
    email: `test-${Date.now()}@example.com`,
    whatsapp: "+521234567890",  // Correct format: no spaces, 15 chars max
    company: "Salon Carmen",
    business_type: "salon",
    city: "Mexico City",
    message: "Quiero automatizar mis citas de WhatsApp"
  };

  console.log('📤 Sending request with data:');
  console.log(JSON.stringify(testData, null, 2));

  try {
    const response = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, 'POST', testData);

    console.log('\n📥 Response received:');
    console.log('Status Code:', response.statusCode);
    console.log('Response Body:');
    console.log(JSON.stringify(response.body, null, 2));

    // Analyze response
    if (response.statusCode === 201) {
      console.log('\n✅ SUCCESS: Valid form submission accepted');

      if (response.body.success === true) {
        console.log('✅ Response indicates success');
      }

      if (response.body.data && response.body.data.id) {
        console.log(`✅ Lead ID created: ${response.body.data.id}`);
      }

      if (response.body.data && response.body.data.lead_score) {
        console.log(`✅ Lead score calculated: ${response.body.data.lead_score}`);

        // Salon should get 30 (business type) + 20 (form completion) = 50 points
        const expectedScore = 50;
        if (response.body.data.lead_score === expectedScore) {
          console.log(`✅ Lead score correct (expected: ${expectedScore})`);
        } else {
          console.log(`⚠️ Lead score unexpected (expected: ${expectedScore}, got: ${response.body.data.lead_score})`);
        }
      }

    } else if (response.statusCode === 429) {
      console.log('\n⚠️ RATE LIMIT: Too many requests, rate limiting is working');
      console.log('This is expected behavior if you ran tests recently');

    } else if (response.statusCode === 400) {
      console.log('\n❌ VALIDATION ERROR: Request was rejected');
      console.log('Check validation rules and fix data format');

    } else {
      console.log(`\n❌ UNEXPECTED: Got status code ${response.statusCode}`);
    }

  } catch (error) {
    console.log('\n❌ ERROR: Request failed');
    console.log('Error:', error.message);
  }
}

async function testValidationError() {
  console.log('\n🔍 Testing Validation Error...\n');

  const invalidData = {
    name: "", // Empty name should fail
    email: "invalid-email", // Invalid email format
    whatsapp: "123", // Too short
    business_type: "invalid", // Invalid enum value
    city: "123!" // Invalid characters
  };

  console.log('📤 Sending invalid data:');
  console.log(JSON.stringify(invalidData, null, 2));

  try {
    const response = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, 'POST', invalidData);

    console.log('\n📥 Response received:');
    console.log('Status Code:', response.statusCode);
    console.log('Response Body:');
    console.log(JSON.stringify(response.body, null, 2));

    if (response.statusCode === 400) {
      console.log('\n✅ SUCCESS: Validation correctly rejected invalid data');
    } else if (response.statusCode === 429) {
      console.log('\n⚠️ RATE LIMIT: Cannot test validation due to rate limiting');
    } else {
      console.log(`\n❌ UNEXPECTED: Expected 400, got ${response.statusCode}`);
    }

  } catch (error) {
    console.log('\n❌ ERROR: Request failed');
    console.log('Error:', error.message);
  }
}

async function main() {
  console.log('🚀 Boreas Contact API - Simple Test');
  console.log('=====================================\n');

  // Test basic valid submission
  await testSingleValidSubmission();

  // Wait a moment
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test validation
  await testValidationError();

  console.log('\n📋 Test Summary:');
  console.log('- If you see status 201 with success: true, the API is working correctly');
  console.log('- If you see status 429, rate limiting is active (try again in 15 minutes)');
  console.log('- If you see status 400 with validation errors, check the data format');
  console.log('- If you see status 500, there is a server error that needs fixing');
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
}