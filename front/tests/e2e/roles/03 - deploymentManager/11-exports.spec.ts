/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { ExportsPage } from '@/tests/pageObjectModels/exports'

test.describe('Check deployment manager exports permissions', () => {
  let exportsPage: ExportsPage

  test.beforeEach(async ({ deploymentManagerContext }) => {
    exportsPage = new ExportsPage(deploymentManagerContext)
    await exportsPage.navigateToAlgorithm()
  })

  test('should not be able to access exports page', async () => {
    await exportsPage.cannotAccessExportsPage()
  })
})
