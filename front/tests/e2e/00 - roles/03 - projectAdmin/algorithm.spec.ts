/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { AlgorithmsPage } from '@/tests/pages/algorithmsPage'

// TODO : Add the duplicate test once it's implemented
test.describe('Check project admin algorithm permissions', () => {
  let algorithmsPage: AlgorithmsPage

  test.beforeEach(async ({ projectAdminContext }) => {
    algorithmsPage = new AlgorithmsPage(projectAdminContext)
    await algorithmsPage.navigate()
  })

  test('should be able to create an algorithm', async () => {
    await algorithmsPage.canCreateAlgorithm()
  })

  test('should be able to update an algorithm', async () => {
    await algorithmsPage.openEditForm()
    await algorithmsPage.canUpdateAlgorithm('This is another description')
  })

  test('should be able to edit an algorithm through Algorithm Settings', async ({
    projectAdminContext,
  }) => {
    await algorithmsPage.clickOnFirstRowShow()
    await algorithmsPage.checkHeadingIsVisible('Decision trees & Diagnoses')
    await expect(
      projectAdminContext.page.getByRole('button', {
        name: 'Algorithm settings',
      })
    ).toBeVisible()
    await projectAdminContext.page
      .getByRole('button', {
        name: 'Algorithm settings',
      })
      .click()
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
