/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { AccountPage } from '@/tests/pageObjectModels/account'

test.describe('Check viewer account permissions', () => {
  let accountPage: AccountPage

  test.beforeEach(async ({ viewerContext }) => {
    accountPage = new AccountPage(viewerContext)
  })

  test('should be able to navigate', async () => {
    await accountPage.navigate()
  })
})
