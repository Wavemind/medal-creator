/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ userPage }) => {
  await userPage.page.goto('/account/information')
})

test('should navigate to the account information page and check if input is visible', async ({
  userPage,
}) => {
  await expect(userPage.getInput('firstName')).toBeVisible()
  await expect(userPage.getInput('lastName')).toBeVisible()
  await expect(userPage.getInput('email')).toBeVisible()
  await expect(
    userPage.page.getByRole('button', { name: 'Save' })
  ).toBeVisible()
})

test('should navigate to the account information page and test form functionality', async ({
  userPage,
}) => {
  await userPage.fillInput('firstName', 'Update first name')
  await userPage.fillInput('lastName', 'Update last name')
  await userPage.submitForm()

  await expect(
    await userPage.page.getByText('Saved successfully')
  ).toBeVisible()
})
