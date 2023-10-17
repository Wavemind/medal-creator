/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { ConsultationOrderPage } from '@/tests/pages/consultationOrderPage'

test.describe('Check super admin consultation order permissions', () => {
  let consultationOrderPage: ConsultationOrderPage

  test.beforeEach(async ({ adminContext }) => {
    consultationOrderPage = new ConsultationOrderPage(adminContext)
    await consultationOrderPage.navigate()
    await consultationOrderPage.checkSteps()
  })

  test('should be able to move node', async () => {
    // TODO
  })
})
