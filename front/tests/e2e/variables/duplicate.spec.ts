/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/projects/1/library')
})

test('Duplicate a variable', async ({ adminPage }) => {
  await adminPage.getByTestId('datatable-menu').first().click()
  await adminPage.page.getByRole('menuitem', { name: 'Duplicate' }).click()
  await adminPage.page.getByRole('button', { name: 'Yes' }).click()
  await expect(
    await adminPage.page.getByText('Duplicated successfully')
  ).toBeVisible()
})
