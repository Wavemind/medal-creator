/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminContext }) => {
  await adminContext.page.goto('/')
  await adminContext.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await adminContext.page
    .getByRole('link', { name: 'Library', exact: true })
    .click()
  await adminContext.page.getByRole('link', { name: 'Drugs' }).click()
})

test('should destroy a drug', async ({ adminContext }) => {
  await adminContext.getByTestId('datatable-menu').first().click()
  await adminContext.page.getByRole('menuitem', { name: 'Delete' }).click()
  await adminContext.page.getByRole('button', { name: 'Yes' }).click()
  await expect(
    await adminContext.page.getByText('Deleted successfully')
  ).toBeVisible()
})
