import { test as setup, expect } from '@playwright/test'

const userFile = '../playwright/.auth/user.json'
const adminFile = '../playwright/.auth/admin.json'

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/auth/sign-in')

  await page.getByLabel('Email*').click()
  await page.getByLabel('Email*').fill('dev-admin@wavemind.ch')
  await page.getByLabel('Password*').click()
  await page.getByLabel('Password*').fill('P@ssw0rd')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(
    await page.getByRole('link', { name: 'Credentials' })
  ).toBeVisible()

  // End of authentication steps.
  await page.context().storageState({ path: adminFile })
})

setup('authenticate as user', async ({ page }) => {
  await page.goto('/auth/sign-in')

  await page.getByLabel('Email*').click()
  await page.getByLabel('Email*').fill('dev@wavemind.ch')
  await page.getByLabel('Password*').click()
  await page.getByLabel('Password*').fill('P@ssw0rd')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(
    await page.getByRole('link', { name: 'Credentials' })
  ).toBeVisible()

  // End of authentication steps.
  await page.context().storageState({ path: userFile })
})
