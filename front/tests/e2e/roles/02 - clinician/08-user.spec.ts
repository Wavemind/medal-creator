/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { UsersPage } from '@/tests/pageObjectModels/users'

test.describe('Check clinician user permissions', () => {
  let usersPage: UsersPage

  test.beforeEach(async ({ clinicianContext }) => {
    usersPage = new UsersPage(clinicianContext)
    await usersPage.navigate()
  })

  test('should not be able to access the users page', async () => {
    await usersPage.cannotAccessUsersPage()
  })
})
