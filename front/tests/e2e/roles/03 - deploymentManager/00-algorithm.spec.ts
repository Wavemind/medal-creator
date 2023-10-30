/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { AlgorithmsPage } from '@/tests/pageObjectModels/algorithms'

// TODO : Add the duplicate test once it's implemented
test.describe('Check deployment manager algorithm permissions', () => {
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

  test('should be able to publish an algorithm', async () => {
    await algorithmsPage.canPublishAlgorithm()
  })

  test('should be able to search for algorithms', async () => {
    await algorithmsPage.canSearchForAlgorithms()
  })
})
