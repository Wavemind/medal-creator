/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { NewPasswordPage } from '@/tests/pageObjectModels/newPassword'

test.describe('New password page', () => {
  let newPasswordPage: NewPasswordPage

  test.beforeEach(async ({ emptyContext }) => {
    newPasswordPage = new NewPasswordPage(emptyContext)
    await newPasswordPage.navigate()
  })

  test('should contain email, submit button and sign in link', async () => {
    await newPasswordPage.checkFields()
  })

  test('should display an error message if form is empty', async () => {
    await newPasswordPage.validateForm()
  })
})
