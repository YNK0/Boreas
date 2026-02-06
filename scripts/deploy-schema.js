#!/usr/bin/env node

/**
 * Supabase Schema Deployment Script
 *
 * This script helps deploy the database schema to a remote Supabase project
 * when Docker Desktop is not available for local development.
 *
 * Prerequisites:
 * 1. Supabase project created at supabase.com
 * 2. Environment variables set in .env file
 * 3. Supabase CLI available via npx
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

async function checkPrerequisites() {
    console.log('🔍 Checking prerequisites...\n');

    // Check if .env file exists and has required variables
    try {
        const envContent = await fs.readFile('.env', 'utf8');
        const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=https://');
        const hasAnonKey = !envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
        const hasServiceKey = !envContent.includes('SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key');

        if (!hasSupabaseUrl || !hasAnonKey || !hasServiceKey) {
            console.log('❌ Environment variables not properly configured');
            console.log('\nPlease update your .env file with actual Supabase credentials:');
            console.log('1. Create a project at https://supabase.com/dashboard');
            console.log('2. Copy Project URL, Anon Key, and Service Role Key');
            console.log('3. Update .env file with these values\n');
            return false;
        }
    } catch (error) {
        console.log('❌ .env file not found or not readable');
        return false;
    }

    // Check if migration files exist
    const migrationFiles = [
        'supabase/migrations/20240204000001_initial_schema.sql',
        'supabase/migrations/20240204000002_rls_policies.sql',
        'supabase/migrations/20240204000003_seed_data.sql'
    ];

    for (const file of migrationFiles) {
        try {
            await fs.access(file);
        } catch (error) {
            console.log(`❌ Migration file missing: ${file}`);
            return false;
        }
    }

    console.log('✅ All prerequisites met\n');
    return true;
}

async function deploySchema() {
    console.log('🚀 Deploying database schema...\n');

    try {
        // Method 1: Try using Supabase CLI (requires link setup)
        console.log('Attempting deployment via Supabase CLI...');
        execSync('npx supabase db push', { stdio: 'inherit' });
        console.log('✅ Schema deployed successfully via CLI\n');
        return true;
    } catch (error) {
        console.log('⚠️  CLI deployment failed. This is normal if project is not linked.\n');

        // Method 2: Provide manual instructions
        console.log('📋 Manual Deployment Instructions:\n');
        console.log('Since automatic deployment failed, please deploy manually:');
        console.log('\n1. Go to your Supabase project dashboard');
        console.log('2. Open the SQL Editor');
        console.log('3. Copy and execute each migration file in order:\n');

        const migrationFiles = [
            'supabase/migrations/20240204000001_initial_schema.sql',
            'supabase/migrations/20240204000002_rls_policies.sql',
            'supabase/migrations/20240204000003_seed_data.sql'
        ];

        for (const file of migrationFiles) {
            console.log(`   📄 ${file}`);
        }

        console.log('\n4. Execute the verification script:');
        console.log('   📄 scripts/verify-database.sql\n');

        return false;
    }
}

async function testConnection() {
    console.log('🔗 Testing database connection...\n');

    try {
        // Create a simple test script
        const testScript = `
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('count(*)', { count: 'exact', head: true });

    if (error) {
      console.log('❌ Connection test failed:', error.message);
      return false;
    }

    console.log('✅ Database connection successful');
    console.log(\`📊 Found \${data?.[0]?.count || 0} leads in database\`);
    return true;
  } catch (err) {
    console.log('❌ Connection test error:', err.message);
    return false;
  }
}

test();
`;

        await fs.writeFile('test-connection.js', testScript);
        execSync('node test-connection.js', { stdio: 'inherit' });
        await fs.unlink('test-connection.js');

        console.log('\n✅ Connection test completed\n');
        return true;
    } catch (error) {
        console.log('⚠️  Connection test failed. Check your environment variables.\n');
        return false;
    }
}

async function showNextSteps() {
    console.log('🎯 Next Steps:\n');
    console.log('1. ✅ Start your Next.js development server:');
    console.log('   npm run dev\n');
    console.log('2. 🧪 Test the contact form on http://localhost:3000');
    console.log('   This will verify lead creation works\n');
    console.log('3. 👤 Test user registration/login functionality\n');
    console.log('4. 📊 Access Supabase Studio to view your data:');
    console.log('   https://supabase.com/dashboard/project/your-project/editor\n');
    console.log('5. 📈 Monitor database performance and usage\n');
    console.log('For detailed verification, run the SQL script:');
    console.log('📄 scripts/verify-database.sql in your Supabase SQL Editor\n');
}

async function main() {
    console.log('🗄️  Boreas Database Deployment\n');
    console.log('==================================\n');

    const prerequisitesMet = await checkPrerequisites();
    if (!prerequisitesMet) {
        process.exit(1);
    }

    const deploymentSuccessful = await deploySchema();

    // Always test connection, even if auto-deployment failed
    await testConnection();

    await showNextSteps();

    if (!deploymentSuccessful) {
        console.log('⚠️  Automatic deployment was not completed.');
        console.log('Please follow the manual deployment instructions above.\n');
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { checkPrerequisites, deploySchema, testConnection };