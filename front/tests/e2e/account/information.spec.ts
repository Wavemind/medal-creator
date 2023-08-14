/**
 * The external imports
 */
import { test, expect } from '@playwright/test'

test.use({ storageState: '../playwright/.auth/user.json' })

test.beforeEach(async ({ page }) => {
  await page.goto('/account/information')
})

test.describe('Personal information', () => {
  test('should navigate to the account information page and test form functionality', async ({
    page,
  }) => {
    await expect(page.getByLabel('First name*')).toBeVisible()
    await expect(page.getByLabel('Last name*')).toBeVisible()
    await expect(page.getByLabel('Email*')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible()
  })

  test('should navigate to the account credentials page and test form functionality', async ({
    page,
  }) => {
    await page.getByLabel('First name*').fill('Updated first name')
    await page.getByLabel('Last name*').fill('Updated last name')
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(await page.getByText('Updated successfully')).toBeVisible()
  })
})
