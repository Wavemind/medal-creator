/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.describe('404', () => {
  test('should navigate to the 404 page if the url does not exist', async ({
    userPage,
  }) => {
    await userPage.page.goto('/asdlkkjasdkjaslkdjasd')
    await expect(
      await userPage.page.getByRole('heading', { name: '404 | Page not found' })
    ).toBeVisible()
  })
})
