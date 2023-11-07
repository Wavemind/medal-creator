/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { MedalDataConfigPage } from '@/tests/pageObjectModels/medalDataConfig'

test.describe('Check super admin medal data config permissions', () => {
  let medalDataConfigPage: MedalDataConfigPage

  test.beforeEach(async ({ adminContext }) => {
    medalDataConfigPage = new MedalDataConfigPage(adminContext)
    await medalDataConfigPage.navigateToAlgorithm()
  })

  test('should be able to access exports page', async () => {
    await medalDataConfigPage.navigateToMedalDataConfigPage()
  })

  test('should be able to add a new row', async () => {
    await medalDataConfigPage.canAddANewRow()
  })

  test('should be able to delete a  row', async () => {
    await medalDataConfigPage.canDeleteARow()
  })

  test('should not be able to send empty row', async () => {
    await medalDataConfigPage.checkValidations()
  })
})
