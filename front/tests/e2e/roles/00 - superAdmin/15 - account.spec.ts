/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { AccountPage } from '@/tests/pageObjectModels/account'

test.describe('Check super admin account permissions', () => {
  let accountPage: AccountPage

  test.beforeEach(async ({ adminContext }) => {
    accountPage = new AccountPage(adminContext)
  })

  test('should be able to navigate', async () => {
    await accountPage.navigate()
  })
})
