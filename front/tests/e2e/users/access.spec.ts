/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.describe('Users list', () => {
  test('should navigate to users list', async ({ adminPage }) => {
    await adminPage.page.goto('/')
    await adminPage.page.locator(`[data-cy=user-menu]`).click()
    await adminPage.page.getByRole('menuitem', { name: 'Users' }).click()
    await adminPage.page.waitForURL('/users')
    await expect(
      await adminPage.page.getByRole('heading', { name: 'Users' })
    ).toBeVisible()
  })
})
