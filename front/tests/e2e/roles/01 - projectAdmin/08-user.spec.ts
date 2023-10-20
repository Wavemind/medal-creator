/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { UsersPage } from '@/tests/pageObjectModels/users'

test.describe('Check project admin user permissions', () => {
  let usersPage: UsersPage

  test.beforeEach(async ({ projectAdminContext }) => {
    usersPage = new UsersPage(projectAdminContext)
    await usersPage.navigate()
  })

  test('should not be able to access the users page', async () => {
    await usersPage.cannotAccessUsersPage()
  })
})
