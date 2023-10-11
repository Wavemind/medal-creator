/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ viewerContext }) => {
  await viewerContext.page.goto('/')
})

test.describe('Check viewer user permissions', () => {
  test('should not have access to users page', async ({ viewerContext }) => {
    await viewerContext.page.getByTestId('user-menu').click()
    await expect(
      await viewerContext.getByTestId('menu-users')
    ).not.toBeVisible()
    await viewerContext.page.getByTestId('user-menu').click()
    await viewerContext.page.goto('/users')
    await expect(
      await viewerContext.page.getByRole('heading', { name: 'Users' })
    ).not.toBeVisible()
  })
})
