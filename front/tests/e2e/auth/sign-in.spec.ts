/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.describe('Authentication', () => {
  test('should be redirected to auth page', async ({ page }) => {
    await page.goto('/')
    expect(await page.url()).toContain('/auth/sign-in')
  })

  test('should contain email, password, submit button and forgot password link', async ({
    page,
  }) => {
    await page.goto('/auth/sign-in')

    await expect(page.getByLabel('Email *')).toBeVisible()
    await expect(page.getByLabel('Password *')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
    await expect(page.getByText('Forgot your password ?')).toBeVisible()
  })

  test('should display an error message if form is empty', async ({ page }) => {
    await page.goto('/auth/sign-in')
    await page.getByRole('button', { name: 'Sign in' }).click()

    const emailError = page.getByText('Email is required')
    // Check if the input has the 'required' attribute
    expect(emailError).toBeVisible()

    const passwordError = page.getByText('Password is required')
    // Check if the input has the 'required' attribute
    expect(passwordError).toBeVisible()
  })

  test('should display an error message if user cannot connect', async ({
    page,
  }) => {
    await page.goto('/auth/sign-in')

    await page.getByLabel('Email *').click()
    await page.getByLabel('Email *').fill('test@test.com')
    await page.getByLabel('Password *').click()
    await page.getByLabel('Password *').fill('password')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(
      await page.getByText('Invalid login credentials. Please try again.')
    ).toBeVisible()
  })

  test('should redirect user after successful login', async ({ page }) => {
    await page.goto('/auth/sign-in')

    await page.getByLabel('Email *').click()
    await page.getByLabel('Email *').fill('dev@wavemind.ch')
    await page.getByLabel('Password *').click()
    await page.getByLabel('Password *').fill('P@ssw0rd')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await page.waitForURL('/')
  })
})
