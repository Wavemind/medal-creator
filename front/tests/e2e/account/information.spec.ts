/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { InformationPage } from '@/tests/pages/informationPage'

test.describe('Information page', () => {
  let informationPage: InformationPage

  test.beforeEach(async ({ adminContext }) => {
    informationPage = new InformationPage(adminContext)
    await informationPage.navigate()
  })

  test('should check information fields', async () => {
    await informationPage.checkFields()
  })

  test('should successfully update the account information', async () => {
    await informationPage.successfullyUpdateInformation()
  })
})
