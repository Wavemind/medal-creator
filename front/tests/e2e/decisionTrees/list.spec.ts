/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/projects/1/algorithms/1')
})

test.describe('Decision tree page', () => {
  test('should navigate to decision tree page and search for an existing decisioon tree', async ({
    adminPage,
  }) => {
    await adminPage.page.getByRole('textbox').click()
    await adminPage.page.getByRole('textbox').fill('HIV')
    await adminPage.page.getByRole('cell', { name: 'HIV' }).click()
    await expect(
      await adminPage.page.getByRole('cell', {
        name: 'HIV',
      })
    ).toBeVisible()
  })

  test('should search for an inexistant decision tree', async ({
    adminPage,
  }) => {
    await adminPage.page.getByRole('textbox').click()
    await adminPage.page.getByRole('textbox').fill('toto')
    await expect(
      await adminPage.page.getByRole('cell', { name: 'No data available' })
    ).toBeVisible()
  })
})
