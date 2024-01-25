/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { AccountPage } from '@/tests/pageObjectModels/account'

test.describe('Check deployment manager account permissions', () => {
  let accountPage: AccountPage

  test.beforeEach(async ({ deploymentManagerContext }) => {
    accountPage = new AccountPage(deploymentManagerContext)
  })

  test('should be able to navigate', async () => {
    await accountPage.navigate()
  })
})
