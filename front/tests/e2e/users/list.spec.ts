/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminContext }) => {
  await adminContext.page.goto('/users')
})

test.describe('Users page', () => {
  test('should search for an existing users', async ({ adminContext }) => {
    await adminContext.page.getByRole('textbox').click()
    await adminContext.page.getByRole('textbox').fill('dev-admin@wavemind.ch')
    await expect(
      await adminContext.page.getByRole('cell', {
        name: 'dev-admin@wavemind.ch',
      })
    ).toBeVisible()
  })

  test('should search for an inexistant user', async ({ adminContext }) => {
    await adminContext.page.getByRole('textbox').click()
    await adminContext.page.getByRole('textbox').fill('toto')
    await expect(
      await adminContext.page.getByRole('cell', { name: 'No data available' })
    ).toBeVisible()
  })
})
