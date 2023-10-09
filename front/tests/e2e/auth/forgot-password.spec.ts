/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.describe('Forgot password', () => {
  test('should contains email, submit button and sign in link', async ({
    page,
  }) => {
    await page.goto('/auth/forgot-password')

    await expect(page.getByLabel('Email *')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Send' })).toBeVisible()
    await expect(page.getByText('Sign in')).toBeVisible()
  })

  test('should display an error message if form is empty', async ({ page }) => {
    await page.goto('/auth/forgot-password')
    await page.getByRole('button', { name: 'Send' }).click()

    const emailError = page.getByText('Email is required')
    // Check if the input has the 'required' attribute
    expect(emailError).toBeVisible()
  })

  test('should display a message if user exist or not', async ({ page }) => {
    await page.goto('/auth/forgot-password')
    await page.getByRole('button', { name: 'Send' }).click()

    await page.getByLabel('Email *').click()
    await page.getByLabel('Email *').fill('test@test.com')

    await page.getByRole('button', { name: 'Send' }).click()
    await page.waitForURL('/auth/sign-in?notifications=reset_password')

    await expect(
      await page.getByText(
        'If your email address exists in our database, you will receive an email with instructions on how to reset your password in a few minutes.'
      )
    ).toBeVisible()
  })
})
