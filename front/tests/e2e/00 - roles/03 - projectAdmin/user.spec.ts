/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { UsersPage } from '@/tests/pages/usersPage'

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
