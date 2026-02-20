/**
 * E2E Tests: Admin Access Control
 *
 * Verifies that:
 * 1. /admin/* routes are NOT reachable without authentication
 * 2. The public landing page has NO links or references to /admin
 * 3. The admin login page renders correctly and rejects bad credentials
 * 4. An authenticated admin can reach the dashboard
 *
 * These tests run against the local dev server (no real Supabase calls).
 * Auth-specific flows (admin login with real credentials) are gated behind
 * the ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD env vars.
 */

import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// 1. Public site — no admin links
// ---------------------------------------------------------------------------

test.describe('Public site: no admin exposure', () => {
  test('landing page has no visible link to /admin', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // No anchor tag should href to /admin
    const adminLinks = page.locator('a[href*="/admin"]')
    await expect(adminLinks).toHaveCount(0)
  })

  test('landing page header has no dashboard or admin button', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // No button/link text containing "dashboard" or "admin" (case-insensitive)
    await expect(page.getByRole('link', { name: /dashboard/i })).toHaveCount(0)
    await expect(page.getByRole('link', { name: /admin/i })).toHaveCount(0)
    await expect(page.getByRole('button', { name: /admin/i })).toHaveCount(0)
  })
})

// ---------------------------------------------------------------------------
// 2. Unauthenticated access — redirects to login
// ---------------------------------------------------------------------------

test.describe('Admin access control: unauthenticated', () => {
  const protectedRoutes = [
    '/admin/dashboard',
    '/admin/dashboard/leads',
    '/admin/dashboard/analytics',
  ]

  for (const route of protectedRoutes) {
    test(`unauthenticated visit to ${route} redirects to /admin/login`, async ({ page }) => {
      await page.goto(route)
      await page.waitForLoadState('networkidle')

      // Should land on login page
      await expect(page).toHaveURL(/\/admin\/login/)
    })
  }

  test('visiting /admin redirects to /admin/login when unauthenticated', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin\/login/)
  })
})

// ---------------------------------------------------------------------------
// 3. Admin login page — structure and validation
// ---------------------------------------------------------------------------

test.describe('Admin login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')
  })

  test('renders email and password fields', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('renders a submit button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /entrar|iniciar|acceder|ingresar/i })).toBeVisible()
  })

  test('does NOT show a register or sign-up link', async ({ page }) => {
    await expect(page.getByRole('link', { name: /registr|sign.?up|crear cuenta/i })).toHaveCount(0)
  })

  test('shows an error on empty form submission', async ({ page }) => {
    const submitBtn = page.getByRole('button').filter({ hasText: /entrar|iniciar|acceder|ingresar/i })
    await submitBtn.click()

    // Browser native validation should prevent submission (required fields).
    // If JS-driven validation, an error message appears.
    // At minimum, URL should remain on login page.
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('shows an error for wrong credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'wrong@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.getByRole('button').filter({ hasText: /entrar|iniciar|acceder|ingresar/i }).click()

    // Wait for error to appear (max 5 s)
    const errorText = page.locator('text=/credenciales|incorrect|inválid|error/i')
    await expect(errorText).toBeVisible({ timeout: 5000 })
  })
})

// ---------------------------------------------------------------------------
// 4. Unauthorized page
// ---------------------------------------------------------------------------

test.describe('Admin unauthorized page', () => {
  test('renders without crashing', async ({ page }) => {
    await page.goto('/admin/unauthorized')
    await page.waitForLoadState('networkidle')

    // Page should not be a 404 or 500
    await expect(page.locator('body')).not.toContainText('404')
    await expect(page.locator('body')).not.toContainText('Application error')
  })
})

// ---------------------------------------------------------------------------
// 5. Authenticated admin flow (only runs if env vars are set)
// ---------------------------------------------------------------------------

test.describe('Authenticated admin dashboard', () => {
  // Skip entire suite if credentials are not configured
  test.skip(
    !process.env.ADMIN_TEST_EMAIL || !process.env.ADMIN_TEST_PASSWORD,
    'Skipped: set ADMIN_TEST_EMAIL and ADMIN_TEST_PASSWORD to run authenticated tests'
  )

  test.beforeEach(async ({ page }) => {
    // Log in as admin
    await page.goto('/admin/login')
    await page.fill('input[type="email"]', process.env.ADMIN_TEST_EMAIL!)
    await page.fill('input[type="password"]', process.env.ADMIN_TEST_PASSWORD!)
    await page.getByRole('button').filter({ hasText: /entrar|iniciar|acceder|ingresar/i }).click()

    // Wait for redirect to dashboard
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 10000 })
  })

  test('dashboard page loads with stats cards', async ({ page }) => {
    await expect(page.getByTestId('stat-leads-total')).toBeVisible()
    await expect(page.getByTestId('stat-leads-new')).toBeVisible()
    await expect(page.getByTestId('stat-leads-week')).toBeVisible()
    await expect(page.getByTestId('stat-conversion')).toBeVisible()
  })

  test('admin header nav links are present', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Overview' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Leads' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Analytics' })).toBeVisible()
  })

  test('can navigate to leads list', async ({ page }) => {
    await page.getByRole('link', { name: 'Leads' }).click()
    await page.waitForURL(/\/admin\/dashboard\/leads/)
    await expect(page).toHaveURL(/\/admin\/dashboard\/leads/)
  })

  test('can navigate to analytics', async ({ page }) => {
    await page.getByRole('link', { name: 'Analytics' }).click()
    await page.waitForURL(/\/admin\/dashboard\/analytics/)
    await expect(page).toHaveURL(/\/admin\/dashboard\/analytics/)
  })

  test('sign-out redirects to /admin/login', async ({ page }) => {
    await page.getByRole('button', { name: /cerrar sesión/i }).click()
    await page.waitForURL(/\/admin\/login/, { timeout: 5000 })
    await expect(page).toHaveURL(/\/admin\/login/)
  })
})
