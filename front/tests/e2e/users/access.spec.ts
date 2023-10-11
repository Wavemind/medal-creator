/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.describe('Users list', () => {
  test('should navigate to users list', async ({ adminContext }) => {
    await adminContext.page.goto('/')
    await adminContext.getByTestId('user-menu').click()
    await adminContext.page.getByRole('menuitem', { name: 'Users' }).click()
    await adminContext.page.waitForURL('/users')
    await expect(
      await adminContext.page.getByRole('heading', { name: 'Users' })
    ).toBeVisible()
  })
})
