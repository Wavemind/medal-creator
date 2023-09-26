/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/projects/1/library')
})

test.describe('Variable page', () => {
  test('should navigate to variable page and search for an existing variable', async ({
    adminPage,
  }) => {
    await adminPage.page.getByRole('textbox').click()
    await adminPage.page.getByRole('textbox').fill('Cough')
    await expect(
      await adminPage.page.getByRole('cell', {
        name: 'Cough',
      })
    ).toBeVisible()
  })

  test('should search for an inexistant variable', async ({ adminPage }) => {
    await adminPage.page.getByRole('textbox').click()
    await adminPage.page.getByRole('textbox').fill('toto')
    await expect(
      await adminPage.page.getByRole('cell', { name: 'No data available' })
    ).toBeVisible()
  })
})
