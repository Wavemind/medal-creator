/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ viewerPage }) => {
  await viewerPage.page.goto('/')
})

test.describe('Check viewer user permissions', () => {
  test('should not have access to users page', async ({ viewerPage }) => {
    await viewerPage.page.getByTestId('user-menu').click()
    await expect(await viewerPage.getByTestId('menu-users')).not.toBeVisible()
    await viewerPage.page.getByTestId('user-menu').click()
    await viewerPage.page.goto('/users')
    await expect(
      await viewerPage.page.getByRole('heading', { name: 'Users' })
    ).not.toBeVisible()
  })
})
