/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ deploymentManagerPage }) => {
  await deploymentManagerPage.page.goto('/')
})

test.describe('Check deploymentManager user permissions', () => {
  test('should not have access to users page', async ({
    deploymentManagerPage,
  }) => {
    await deploymentManagerPage.page.getByTestId('user-menu').click()
    await expect(
      await deploymentManagerPage.getByTestId('menu-users')
    ).not.toBeVisible()
    await deploymentManagerPage.page.getByTestId('user-menu').click()
    await deploymentManagerPage.page.goto('/users')
    await expect(
      await deploymentManagerPage.page.getByRole('heading', { name: 'Users' })
    ).not.toBeVisible()
  })
})
