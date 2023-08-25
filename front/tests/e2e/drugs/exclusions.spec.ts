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

test('should test exclusion validation and create an exclusion', async ({
  adminPage,
}) => {
  await adminPage.page.getByTestId('datatable-open-node').first().click()
  await adminPage.page.getByRole('button', { name: 'Add exclusion' }).click()

  await adminPage.page
    .locator('[id^="react-select-"][id$="-input"]')
    .nth(0)
    .fill('Test tablet drug')
  await adminPage.page.getByRole('button', { name: 'Test tablet drug' }).click()
  await adminPage.page.getByRole('button', { name: 'Save' }).click()

  await expect(
    await adminPage.page.getByText('Loop alert: a node cannot exclude itself!')
  ).toBeVisible()

  await adminPage.page
    .locator('[id^="react-select-"][id$="-input"]')
    .nth(0)
    .fill('panad')
  await adminPage.page.getByRole('button', { name: 'Panadol' }).click()

  await adminPage.page.getByRole('button', { name: 'Add' }).click()

  await adminPage.page
    .locator('[id^="react-select-"][id$="-input"]')
    .nth(1)
    .fill('panad')
  await adminPage.page.getByRole('button', { name: 'Panadol' }).click()
  await adminPage.page.getByRole('button', { name: 'Save' }).click()

  await expect(
    await adminPage.page.getByText('This exclusion is already set.')
  ).toBeVisible()

  await adminPage.getByTestId('delete-exclusion').nth(1).click()
  await adminPage.page.getByRole('button', { name: 'Save' }).click()

  await expect(
    await adminPage.page.getByText('Created successfully')
  ).toBeVisible()
})

test('should destroy an exclusion', async ({ adminPage }) => {
  await adminPage.page.getByTestId('datatable-open-node').first().click()
  await adminPage.page.getByRole('button', { name: 'Delete' }).first().click()
  await adminPage.getByTestId('dialog-accept').click()

  await expect(
    await adminPage.page.getByText('Deleted successfully')
  ).toBeVisible()
})
