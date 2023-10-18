/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { NotFoundPage } from '@/tests/pageObjectModels/notFound'

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
