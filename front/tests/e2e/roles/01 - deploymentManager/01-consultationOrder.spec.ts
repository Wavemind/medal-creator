/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { ConsultationOrderPage } from '@/tests/pageObjectModels/consultationOrder'

test.describe('Check deployment manager consultation order permissions', () => {
  let consultationOrderPage: ConsultationOrderPage

  test.beforeEach(async ({ deploymentManagerContext }) => {
    consultationOrderPage = new ConsultationOrderPage(deploymentManagerContext)
    await consultationOrderPage.navigate()
    await consultationOrderPage.checkSteps()
  })

  test('should not be able to move node', async () => {
    // TODO
  })
})
