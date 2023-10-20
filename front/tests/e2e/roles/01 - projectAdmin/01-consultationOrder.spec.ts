/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { ConsultationOrderPage } from '@/tests/pageObjectModels/consultationOrder'

test.describe('Check project admin consultation order permissions', () => {
  let consultationOrderPage: ConsultationOrderPage

  test.beforeEach(async ({ projectAdminContext }) => {
    consultationOrderPage = new ConsultationOrderPage(projectAdminContext)
    await consultationOrderPage.navigate()
    await consultationOrderPage.checkSteps()
  })

  test('should be able to move node', async () => {
    // TODO
  })
})
