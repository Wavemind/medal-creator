/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { InformationPage } from '@/tests/pageObjectModels/information'

test.describe('Information page', () => {
  let informationPage: InformationPage

  test.beforeEach(async ({ projectAdminContext }) => {
    informationPage = new InformationPage(projectAdminContext)
    await informationPage.navigate()
  })

  test('should check information fields', async () => {
    await informationPage.checkFields()
  })

  test('should successfully update the account information', async () => {
    await informationPage.successfullyUpdateInformation()
  })
})
