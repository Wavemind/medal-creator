/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { ForgotPasswordPage } from '@/tests/pages/forgotPasswordPage'

test.describe('Forgot password page', () => {
  let forgotPasswordPage: ForgotPasswordPage

  test.beforeEach(async ({ adminContext }) => {
    forgotPasswordPage = new ForgotPasswordPage(adminContext)
    await forgotPasswordPage.navigate()
  })

  test('should contain email, submit button and sign in link', async () => {
    await forgotPasswordPage.checkFields()
  })

  test('should display an error message if form is empty', async () => {
    await forgotPasswordPage.validateForm()
  })

  test('should successfully submit form even if user does not exist', async () => {
    await forgotPasswordPage.successfullySubmitForm()
  })
})
