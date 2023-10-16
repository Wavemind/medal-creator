/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { NewPasswordPage } from '@/tests/pages/newPasswordPage'

test.describe('Authentication', () => {
  let newPasswordPage: NewPasswordPage

  test.beforeEach(async ({ adminContext }) => {
    newPasswordPage = new NewPasswordPage(adminContext)
    await newPasswordPage.navigate()
  })

  test('should contain email, submit button and sign in link', async () => {
    await newPasswordPage.checkFields()
  })

  test('should display an error message if form is empty', async () => {
    await newPasswordPage.validateForm()
  })
})
