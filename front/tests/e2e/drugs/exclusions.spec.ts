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

test('should test exclusion validation and create an exclusion', async ({
  adminContext,
}) => {
  await adminContext.page.getByTestId('datatable-open-node').first().click()
  await adminContext.page.getByRole('button', { name: 'Add exclusion' }).click()

  await adminContext.page
    .locator('[id^="react-select-"][id$="-input"]')
    .nth(0)
    .fill('Test tablet drug')
  await adminContext.page
    .getByRole('button', { name: 'Test tablet drug' })
    .click()
  await adminContext.page.getByRole('button', { name: 'Save' }).click()

  await expect(
    await adminContext.page.getByText(
      'Loop alert: a node cannot exclude itself!'
    )
  ).toBeVisible()

  await adminContext.page
    .locator('[id^="react-select-"][id$="-input"]')
    .nth(0)
    .fill('panad')
  await adminContext.page.getByRole('button', { name: 'Panadol' }).click()

  await adminContext.page.getByRole('button', { name: 'Add' }).click()

  await adminContext.page
    .locator('[id^="react-select-"][id$="-input"]')
    .nth(1)
    .fill('panad')
  await adminContext.page.getByRole('button', { name: 'Panadol' }).click()
  await adminContext.page.getByRole('button', { name: 'Save' }).click()

  await expect(
    await adminContext.page.getByText('This exclusion is already set.')
  ).toBeVisible()

  await adminContext.getByTestId('delete-exclusion').nth(1).click()
  await adminContext.page.getByRole('button', { name: 'Save' }).click()

  await expect(
    await adminContext.page.getByText('Saved successfully')
  ).toBeVisible()
})

test('should destroy an exclusion', async ({ adminContext }) => {
  await adminContext.page.getByTestId('datatable-open-node').first().click()
  await adminContext.page
    .getByRole('button', { name: 'Delete' })
    .first()
    .click()
  await adminContext.getByTestId('dialog-accept').click()

  await expect(
    await adminContext.page.getByText('Deleted successfully')
  ).toBeVisible()
})
