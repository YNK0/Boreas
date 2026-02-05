#!/usr/bin/env node

/**
 * PostHog Dashboard Setup Script for Boreas
 * Automatically creates dashboards and insights in PostHog
 */

const fs = require('fs');
const path = require('path');

// Import dashboard configurations
const { allDashboards, createDashboardConfig } = require('../src/lib/analytics/dashboard-config.ts');

const POSTHOG_API_BASE = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
const POSTHOG_API_KEY = process.env.POSTHOG_PROJECT_API_KEY;

if (!POSTHOG_API_KEY) {
  console.error('❌ Error: POSTHOG_PROJECT_API_KEY environment variable is required');
  console.log('Set it in your .env.local file or run:');
  console.log('export POSTHOG_PROJECT_API_KEY=your_api_key_here');
  process.exit(1);
}

/**
 * Create a dashboard in PostHog
 */
async function createDashboard(dashboardConfig) {
  try {
    console.log(`🚀 Creating dashboard: ${dashboardConfig.name}`);

    const response = await fetch(`${POSTHOG_API_BASE}/api/dashboard/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${POSTHOG_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: dashboardConfig.name,
        description: dashboardConfig.description,
        tags: dashboardConfig.tags,
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const dashboard = await response.json();
    console.log(`✅ Dashboard created with ID: ${dashboard.id}`);

    // Create insights for this dashboard
    await createInsightsForDashboard(dashboard.id, dashboardConfig.items);

    return dashboard;
  } catch (error) {
    console.error(`❌ Failed to create dashboard ${dashboardConfig.name}:`, error.message);
    return null;
  }
}

/**
 * Create insights for a dashboard
 */
async function createInsightsForDashboard(dashboardId, items) {
  for (const item of items) {
    try {
      console.log(`  📊 Creating insight: ${item.name}`);

      const insightData = {
        name: item.name,
        description: item.description || '',
        filters: item.query,
        dashboard: dashboardId,
        tags: item.tags || [],
      };

      const response = await fetch(`${POSTHOG_API_BASE}/api/insight/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${POSTHOG_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(insightData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const insight = await response.json();
      console.log(`    ✅ Insight created with ID: ${insight.id}`);

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`    ❌ Failed to create insight ${item.name}:`, error.message);
    }
  }
}

/**
 * Setup custom events in PostHog
 */
async function setupCustomEvents() {
  const customEvents = [
    {
      name: 'hero_cta_clicked',
      description: 'User clicked a CTA button in the hero section',
      properties: ['cta_type', 'cta_label', 'cta_position']
    },
    {
      name: 'contact_form_submitted',
      description: 'User submitted the contact form',
      properties: ['business_type', 'message_length', 'conversion_stage']
    },
    {
      name: 'business_type_selected',
      description: 'User selected their business type',
      properties: ['business_type']
    },
    {
      name: 'performance_metric',
      description: 'Performance metric recorded',
      properties: ['metric_name', 'value', 'rating', 'url']
    }
  ];

  console.log('📝 Setting up custom events...');

  for (const event of customEvents) {
    try {
      // Note: PostHog doesn't have a direct API to create event definitions
      // Events are automatically created when first tracked
      console.log(`  ✅ Event defined: ${event.name} - ${event.description}`);
    } catch (error) {
      console.error(`  ❌ Failed to define event ${event.name}:`, error.message);
    }
  }
}

/**
 * Generate PostHog dashboard URLs for easy access
 */
function generateDashboardReport(createdDashboards) {
  const report = `
# Boreas Analytics Dashboards

Created on: ${new Date().toISOString()}

## Dashboard Links

${createdDashboards.map(dashboard => `
### ${dashboard.name}
- **URL**: ${POSTHOG_API_BASE}/dashboard/${dashboard.id}
- **Description**: ${dashboard.description}
- **Items**: ${dashboard.items?.length || 0} insights
`).join('\n')}

## Quick Access

- **Main Business Dashboard**: ${POSTHOG_API_BASE}/dashboard/${createdDashboards[0]?.id || 'TBD'}
- **Technical Monitoring**: ${POSTHOG_API_BASE}/dashboard/${createdDashboards.find(d => d.name.includes('Technical'))?.id || 'TBD'}
- **Marketing Analytics**: ${POSTHOG_API_BASE}/dashboard/${createdDashboards.find(d => d.name.includes('Marketing'))?.id || 'TBD'}

## Next Steps

1. **Configure Alerts**: Set up alerts for key metrics in each dashboard
2. **Team Access**: Add team members to the PostHog project
3. **Data Validation**: Verify events are being tracked correctly
4. **Custom Properties**: Add any business-specific properties to tracking

## Support

- PostHog Documentation: https://posthog.com/docs
- Dashboard Configuration: src/lib/analytics/dashboard-config.ts
- Analytics Setup Guide: docs/analytics-setup.md
`;

  fs.writeFileSync('ANALYTICS_REPORT.md', report);
  console.log('\n📄 Analytics report saved to ANALYTICS_REPORT.md');
}

/**
 * Main setup function
 */
async function main() {
  console.log('🎯 Setting up Boreas Analytics Dashboards...\n');

  try {
    // Test API connection
    console.log('🔍 Testing PostHog API connection...');
    const testResponse = await fetch(`${POSTHOG_API_BASE}/api/user/`, {
      headers: {
        'Authorization': `Bearer ${POSTHOG_API_KEY}`,
      }
    });

    if (!testResponse.ok) {
      throw new Error(`API connection failed: ${testResponse.status}`);
    }

    console.log('✅ PostHog API connection successful\n');

    // Setup custom events
    await setupCustomEvents();
    console.log();

    // Create dashboards
    const createdDashboards = [];

    for (const dashboard of allDashboards) {
      const config = createDashboardConfig(dashboard);
      const created = await createDashboard(config);

      if (created) {
        createdDashboards.push({
          ...created,
          items: dashboard.items
        });
      }

      console.log(); // Add spacing between dashboards
    }

    // Generate report
    generateDashboardReport(createdDashboards);

    console.log('🎉 Analytics setup complete!');
    console.log(`✅ Created ${createdDashboards.length} dashboards`);
    console.log(`📊 Total insights: ${createdDashboards.reduce((sum, d) => sum + (d.items?.length || 0), 0)}`);
    console.log('\n🔗 Access your dashboards at:', `${POSTHOG_API_BASE}/dashboard/`);

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  main();
}

module.exports = {
  createDashboard,
  setupCustomEvents,
  main
};