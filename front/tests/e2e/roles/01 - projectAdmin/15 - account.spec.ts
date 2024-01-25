/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { AccountPage } from '@/tests/pageObjectModels/account'

test.describe('Check project admin account permissions', () => {
  let accountPage: AccountPage

  test.beforeEach(async ({ projectAdminContext }) => {
    accountPage = new AccountPage(projectAdminContext)
  })

  test('should be able to navigate', async () => {
    await accountPage.navigate()
  })
})
