/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/projects/1/algorithms/1')
})

test('should not be able to destroy a diagnosis', async ({ adminPage }) => {
  await adminPage.page
    .getByRole('button', { name: 'Show diagnoses' })
    .nth(1)
    .click()

  adminPage.page
    .getByRole('row', {
      name: 'first diagnosis updated 5 Open treatment',
      exact: true,
    })
    .getByRole('button')
    .click()

  await expect(
    adminPage.page.getByRole('menuitem', { name: 'Delete' })
  ).toHaveAttribute('disabled', '')
})