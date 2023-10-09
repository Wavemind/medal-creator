/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/users')
})

test.describe('Users page', () => {
  test('should search for an existing users', async ({ adminPage }) => {
    await adminPage.page.getByRole('textbox').click()
    await adminPage.page.getByRole('textbox').fill('dev-admin@wavemind.ch')
    await expect(
      await adminPage.page.getByRole('cell', { name: 'dev-admin@wavemind.ch' })
    ).toBeVisible()
  })

  test('should search for an inexistant user', async ({ adminPage }) => {
    await adminPage.page.getByRole('textbox').click()
    await adminPage.page.getByRole('textbox').fill('toto')
    await expect(
      await adminPage.page.getByRole('cell', { name: 'No data available' })
    ).toBeVisible()
  })
})
