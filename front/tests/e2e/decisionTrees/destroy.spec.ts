/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminContext }) => {
  await adminContext.page.goto('/projects/1/algorithms/1')
})

test('Destroy a decision tree', async ({ adminContext }) => {
  await adminContext.getByTestId('datatable-menu').first().click()
  await adminContext.page.getByRole('menuitem', { name: 'Delete' }).click()
  await adminContext.page.getByRole('button', { name: 'Yes' }).click()
  await expect(
    await adminContext.page.getByText('Deleted successfully')
  ).toBeVisible()
})
