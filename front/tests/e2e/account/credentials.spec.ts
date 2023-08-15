/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.describe('Account - credentials', () => {
  test('update user password', async ({ userPage }) => {
    await userPage.page.goto('/account/credentials')

    await userPage.page.getByLabel('Current Password*').click()
    await userPage.page.getByLabel('Current Password*').fill('123456')
    await userPage.page.getByLabel('Current Password*').press('Tab')
    await userPage.page.getByLabel('Confirm new password*').fill('123456')
    await userPage.page.getByRole('button', { name: 'Save' }).click()
    await expect(
      await userPage.page.getByText('Complexity requirement not met')
    ).toBeVisible()
    await userPage.page.getByLabel('Current Password*').fill('P@ssw0rd')
    await userPage.page.getByLabel('Current Password*').press('Tab')
    await userPage.page.getByLabel('Confirm new password*').fill('P@ssw0rd')
    await userPage.page.getByRole('button', { name: 'Save' }).click()
    await expect(
      await userPage.page.getByText('Updated successfully')
    ).toBeVisible()
  })
})
