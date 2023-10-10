/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ clinicianPage }) => {
  await clinicianPage.page.goto('/')
})

test.describe('Check clinician user permissions', () => {
  test('should not have access to users page', async ({ clinicianPage }) => {
    await clinicianPage.page.getByTestId('user-menu').click()
    await expect(
      await clinicianPage.getByTestId('menu-users')
    ).not.toBeVisible()
    await clinicianPage.page.getByTestId('user-menu').click()
    await clinicianPage.page.goto('/users')
    await expect(
      await clinicianPage.page.getByRole('heading', { name: 'Users' })
    ).not.toBeVisible()
  })
})
