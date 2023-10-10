/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test('should update user password', async ({ clinicianPage }) => {
  await clinicianPage.page.goto('/account/credentials')

  // Due to 2 times password on the same view
  await clinicianPage.getByTestId('new-password').fill('123456')
  await clinicianPage.fillInput('passwordConfirmation', '123456')

  // Due to 2 times password on the same view
  await clinicianPage.page.getByRole('button', { name: 'Save' }).click()

  await expect(
    await clinicianPage.page.getByText('Complexity requirement not met')
  ).toBeVisible()

  await clinicianPage.getByTestId('new-password').fill('P@ssw0rd')
  await clinicianPage.fillInput('passwordConfirmation', 'P@ssw0rd')

  await clinicianPage.page.getByRole('button', { name: 'Save' }).click()
  await expect(
    await clinicianPage.page.getByText('Saved successfully')
  ).toBeVisible()
})
