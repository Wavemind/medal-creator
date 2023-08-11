/**
 * The external imports
 */
import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/auth/new-password')
})

test.describe('New password', () => {
  test('should contains password, password confirmation, submit button and sign in link', async ({
    page,
  }) => {
    await expect(page.getByLabel('New password*')).toBeVisible()
    await expect(page.getByLabel('Password confirmation*')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible()
    await expect(page.getByText('Sign in')).toBeVisible()
  })

  test('should display an error message if form is empty', async ({ page }) => {
    await page.getByRole('button', { name: 'Save' }).click()

    const newPasswordElement = page.getByLabel('New password*')
    const newPasswordRequiredAttribute = await newPasswordElement.getAttribute(
      'required'
    )
    // Check if the input has the 'required' attribute
    expect(newPasswordRequiredAttribute).not.toBeNull()

    const passwordConfirmationElement = page.getByLabel(
      'Password confirmation*'
    )
    const passwordConfirmationRequiredAttribute =
      await passwordConfirmationElement.getAttribute('required')
    // Check if the input has the 'required' attribute
    expect(passwordConfirmationRequiredAttribute).not.toBeNull()
  })
})
