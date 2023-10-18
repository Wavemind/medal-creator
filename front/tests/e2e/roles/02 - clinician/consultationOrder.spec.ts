/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { ConsultationOrderPage } from '@/tests/pageObjectModels/consultationOrder'

test.describe('Check clinician consultation order permissions', () => {
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
