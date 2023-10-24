/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { ExportsPage } from '@/tests/pageObjectModels/exports'

test.describe('Check project admin exports permissions', () => {
  let exportsPage: ExportsPage

  test.beforeEach(async ({ projectAdminContext }) => {
    exportsPage = new ExportsPage(projectAdminContext)
    await exportsPage.navigateToAlgorithm()
  })

  test('should be able to access exports page', async () => {
    await exportsPage.navigateToExports()
  })

  test('should be able to download variables export', async () => {
    await exportsPage.downloadVariables()
  })

  test('should be able to download translations export', async () => {
    await exportsPage.downloadTranslations()
  })

  test('should be able to upload a translations file', async () => {
    await exportsPage.uploadTranslationsFile()
  })

  test('should check file upload validations', async () => {
    await exportsPage.checkUploadValidations()
  })
})
