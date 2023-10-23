/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { MedalDataConfigPage } from '@/tests/pageObjectModels/medalDataConfig'

test.describe('Check deployment manager medal data config permissions', () => {
  let medalDataConfigPage: MedalDataConfigPage

  test.beforeEach(async ({ deploymentManagerContext }) => {
    medalDataConfigPage = new MedalDataConfigPage(deploymentManagerContext)
    await medalDataConfigPage.navigateToAlgorithm()
  })

  test('should not be able to access exports page', async () => {
    await medalDataConfigPage.cannotAccessMedalDataConfigPage()
  })
})
