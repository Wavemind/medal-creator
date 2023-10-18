/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { AlgorithmsPage } from '@/playwright/pages/algorithmsPage'

// TODO : Add the duplicate test once it's implemented
test.describe('Check clinician algorithm permissions', () => {
  let algorithmsPage: AlgorithmsPage

  test.beforeEach(async ({ clinicianContext }) => {
    algorithmsPage = new AlgorithmsPage(clinicianContext)
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

  test('should be able to search for algorithms', async () => {
    await algorithmsPage.canSearchForAlgorithms()
  })
})
