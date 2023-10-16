/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { UsersPage } from '@/tests/pages/usersPage'

test.describe('Check deployment manager user permissions', () => {
  let usersPage: UsersPage

  test.beforeEach(async ({ deploymentManagerContext }) => {
    usersPage = new UsersPage(deploymentManagerContext)
    await usersPage.navigate()
  })

  test('should not be able to access the users page', async () => {
    await usersPage.cannotAccessUsersPage()
  })
})
