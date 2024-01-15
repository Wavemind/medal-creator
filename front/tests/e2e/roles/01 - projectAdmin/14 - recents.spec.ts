/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { RecentsPage } from '@/tests/pageObjectModels/recents'

test.describe('Check super admin recents permissions', () => {
  let recentsPage: RecentsPage

  test.beforeEach(async ({ projectAdminContext }) => {
    recentsPage = new RecentsPage(projectAdminContext)
    await recentsPage.navigate()
  })

  test('should be able to search', async () => {
    await recentsPage.canSearchForDecisionTrees()
  })
})
