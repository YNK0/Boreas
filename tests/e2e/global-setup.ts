import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🎭 Starting Playwright global setup...')

  // Launch browser for setup
  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    // Wait for development server to be ready
    const baseURL = config.webServer?.url || 'http://localhost:3000'
    console.log(`⏳ Waiting for server at ${baseURL}...`)

    // Health check - try to load the homepage
    await page.goto(baseURL, { timeout: 60000 })
    await page.waitForLoadState('networkidle', { timeout: 30000 })

    // Verify critical elements are present
    await page.waitForSelector('h1', { timeout: 10000 })

    console.log('✅ Server is ready and homepage loads successfully')

    // Pre-warm critical routes
    console.log('🔥 Pre-warming critical routes...')

    // Scroll to trigger lazy loading of all sections
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })

    // Wait for lazy components to load
    await page.waitForTimeout(2000)

    console.log('✅ Pre-warming complete')

    // Clear any analytics or tracking that might interfere with tests
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()

      // Reset any analytics state
      if (window.posthog) {
        window.posthog.reset()
      }
    })

  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }

  console.log('✅ Global setup complete')
}

export default globalSetup