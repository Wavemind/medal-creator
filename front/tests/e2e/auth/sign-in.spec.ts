/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { SignInPage } from '@/tests/pageObjectModels/signIn'

test.describe('Sign in page', () => {
  let signInPage: SignInPage

  test.beforeEach(async ({ emptyContext }) => {
    signInPage = new SignInPage(emptyContext)
    await signInPage.navigate()
  })

  test('should be redirected to auth page if not authenticated', async () => {
    await signInPage.redirect()
  })

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
