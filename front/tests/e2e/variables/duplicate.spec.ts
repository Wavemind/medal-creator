/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminContext }) => {
  await adminContext.page.goto('/projects/1/library')
})

test('Duplicate a variable', async ({ adminContext }) => {
  await adminContext.getByTestId('datatable-menu').first().click()
  await adminContext.page.getByRole('menuitem', { name: 'Duplicate' }).click()
  await adminContext.page.getByRole('button', { name: 'Yes' }).click()
  await expect(
    await adminContext.page.getByText('Duplicated successfully')
  ).toBeVisible()
})
