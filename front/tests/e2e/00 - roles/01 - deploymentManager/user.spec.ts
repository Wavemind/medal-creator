/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ deploymentManagerContext }) => {
  await deploymentManagerContext.page.goto('/')
})

test.describe('Check deploymentManager user permissions', () => {
  test('should not have access to users page', async ({
    deploymentManagerContext,
  }) => {
    await deploymentManagerContext.page.getByTestId('user-menu').click()
    await expect(
      await deploymentManagerContext.getByTestId('menu-users')
    ).not.toBeVisible()
    await deploymentManagerContext.page.getByTestId('user-menu').click()
    await deploymentManagerContext.page.goto('/users')
    await expect(
      await deploymentManagerContext.page.getByRole('heading', {
        name: 'Users',
      })
    ).not.toBeVisible()
  })
})
