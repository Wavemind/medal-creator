/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { UsersPage } from '@/tests/pageObjectModels/users'

test.describe('Check viewer user permissions', () => {
  let usersPage: UsersPage

  test.beforeEach(async ({ viewerContext }) => {
    usersPage = new UsersPage(viewerContext)
    await usersPage.navigate()
  })

  test('should not be able to access the users page', async () => {
    await usersPage.cannotAccessUsersPage()
  })
})
