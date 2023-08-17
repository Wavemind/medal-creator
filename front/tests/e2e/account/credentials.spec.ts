/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test('should update user password', async ({ userPage }) => {
  await userPage.page.goto('/account/credentials')

  // Due to 2 times password on the same view
  await userPage.getByDataCy('new-password').fill('123456')
  await userPage.fillInput('passwordConfirmation', '123456')

  // Due to 2 times password on the same view
  await userPage.page.getByRole('button', { name: 'Save' }).click()

  await expect(
    await userPage.page.getByText('Complexity requirement not met')
  ).toBeVisible()

  await userPage.getByDataCy('new-password').fill('P@ssw0rd')
  await userPage.fillInput('passwordConfirmation', 'P@ssw0rd')

  await userPage.page.getByRole('button', { name: 'Save' }).click()
  await expect(
    await userPage.page.getByText('Updated successfully')
  ).toBeVisible()
})
