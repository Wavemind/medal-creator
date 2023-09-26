/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/projects/1/library/managements')
})

test('should test exclusion validation and create an exclusion', async ({
  adminPage,
}) => {
  await adminPage.page.getByTestId('datatable-open-node').first().click()
  await adminPage.page.getByRole('button', { name: 'Add exclusion' }).click()

  await adminPage.page
    .locator('[id^="react-select-"][id$="-input"]')
    .nth(0)
    .fill('refer')
  await adminPage.page.getByRole('button', { name: 'refer' }).click()
  await adminPage.page.getByRole('button', { name: 'Save' }).click()

  await expect(
    await adminPage.page.getByText('Loop alert: a node cannot exclude itself!')
  ).toBeVisible()

  await adminPage.getByTestId('delete-exclusion').nth(0).click()
})
