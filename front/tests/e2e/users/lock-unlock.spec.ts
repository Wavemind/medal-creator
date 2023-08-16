/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/users')
})

test.describe('Lock - unlock user', () => {
  test('should lock a user', async ({ adminPage }) => {
    await adminPage.page.getByRole('textbox').click()
    await adminPage.page.getByRole('textbox').fill('wavemind.ch')
    await adminPage.page.locator('[data-cy="datatable-menu-3"]').click()
    await adminPage.page.getByRole('menuitem', { name: 'Lock' }).click()
    const alertDialog = await adminPage.page.locator('[data-cy=alert-dialog]')
    await alertDialog.getByRole('button', { name: 'Yes' }).click()

    await expect(
      await adminPage.page.locator('[data-cy="datatable-row-lock-3"]')
    ).toBeVisible()
  })

  test('should unlock a user', async ({ adminPage }) => {
    await adminPage.page.getByRole('textbox').click()
    await adminPage.page.getByRole('textbox').fill('wavemind.ch')
    await adminPage.page.locator('[data-cy="datatable-menu-3"]').click()
    await adminPage.page.getByRole('menuitem', { name: 'Unlock' }).click()
    const alertDialog = await adminPage.page.locator('[data-cy=alert-dialog]')
    await alertDialog.getByRole('button', { name: 'Yes' }).click()

    await expect(
      await adminPage.page.locator('[data-cy="datatable-row-lock-3"]')
    ).toBeHidden()
  })
})
