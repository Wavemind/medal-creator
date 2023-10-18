/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { UsersPage } from '@/tests/pageObjectModels/users'

test.describe('Check super admin user permissions', () => {
  let usersPage: UsersPage

  test.beforeEach(async ({ adminContext }) => {
    usersPage = new UsersPage(adminContext)
    await usersPage.navigateToPage()
  })

  test('should be able to search for an existing user', async () => {
    await usersPage.canSearchForExistingUser()
  })

  test('should be able to search for an inexistant user', async () => {
    await usersPage.canSearchForInexistantUser()
  })

  test('should be able to create a user', async () => {
    await usersPage.canCreateUser()
  })

  test('should be able to update a user', async () => {
    await usersPage.canUpdateUser()
  })

  test('should be able to lock a user', async () => {
    await usersPage.canLockUser()
  })

  test('should be able to unlock a user', async () => {
    await usersPage.canUnlockUser()
  })
})
