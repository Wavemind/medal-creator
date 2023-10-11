/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminContext }) => {
  await adminContext.page.goto('/projects/1/library/managements')
})

test('should test exclusion validation and create an exclusion', async ({
  adminContext,
}) => {
  await adminContext.page.getByTestId('datatable-open-node').first().click()
  await adminContext.page.getByRole('button', { name: 'Add exclusion' }).click()

  await adminContext.page
    .locator('[id^="react-select-"][id$="-input"]')
    .nth(0)
    .fill('refer')
  await adminContext.page.getByRole('button', { name: 'refer' }).click()
  await adminContext.page.getByRole('button', { name: 'Save' }).click()

  await expect(
    await adminContext.page.getByText(
      'Loop alert: a node cannot exclude itself!'
    )
  ).toBeVisible()

  await adminContext.getByTestId('delete-exclusion').nth(0).click()
})
