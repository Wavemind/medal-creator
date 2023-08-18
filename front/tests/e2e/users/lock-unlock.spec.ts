/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/users')
})

test('should lock a user', async ({ adminPage }) => {
  await adminPage.page.getByRole('textbox').click()
  await adminPage.page.getByRole('textbox').fill('john.doe@wavemind.ch')
  await adminPage.getByDataCy('datatable-menu').first().click()
  await adminPage.page.getByRole('menuitem', { name: 'Lock' }).click()

  const alertDialog = await adminPage.getByDataCy('alert-dialog')
  await alertDialog.getByRole('button', { name: 'Yes' }).click()

  await expect(
    await adminPage.getByDataCy('datatable-row-lock-3')
  ).toBeVisible()
})

test('should unlock a user', async ({ adminPage }) => {
  await adminPage.page.getByRole('textbox').click()
  await adminPage.page.getByRole('textbox').fill('john.doe@wavemind.ch')
  await adminPage.getByDataCy('datatable-menu').first().click()
  await adminPage.page.getByRole('menuitem', { name: 'Unlock' }).click()
  const alertDialog = await adminPage.getByDataCy('alert-dialog')
  await alertDialog.getByRole('button', { name: 'Yes' }).click()

  await expect(await adminPage.getByDataCy('datatable-row-lock-3')).toBeHidden()
})
