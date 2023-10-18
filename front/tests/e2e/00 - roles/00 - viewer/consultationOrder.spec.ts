/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { ConsultationOrderPage } from '@/playwright/pages/consultationOrderPage'

test.describe('Check viewer consultation order permissions', () => {
  let consultationOrderPage: ConsultationOrderPage

  test.beforeEach(async ({ viewerContext }) => {
    consultationOrderPage = new ConsultationOrderPage(viewerContext)
    await consultationOrderPage.navigate()
    await consultationOrderPage.checkSteps()
  })

  test('should not be able to move node', async () => {
    // TODO
  })
})
