/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/projects/1/algorithms/1')
})

test('Duplicate a decision tree', async ({ adminPage }) => {
  await adminPage.getByDataCy('datatable-menu').first().click()
  await adminPage.page.getByRole('menuitem', { name: 'Duplicate' }).click()
  await adminPage.page.getByRole('button', { name: 'Yes' }).click()
  await expect(
    await adminPage.page.getByText('Duplicated successfully')
  ).toBeVisible()
})
