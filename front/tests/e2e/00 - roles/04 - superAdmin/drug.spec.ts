/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { DrugsPage } from '@/tests/pages/drugsPage'

test.describe('Check project admin drug permissions', () => {
  let drugsPage: DrugsPage

  test.beforeEach(async ({ adminContext }) => {
    drugsPage = new DrugsPage(adminContext)
    await drugsPage.navigate()
  })

  test('should be able to search', async () => {
    await drugsPage.canSearchForDrugs()
  })

  test('should be able to create a drug', async () => {
    await drugsPage.canCreateDrug()
  })

  test('should be able to update a drug', async () => {
    await drugsPage.canUpdateDrug()
  })

  test('should be able to destroy a drug', async () => {
    await drugsPage.canDeleteDrug()
  })

  test('should be able to create a drug exclusion', async () => {
    await drugsPage.canCreateDrugExclusion()
  })

  test('should be able to destroy a drug exclusion', async () => {
    await drugsPage.canDeleteDrugExclusion()
  })
})
