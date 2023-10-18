/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { UsersPage } from '@/playwright/pages/usersPage'

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
