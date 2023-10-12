/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { ManagementsPage } from '@/tests/pages/managementsPage'

test.describe('Check clinician management permissions', () => {
  let managementsPage: ManagementsPage

  test.beforeEach(async ({ clinicianContext }) => {
    managementsPage = new ManagementsPage(clinicianContext)
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
    await managementsPage.canDestroyManagementExclusion()
  })

  test('should be able to update a management', async () => {
    await managementsPage.canUpdateManagement()
  })

  test('should be able to destroy a management', async () => {
    await managementsPage.canDestroyManagement()
  })
})
