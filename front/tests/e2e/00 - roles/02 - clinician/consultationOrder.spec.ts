/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { ConsultationOrderPage } from '@/tests/pages/consultationOrderPage'

test.describe('Check viewer consultation order permissions', () => {
  let consultationOrderPage: ConsultationOrderPage

  test.beforeEach(async ({ clinicianContext }) => {
    consultationOrderPage = new ConsultationOrderPage(clinicianContext)
    await consultationOrderPage.navigate()
    await consultationOrderPage.checkSteps()
  })

  test('should be able to move node', async () => {
    // TODO
  })
})
