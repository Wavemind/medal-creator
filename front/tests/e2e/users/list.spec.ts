/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/users')
})

test.describe('Users page', () => {
  test('should search for an existing users', async ({ adminPage }) => {
    await adminPage.page.getByRole('textbox').click()
    await adminPage.page.getByRole('textbox').fill('dev-admin@wavemind.ch')
    await expect(
      await adminPage.page.getByRole('cell', { name: 'dev-admin@wavemind.ch' })
    ).toBeVisible()
  })

  test('should search for an inexistant user', async ({ adminPage }) => {
    await adminPage.page.getByRole('textbox').click()
    await adminPage.page.getByRole('textbox').fill('toto')
    await expect(
      await adminPage.page.getByRole('cell', { name: 'No data available' })
    ).toBeVisible()
  })

  test('should lock a user', async ({ adminPage }) => {
    await adminPage.page.getByRole('textbox').click()
    await adminPage.page.getByRole('textbox').fill('test@wavemind.ch')
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
    await adminPage.page.getByRole('textbox').fill('test@wavemind.ch')
    await adminPage.page.locator('[data-cy="datatable-menu-3"]').click()
    await adminPage.page.getByRole('menuitem', { name: 'Unlock' }).click()
    const alertDialog = await adminPage.page.locator('[data-cy=alert-dialog]')
    await alertDialog.getByRole('button', { name: 'Yes' }).click()

    await expect(
      await adminPage.page.locator('[data-cy="datatable-row-lock-3"]')
    ).toBeHidden()
  })
})
