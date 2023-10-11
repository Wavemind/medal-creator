/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminContext }) => {
  await adminContext.page.goto('/users')
})

test('should lock a user', async ({ adminContext }) => {
  await adminContext.page.getByRole('textbox').click()
  await adminContext.page.getByRole('textbox').fill('john.doe@wavemind.ch')

  await adminContext.page.waitForTimeout(500)

  await adminContext.getByTestId('datatable-menu').first().click()
  await adminContext.page.getByRole('menuitem', { name: 'Lock' }).click()

  const alertDialog = await adminContext.getByTestId('alert-dialog')
  await alertDialog.getByRole('button', { name: 'Yes' }).click()

  await expect(
    await adminContext.getByTestId('datatable-row-lock-3')
  ).toBeVisible()
})

test('should unlock a user', async ({ adminContext }) => {
  await adminContext.page.getByRole('textbox').click()
  await adminContext.page.getByRole('textbox').fill('john.doe@wavemind.ch')

  await adminContext.page.waitForTimeout(500)

  await adminContext.getByTestId('datatable-menu').first().click()
  await adminContext.page.getByRole('menuitem', { name: 'Unlock' }).click()
  const alertDialog = await adminContext.getByTestId('alert-dialog')
  await alertDialog.getByRole('button', { name: 'Yes' }).click()

  await expect(
    await adminContext.getByTestId('datatable-row-lock-3')
  ).toBeHidden()
})
