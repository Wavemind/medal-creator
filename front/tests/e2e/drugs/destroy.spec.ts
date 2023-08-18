/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/')
  await adminPage.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await adminPage.page
    .getByRole('link', { name: 'Library', exact: true })
    .click()
  await adminPage.page.getByRole('link', { name: 'Drugs' }).click()
})

test('should destroy a drug', async ({ adminPage }) => {
  await adminPage.getByDataCy('datatable-menu').first().click()
  await adminPage.page.getByRole('menuitem', { name: 'Delete' }).click()
  await adminPage.page.getByRole('button', { name: 'Yes' }).click()
  await expect(
    await adminPage.page.getByText('Deleted successfully')
  ).toBeVisible()
})
