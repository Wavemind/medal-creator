/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test('should update user password', async ({ clinicianContext }) => {
  await clinicianContext.page.goto('/account/credentials')

  // Due to 2 times password on the same view
  await clinicianContext.getByTestId('new-password').fill('123456')
  await clinicianContext.fillInput('passwordConfirmation', '123456')

  // Due to 2 times password on the same view
  await clinicianContext.page.getByRole('button', { name: 'Save' }).click()

  await expect(
    await clinicianContext.page.getByText('Complexity requirement not met')
  ).toBeVisible()

  await clinicianContext.getByTestId('new-password').fill('P@ssw0rd')
  await clinicianContext.fillInput('passwordConfirmation', 'P@ssw0rd')

  await clinicianContext.page.getByRole('button', { name: 'Save' }).click()
  await expect(
    await clinicianContext.page.getByText('Saved successfully')
  ).toBeVisible()
})
