/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { ManagementsPage } from '@/playwright/pages/managementsPage'

test.describe('Check deployment manager management permissions', () => {
  let managementsPage: ManagementsPage

  test.beforeEach(async ({ deploymentManagerContext }) => {
    managementsPage = new ManagementsPage(deploymentManagerContext)
    await managementsPage.navigate()
  })

  test('should be able to search', async () => {
    await managementsPage.canSearchForManagements()
  })

  test('should not be able to create a management', async () => {
    await managementsPage.cannotCreateManagement()
  })

  test('should not be able to update a management', async () => {
    await managementsPage.cannotUpdateManagement()
  })

  test('should not be able to delete a management', async () => {
    await managementsPage.cannotDeleteManagement()
  })

  test('should not be able to create a management exclusion', async () => {
    await managementsPage.cannotCreateManagementExclusion()
  })

  test('should not be able to delete a management exclusion', async () => {
    await managementsPage.cannotDeleteManagementExclusion()
  })
})
