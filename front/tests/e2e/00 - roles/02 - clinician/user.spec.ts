/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ clinicianContext }) => {
  await clinicianContext.page.goto('/')
})

test.describe('Check clinician user permissions', () => {
  test('should not have access to users page', async ({ clinicianContext }) => {
    await clinicianContext.page.getByTestId('user-menu').click()
    await expect(
      await clinicianContext.getByTestId('menu-users')
    ).not.toBeVisible()
    await clinicianContext.page.getByTestId('user-menu').click()
    await clinicianContext.page.goto('/users')
    await expect(
      await clinicianContext.page.getByRole('heading', { name: 'Users' })
    ).not.toBeVisible()
  })
})
