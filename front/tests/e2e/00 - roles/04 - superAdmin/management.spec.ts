/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { ManagementsPage } from '@/playwright/pages/managementsPage'

test.describe('Check super admin management permissions', () => {
  let managementsPage: ManagementsPage

  test.beforeEach(async ({ adminContext }) => {
    managementsPage = new ManagementsPage(adminContext)
    await managementsPage.navigate()
  })

  test('should be able to search', async () => {
    await managementsPage.canSearchForManagements()
  })

  test('should be able to create a management', async () => {
    await managementsPage.canCreateManagement()
  })

  test('should be able to create a management exclusion', async () => {
    await managementsPage.canCreateManagementExclusion()
  })

  test('should be able to destroy a management exclusion', async () => {
    await managementsPage.canDeleteManagementExclusion()
  })

  test('should be able to update a management', async () => {
    await managementsPage.canUpdateManagement()
  })

  test('should be able to destroy a management', async () => {
    await managementsPage.canDeleteManagement()
  })
})
