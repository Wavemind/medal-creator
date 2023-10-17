/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { NotFoundPage } from '@/tests/pages/NotFoundPage'

test.describe('Authentication', () => {
  let notFoundPage: NotFoundPage

  test.beforeEach(async ({ adminContext }) => {
    notFoundPage = new NotFoundPage(adminContext)
    await notFoundPage.navigate()
  })

  test('should navigate to the 404 page if the url does not exist', async () => {
    await notFoundPage.pageNotFound()
  })
})
