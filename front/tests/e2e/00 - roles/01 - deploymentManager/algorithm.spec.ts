/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { AlgorithmsPage } from '@/tests/pages/algorithmsPage'

// TODO : Add the duplicate test once it's implemented
test.describe('Check viewer algorithm permissions', () => {
  let algorithmsPage: AlgorithmsPage

  test.beforeEach(async ({ deploymentManagerContext }) => {
    algorithmsPage = new AlgorithmsPage(deploymentManagerContext)
    await algorithmsPage.navigate()
  })

  test('should not be able to create an algorithm', async () => {
    await algorithmsPage.cannotCreateAlgorithm()
  })

  test('should not be able to update an algorithm', async () => {
    await algorithmsPage.cannotUpdateAlgorithm()
  })

  test('should not be able to archive an algorithm', async () => {
    await algorithmsPage.cannotArchiveAlgorithm()
  })

  test('should not be able to duplicate an algorithm', async () => {
    await algorithmsPage.cannotDuplicateAlgorithm()
  })

  test('should be able to search for algorithms', async () => {
    await algorithmsPage.canSearchForAlgorithms()
  })
})
