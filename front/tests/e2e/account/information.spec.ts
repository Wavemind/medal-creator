/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ userPage }) => {
  await userPage.page.goto('/account/information')
})

test.describe('Personal information', () => {
  test('should navigate to the account information page and test form functionality', async ({
    userPage,
  }) => {
    await expect(userPage.page.getByLabel('First name*')).toBeVisible()
    await expect(userPage.page.getByLabel('Last name*')).toBeVisible()
    await expect(userPage.page.getByLabel('Email*')).toBeVisible()
    await expect(
      userPage.page.getByRole('button', { name: 'Save' })
    ).toBeVisible()
  })

  test('should navigate to the account credentials page and test form functionality', async ({
    userPage,
  }) => {
    await userPage.page.getByLabel('First name*').fill('Updated first name')
    await userPage.page.getByLabel('Last name*').fill('Updated last name')
    await userPage.page.getByRole('button', { name: 'Save' }).click()

    await expect(
      await userPage.page.getByText('Updated successfully')
    ).toBeVisible()
  })
})
