#!/usr/bin/env node
/**
 * Supabase Setup Script for Boreas MVP
 * Helps configure real Supabase credentials
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Boreas MVP - Supabase Setup\n');

const envPath = path.join(__dirname, '.env');
const envBackupPath = path.join(__dirname, '.env.backup');

function createBackup() {
  if (fs.existsSync(envPath)) {
    fs.copyFileSync(envPath, envBackupPath);
    console.log('✅ Backup created: .env.backup');
  }
}

function updateEnvFile(config) {
  const envContent = `# Supabase - Production Configuration
NEXT_PUBLIC_SUPABASE_URL=${config.url}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${config.anonKey}
SUPABASE_SERVICE_ROLE_KEY=${config.serviceKey}

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development

# Analytics Configuration - Enabled for development testing
NEXT_PUBLIC_POSTHOG_KEY=ph_development_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
POSTHOG_PROJECT_API_KEY=phx_development_key
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SESSION_RECORDING=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true

# External Services - TODO: Add when ready for production
RESEND_API_KEY=your_resend_api_key_here
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here

# Rate Limiting - Using memory for development
# UPSTASH_REDIS_REST_URL=your_redis_url
# UPSTASH_REDIS_REST_TOKEN=your_redis_token
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file updated with new credentials');
}

function showInstructions() {
  console.log(`
🌟 NEXT STEPS:

1. Go to Supabase Dashboard:
   👉 https://app.supabase.com

2. Create New Project:
   - Project name: boreas-mvp
   - Database password: (create a strong password)
   - Region: (choose closest to you)

3. Get API Keys:
   - Go to Settings → API
   - Copy Project URL and anon key

4. Update this script with your credentials:
   - Edit line 27-29 in this file
   - Run: node setup-supabase.js

5. Restart development server:
   - npm run dev

📋 Current Issue:
Your .env file has placeholder Supabase credentials.
Authentication will NOT work until you replace them with real ones.

🔗 Quick Links:
- Supabase Dashboard: https://app.supabase.com
- Documentation: https://supabase.com/docs/guides/auth/auth-helpers/nextjs
`);
}

// Check if we have real credentials or placeholders
const currentEnv = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

if (currentEnv.includes('xyzcompany.supabase.co') || currentEnv.includes('your-project')) {
  console.log('❌ PLACEHOLDER CREDENTIALS DETECTED');
  console.log('The .env file contains fake Supabase credentials.\n');

  // Show instructions for getting real credentials
  showInstructions();

} else if (process.argv[2] === 'update') {
  // Manual update mode - user provides credentials
  console.log('📝 Manual credential update mode');
  console.log('Edit this file and add your Supabase credentials, then run again.');

  // Example configuration - user needs to fill this
  const config = {
    url: 'https://YOUR_PROJECT.supabase.co',
    anonKey: 'YOUR_ANON_KEY_HERE',
    serviceKey: 'YOUR_SERVICE_ROLE_KEY_HERE'
  };

  if (config.url.includes('YOUR_PROJECT')) {
    console.log('❌ Please edit this script with your real Supabase credentials first.');
  } else {
    createBackup();
    updateEnvFile(config);
    console.log('\n🎉 Credentials updated! Restart your dev server.');
  }

} else {
  console.log('✅ .env file exists but may need verification.');
  console.log('Run with "node setup-supabase.js update" to manually update credentials.');
}