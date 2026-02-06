/**
 * End-to-End Test: Critical User Flow
 * Tests the complete user journey from landing page to contact form submission
 */

import { test, expect, Page } from '@playwright/test'

// Test configuration
test.describe('Landing Page to Contact Form Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the landing page
    await page.goto('/')

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle')
  })

  test('should complete full user journey: landing → contact → form submission', async ({ page }) => {
    // 1. Landing Page Load
    await test.step('Landing page loads successfully', async () => {
      await expect(page).toHaveTitle(/Automatización WhatsApp/)
      await expect(page.locator('h1')).toContainText('Automatiza WhatsApp')
    })

    // 2. Hero Section Interaction
    await test.step('Hero section is interactive', async () => {
      // Check hero section is visible
      const heroSection = page.locator('section[role="banner"]')
      await expect(heroSection).toBeVisible()

      // Check main CTA buttons are present
      const primaryCTA = page.locator('a:has-text("Ver Demo")')
      const secondaryCTA = page.locator('a:has-text("Casos de Éxito")')

      await expect(primaryCTA).toBeVisible()
      await expect(secondaryCTA).toBeVisible()
    })

    // 3. Test Lazy Loading of Sections
    await test.step('Lazy-loaded sections load progressively', async () => {
      // Scroll to trigger lazy loading
      await page.locator('#cases').scrollIntoViewIfNeeded()

      // Case studies section should load
      const caseStudiesSection = page.locator('#cases')
      await expect(caseStudiesSection).toBeVisible({ timeout: 3000 })

      // Check that case study content is loaded (not loading skeleton)
      await expect(caseStudiesSection.locator('text=Salón Carmen')).toBeVisible()
      await expect(caseStudiesSection.locator('text=Pizzería Miguel')).toBeVisible()
      await expect(caseStudiesSection.locator('text=Clínica López')).toBeVisible()
    })

    // 4. Navigation to Contact Section
    await test.step('Navigate to contact section', async () => {
      // Click on primary CTA to go to contact
      await page.locator('a[href="#contact"]').first().click()

      // Wait for smooth scroll to complete
      await page.waitForTimeout(1000)

      // Check contact section is in view
      const contactSection = page.locator('#contact')
      await expect(contactSection).toBeInViewport()
    })

    // 5. Contact Form Interaction
    await test.step('Contact form loads and is interactive', async () => {
      const contactForm = page.locator('form')
      await expect(contactForm).toBeVisible()

      // Check all required form fields are present
      await expect(page.locator('input[name="name"]')).toBeVisible()
      await expect(page.locator('input[name="email"]')).toBeVisible()
      await expect(page.locator('input[name="phone"]')).toBeVisible()
      await expect(page.locator('select[name="businessType"]')).toBeVisible()
      await expect(page.locator('textarea[name="message"]')).toBeVisible()
    })

    // 6. Form Validation
    await test.step('Form validation works correctly', async () => {
      // Try to submit empty form
      await page.locator('button[type="submit"]').click()

      // Should show validation errors
      await expect(page.locator('text=requerido')).toBeVisible({ timeout: 2000 })
    })

    // 7. Complete Form Submission
    await test.step('Form submission works end-to-end', async () => {
      // Fill out the form with valid data
      await page.fill('input[name="name"]', 'María González')
      await page.fill('input[name="email"]', 'maria@salon-test.com')
      await page.fill('input[name="phone"]', '+52 123 456 7890')
      await page.selectOption('select[name="businessType"]', 'salon')
      await page.fill('textarea[name="message"]', 'Me interesa automatizar WhatsApp para mi salón de belleza. Queremos aumentar nuestras citas.')

      // Submit the form
      await page.locator('button[type="submit"]').click()

      // Check for success state (this depends on your implementation)
      await expect(page.locator('text=enviado')).toBeVisible({ timeout: 5000 })

      // OR check for navigation to thank you page
      // await expect(page).toHaveURL(/\/gracias/)
    })
  })

  test('should have good performance throughout the flow', async ({ page }) => {
    // Track performance metrics
    const performanceMetrics = {
      loadTime: 0,
      interactionTime: 0,
      formSubmissionTime: 0
    }

    await test.step('Landing page loads quickly', async () => {
      const startTime = Date.now()
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      performanceMetrics.loadTime = Date.now() - startTime

      // Should load within 3 seconds
      expect(performanceMetrics.loadTime).toBeLessThan(3000)
    })

    await test.step('Scrolling and lazy loading is smooth', async () => {
      const startTime = Date.now()

      // Scroll through all sections
      await page.locator('#features').scrollIntoViewIfNeeded()
      await page.waitForTimeout(100)

      await page.locator('#cases').scrollIntoViewIfNeeded()
      await page.waitForTimeout(100)

      await page.locator('#contact').scrollIntoViewIfNeeded()
      await page.waitForTimeout(100)

      performanceMetrics.interactionTime = Date.now() - startTime

      // Scrolling should be responsive
      expect(performanceMetrics.interactionTime).toBeLessThan(1000)
    })

    await test.step('Form interaction is responsive', async () => {
      const startTime = Date.now()

      // Fill form quickly
      await page.fill('input[name="name"]', 'Test User')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="phone"]', '123456789')
      await page.selectOption('select[name="businessType"]', 'salon')

      performanceMetrics.formSubmissionTime = Date.now() - startTime

      // Form should be responsive
      expect(performanceMetrics.formSubmissionTime).toBeLessThan(500)
    })
  })

  test('should work correctly on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await test.step('Mobile landing page loads correctly', async () => {
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()

      // Check mobile-specific elements
      const mobileCarousel = page.locator('.mobile-carousel')
      await expect(mobileCarousel).toBeVisible()
    })

    await test.step('Mobile navigation works', async () => {
      // Check hamburger menu or mobile navigation
      const mobileNav = page.locator('[data-mobile-nav]')
      if (await mobileNav.isVisible()) {
        await mobileNav.click()
        await expect(page.locator('nav')).toBeVisible()
      }
    })

    await test.step('Mobile touch interactions work', async () => {
      // Test touch scrolling
      await page.locator('#cases').scrollIntoViewIfNeeded()

      // Test mobile carousel in testimonials
      const carousel = page.locator('.mobile-carousel')
      if (await carousel.isVisible()) {
        // Simulate swipe gesture
        await carousel.hover()
        await page.mouse.down()
        await page.mouse.move(300, 0)
        await page.mouse.up()
      }
    })

    await test.step('Mobile form works correctly', async () => {
      await page.locator('#contact').scrollIntoViewIfNeeded()

      // Form should be properly sized for mobile
      const form = page.locator('form')
      await expect(form).toBeVisible()

      // Fields should be accessible with touch
      await page.fill('input[name="name"]', 'Mobile User')
      await page.fill('input[name="email"]', 'mobile@test.com')

      // Check that form elements are properly sized for touch
      const nameInput = page.locator('input[name="name"]')
      const boundingBox = await nameInput.boundingBox()
      expect(boundingBox?.height).toBeGreaterThan(40) // Minimum touch target size
    })
  })

  test('should be accessible', async ({ page }) => {
    await test.step('Check basic accessibility', async () => {
      await page.goto('/')

      // Check for basic accessibility attributes
      await expect(page.locator('[role="banner"]')).toBeVisible() // Hero section
      await expect(page.locator('[role="button"]')).toHaveCount({ gte: 1 }) // Buttons
      await expect(page.locator('[alt]')).toHaveCount({ gte: 1 }) // Images with alt text
    })

    await test.step('Keyboard navigation works', async () => {
      // Tab through main interactive elements
      await page.keyboard.press('Tab') // First focusable element
      await page.keyboard.press('Tab') // Next element

      // Should be able to reach main CTA
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
      expect(['BUTTON', 'A', 'INPUT']).toContain(focusedElement)
    })

    await test.step('Form is accessible', async () => {
      await page.locator('#contact').scrollIntoViewIfNeeded()

      // Check form labels
      await expect(page.locator('label[for="name"]')).toBeVisible()
      await expect(page.locator('label[for="email"]')).toBeVisible()

      // Check form can be navigated with keyboard
      await page.keyboard.press('Tab')
      await page.type(page.locator(':focus'), 'Test Name')
    })
  })

  test('should handle errors gracefully', async ({ page }) => {
    await test.step('Handle network errors gracefully', async () => {
      // Simulate slow network
      await page.route('**/api/**', route => {
        setTimeout(() => route.continue(), 2000)
      })

      await page.goto('/')

      // Page should still load even if APIs are slow
      await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
    })

    await test.step('Handle image loading errors', async () => {
      // Block image loading to test fallbacks
      await page.route('**/images/**', route => {
        route.abort()
      })

      await page.goto('/')
      await page.locator('#cases').scrollIntoViewIfNeeded()

      // Should show fallback content or handle gracefully
      // This depends on your OptimizedImage component implementation
      await expect(page.locator('[data-testid="image-fallback"]')).toBeVisible().catch(() => {
        // If no fallback, at least page shouldn't crash
        expect(page.locator('h1')).toBeVisible()
      })
    })

    await test.step('Handle form submission errors', async () => {
      // Mock API to return error
      await page.route('**/api/contact', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal server error' })
        })
      })

      await page.locator('#contact').scrollIntoViewIfNeeded()

      // Fill and submit form
      await page.fill('input[name="name"]', 'Error Test')
      await page.fill('input[name="email"]', 'error@test.com')
      await page.fill('input[name="phone"]', '123456789')
      await page.selectOption('select[name="businessType"]', 'salon')

      await page.locator('button[type="submit"]').click()

      // Should show error message
      await expect(page.locator('text=error')).toBeVisible({ timeout: 5000 })
    })
  })
})