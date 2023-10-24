/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { DrugsPage } from '@/tests/pageObjectModels/drugs'

test.describe('Check deployment manager drug permissions', () => {
  let drugsPage: DrugsPage

  test.beforeEach(async ({ deploymentManagerContext }) => {
    drugsPage = new DrugsPage(deploymentManagerContext)
    await drugsPage.navigate()
  })

  test('should be able to search', async () => {
    await drugsPage.canSearchForDrugs()
  })

  test('should not be able to create a drug', async () => {
    await drugsPage.cannotCreateDrug()
  })

  test('should not be able to update a drug', async () => {
    await drugsPage.cannotUpdateDrug()
  })

  test('should not be able to delete a drug', async () => {
    await drugsPage.cannotDeleteDrug()
  })

  test('should not be able to create a drug exclusion', async () => {
    await drugsPage.cannotCreateDrugExclusion()
  })

  test('should not be able to delete a drug exclusion', async () => {
    await drugsPage.cannotDeleteDrugExclusion()
  })
})
