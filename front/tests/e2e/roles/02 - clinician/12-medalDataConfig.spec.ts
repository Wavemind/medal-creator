/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { MedalDataConfigPage } from '@/tests/pageObjectModels/medalDataConfig'

test.describe('Check clinician medal data config permissions', () => {
  let medalDataConfigPage: MedalDataConfigPage

  test.beforeEach(async ({ clinicianContext }) => {
    medalDataConfigPage = new MedalDataConfigPage(clinicianContext)
    await medalDataConfigPage.navigateToAlgorithm()
  })

  test('should not be able to access exports page', async () => {
    await medalDataConfigPage.cannotAccessMedalDataConfigPage()
  })
})
