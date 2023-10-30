/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { AlgorithmsPage } from '@/tests/pageObjectModels/algorithms'

// TODO : Add the duplicate test once it's implemented
test.describe('Check super admin algorithm permissions', () => {
  let algorithmsPage: AlgorithmsPage

  test.beforeEach(async ({ adminContext }) => {
    algorithmsPage = new AlgorithmsPage(adminContext)
    await algorithmsPage.navigate()
  })

  test('should be able to create an algorithm', async () => {
    await algorithmsPage.canCreateAlgorithm()
  })

  test('should be able to update an algorithm', async () => {
    await algorithmsPage.openEditForm()
    await algorithmsPage.canUpdateAlgorithm('This is another description')
  })

  test('should be able to edit an algorithm through Algorithm Settings', async () => {
    await algorithmsPage.navigateToProjectSettings()
    await algorithmsPage.canUpdateAlgorithm('This is yet another description')
  })

  test('should be able to archive an algorithm', async () => {
    await algorithmsPage.canArchiveAlgorithm()
  })

  test('should be able to duplicate an algorithm', () => {
    // TODO : When we can duplicate an algorithm
  })

  test('should be able to publish an algorithm', async () => {
    await algorithmsPage.canPublishAlgorithm()
  })

  test('should be able to search for algorithms', async () => {
    await algorithmsPage.canSearchForAlgorithms()
  })
})
