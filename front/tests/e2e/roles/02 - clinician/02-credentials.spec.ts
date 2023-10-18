/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { CredentialsPage } from '@/tests/pageObjectModels/credentials'

test.describe('Credentials page', () => {
  let credentialsPage: CredentialsPage

  test.beforeEach(async ({ clinicianContext }) => {
    credentialsPage = new CredentialsPage(clinicianContext)
    await credentialsPage.navigate()
  })

  test('should check password complexity', async () => {
    await credentialsPage.checkComplexity()
  })

  test('should successfully update the password', async () => {
    await credentialsPage.successfullyChangePassword()
  })
})
