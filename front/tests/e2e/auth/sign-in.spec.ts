/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { SignInPage } from '@/tests/pages/signInPage'

test.describe('Sign in page', () => {
  let signInPage: SignInPage

  test.beforeEach(async ({ adminContext }) => {
    signInPage = new SignInPage(adminContext)
    await signInPage.navigate()
  })

  // test('should be redirected to auth page', async ({ page }) => {
  //   await page.goto('/')
  //   expect(await page.url()).toContain('/auth/sign-in')
  // })

  test('should contain email, password, submit button and forgot password link', async () => {
    await signInPage.checkFields()
  })

  test('should display an error message if form is empty', async () => {
    await signInPage.validateForm()
  })

  test('should display an error message if user cannot connect', async () => {
    await signInPage.checkInvalidUser()
  })

  test('should redirect user after successful login', async () => {
    await signInPage.checkValidUser()
  })
})
