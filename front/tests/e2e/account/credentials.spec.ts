/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { CredentialsPage } from '@/tests/pages/credentialsPage'

test.describe('Credentials page', () => {
  let credentialsPage: CredentialsPage

  test.beforeEach(async ({ adminContext }) => {
    credentialsPage = new CredentialsPage(adminContext)
    await credentialsPage.navigate()
  })

  test('should check password complexity', async () => {
    await credentialsPage.checkComplexity()
  })

  test('should successfully update the password', async () => {
    await credentialsPage.successfullyChangePassword()
  })
})
