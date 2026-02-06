import { FullConfig } from '@playwright/test'
import fs from 'fs'
import path from 'path'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting Playwright global teardown...')

  try {
    // Generate test summary
    const resultsPath = path.join(process.cwd(), 'test-results', 'results.json')

    if (fs.existsSync(resultsPath)) {
      const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'))

      console.log('📊 Test Results Summary:')
      console.log(`   Total: ${results.stats?.total || 0}`)
      console.log(`   Passed: ${results.stats?.passed || 0}`)
      console.log(`   Failed: ${results.stats?.failed || 0}`)
      console.log(`   Skipped: ${results.stats?.skipped || 0}`)

      if (results.stats?.failed > 0) {
        console.log('❌ Some tests failed. Check the HTML report for details.')
        console.log('   Run: npx playwright show-report')
      }
    }

    // Clean up any test artifacts (optional)
    console.log('🧹 Cleaning up test artifacts...')

    // You could clean up screenshots, videos, etc. here if needed
    // For now, we keep them for debugging

    console.log('✅ Global teardown complete')

  } catch (error) {
    console.error('❌ Global teardown error:', error)
    // Don't throw error in teardown to avoid masking test failures
  }
}

export default globalTeardown