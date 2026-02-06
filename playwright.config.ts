import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright Configuration for Boreas Landing Page E2E Tests
 * Focuses on critical user flows and performance testing
 */
export default defineConfig({
  // Test directory
  testDir: './tests/e2e',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Take screenshot on failure
    screenshot: 'only-on-failure',

    // Record video on failure
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Enable performance monitoring
        launchOptions: {
          args: ['--enable-precise-memory-info']
        }
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile Testing
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    // Performance Testing Project
    {
      name: 'performance',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--enable-precise-memory-info',
            '--disable-backgrounding-occluded-windows',
            '--disable-features=TranslateUI',
            '--disable-background-timer-throttling',
            '--disable-renderer-backgrounding'
          ]
        }
      },
      testMatch: '**/performance/**/*.test.ts',
    },
  ],

  // Global setup and teardown
  globalSetup: require.resolve('./tests/e2e/global-setup.ts'),
  globalTeardown: require.resolve('./tests/e2e/global-teardown.ts'),

  // Test match patterns
  testMatch: [
    '**/e2e/**/*.test.ts',
    '**/e2e/**/*.spec.ts'
  ],

  // Ignore these files
  testIgnore: [
    '**/node_modules/**',
    '**/.next/**',
    '**/coverage/**'
  ],

  // Timeout settings
  timeout: 30 * 1000, // 30 seconds per test
  expect: {
    timeout: 10 * 1000, // 10 seconds for assertions
  },

  // Web server configuration
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes for server to start
  },

  // Output directory for test results
  outputDir: 'test-results/',

  // Maximum number of failed tests to keep in output directory
  maxFailures: process.env.CI ? 5 : 100,
})