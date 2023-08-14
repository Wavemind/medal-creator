/**
 * The external imports
 */
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should be redirected to auth page', async ({ page }) => {
    await page.goto('/')
    expect(await page.url()).toContain('/auth/sign-in')
  })

  test('should contain email, password, submit button and forgot password link', async ({
    page,
  }) => {
    await page.goto('/auth/sign-in')

    await expect(page.getByLabel('Email*')).toBeVisible()
    await expect(page.getByLabel('Password*')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
    await expect(page.getByText('Forgot your password ?')).toBeVisible()
  })

  test('should display an error message if form is empty', async ({ page }) => {
    await page.goto('/auth/sign-in')
    await page.getByRole('button', { name: 'Sign in' }).click()

    const emailElement = page.getByLabel('Email*')
    const emailRequiredAttribute = await emailElement.getAttribute('required')
    // Check if the input has the 'required' attribute
    expect(emailRequiredAttribute).not.toBeNull()

    const passwordElement = page.getByLabel('Password*')
    const passwordRequiredAttribute = await passwordElement.getAttribute(
      'required'
    )
    // Check if the input has the 'required' attribute
    expect(passwordRequiredAttribute).not.toBeNull()
  })

  test('should display an error message if user cannot connect', async ({
    page,
  }) => {
    await page.goto('/auth/sign-in')

    await page.getByLabel('Email*').click()
    await page.getByLabel('Email*').fill('test@test.com')
    await page.getByLabel('Password*').click()
    await page.getByLabel('Password*').fill('password')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(
      await page.getByText('Invalid login credentials. Please try again.')
    ).toBeVisible()
  })

  test('should redirect user after successful login', async ({ page }) => {
    await page.goto('/auth/sign-in')

    await page.getByLabel('Email*').click()
    await page.getByLabel('Email*').fill('dev@wavemind.ch')
    await page.getByLabel('Password*').click()
    await page.getByLabel('Password*').fill('P@ssw0rd')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(
      await page.getByRole('link', { name: 'Credentials' })
    ).toBeVisible()
  })
})
