/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ clinicianContext }) => {
  await clinicianContext.page.goto('/account/information')
})

test('should navigate to the account information page and check if input is visible', async ({
  clinicianContext,
}) => {
  await expect(clinicianContext.getInput('firstName')).toBeVisible()
  await expect(clinicianContext.getInput('lastName')).toBeVisible()
  await expect(clinicianContext.getInput('email')).toBeVisible()
  await expect(
    clinicianContext.page.getByRole('button', { name: 'Save' })
  ).toBeVisible()
})

test('should navigate to the account information page and test form functionality', async ({
  clinicianContext,
}) => {
  await clinicianContext.fillInput('firstName', 'Update first name')
  await clinicianContext.fillInput('lastName', 'Update last name')
  await clinicianContext.submitForm()

  await expect(
    await clinicianContext.page.getByText('Saved successfully')
  ).toBeVisible()
})
