/**
 * The external imports
 */
import { test, expect } from '@playwright/test'

// TODO: Fix it, some issue due to page loading and blank screen

test.describe('Forgot password', () => {
  test('should contains email, submit button and sign in link', async ({
    page,
  }) => {
    await page.goto('/auth/forgot-password')

    await expect(page.getByLabel('Email*')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Send' })).toBeVisible()
    await expect(page.getByText('Sign in')).toBeVisible()
  })

  test('should display an error message if form is empty', async ({ page }) => {
    await page.goto('/auth/forgot-password')
    await page.getByRole('button', { name: 'Save' }).click()

    const emailElement = page.getByLabel('Email*')
    const emailRequiredAttribute = await emailElement.getAttribute('required')
    // Check if the input has the 'required' attribute
    expect(emailRequiredAttribute).not.toBeNull()
  })

  test("should display an error message if user doesn't exist", async ({
    page,
  }) => {
    await page.goto('/auth/forgot-password')
    await page.getByRole('button', { name: 'Save' }).click()

    await page.getByLabel('Email*').click()
    await page.getByLabel('Email*').fill('test@test.com')

    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(
      await page.getByText("Unable to find user with email 'test@test.com'.")
    ).toBeVisible()
  })
})
