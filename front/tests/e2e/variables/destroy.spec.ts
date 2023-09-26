/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/projects/1/library')
})

test('should destroy a variable', async ({ adminPage }) => {
  await adminPage.getByTestId('datatable-menu').first().click()
  await adminPage.page.getByRole('menuitem', { name: 'Delete' }).click()
  await adminPage.page.getByRole('button', { name: 'Yes' }).click()
  await expect(
    await adminPage.page.getByText('Deleted successfully')
  ).toBeVisible()
})
