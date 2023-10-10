/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ page }) => {
  await page.goto('/auth/new-password')
})

test.describe('New password', () => {
  test('should contains password, password confirmation, submit button and sign in link', async ({
    page,
  }) => {
    await expect(page.getByLabel('New password *')).toBeVisible()
    await expect(page.getByLabel('Password confirmation *')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible()
    await expect(page.getByText('Sign in')).toBeVisible()
  })

  test('should display an error message if form is empty', async ({ page }) => {
    await page.getByRole('button', { name: 'Save' }).click()

    const newPasswordError = page.getByText('New password is required')
    // Check if the input has the 'required' attribute
    expect(newPasswordError).toBeVisible()

    const passwordConfirmationError = page.getByText(
      'Password confirmation is required'
    )
    // Check if the input has the 'required' attribute
    expect(passwordConfirmationError).toBeVisible()
  })
})
