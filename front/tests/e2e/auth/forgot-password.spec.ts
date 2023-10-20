/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { ForgotPasswordPage } from '@/tests/pageObjectModels/forgotPassword'

test.describe('Forgot password page', () => {
  let forgotPasswordPage: ForgotPasswordPage

  test.beforeEach(async ({ emptyContext }) => {
    forgotPasswordPage = new ForgotPasswordPage(emptyContext)
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
