/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { ExportsPage } from '@/tests/pageObjectModels/exports'

test.describe('Check viewer exports permissions', () => {
  let exportsPage: ExportsPage

  test.beforeEach(async ({ viewerContext }) => {
    exportsPage = new ExportsPage(viewerContext)
    await exportsPage.navigateToAlgorithm()
  })

  test('should not be able to access exports page', async () => {
    await exportsPage.cannotAccessExportsPage()
  })
})
