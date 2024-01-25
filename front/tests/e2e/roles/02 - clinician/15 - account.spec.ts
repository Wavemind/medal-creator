/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { AccountPage } from '@/tests/pageObjectModels/account'

test.describe('Check clinician account permissions', () => {
  let accountPage: AccountPage

  test.beforeEach(async ({ clinicianContext }) => {
    accountPage = new AccountPage(clinicianContext)
  })

  test('should be able to navigate', async () => {
    await accountPage.navigate()
  })
})
