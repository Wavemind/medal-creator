/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ clinicianPage }) => {
  await clinicianPage.page.goto('/account/information')
})

test('should navigate to the account information page and check if input is visible', async ({
  clinicianPage,
}) => {
  await expect(clinicianPage.getInput('firstName')).toBeVisible()
  await expect(clinicianPage.getInput('lastName')).toBeVisible()
  await expect(clinicianPage.getInput('email')).toBeVisible()
  await expect(
    clinicianPage.page.getByRole('button', { name: 'Save' })
  ).toBeVisible()
})

test('should navigate to the account information page and test form functionality', async ({
  clinicianPage,
}) => {
  await clinicianPage.fillInput('firstName', 'Update first name')
  await clinicianPage.fillInput('lastName', 'Update last name')
  await clinicianPage.submitForm()

  await expect(
    await clinicianPage.page.getByText('Saved successfully')
  ).toBeVisible()
})
