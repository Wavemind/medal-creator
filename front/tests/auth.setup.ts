import { test as setup, expect } from '@playwright/test'

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  await page.goto('/auth/sign-in')
  // Perform authentication steps. Replace these actions with your own.
  await page.getByLabel('Email*').click()
  await page.getByLabel('Email*').fill('dev@wavemind.ch')
  await page.getByLabel('Password*').click()
  await page.getByLabel('Password*').fill('P@ssw0rd')
  await page.getByRole('button', { name: 'Sign in' }).click()

  // Wait until the page receives the cookies.
  await page.waitForURL('account/credentials')

  // End of authentication steps.
  await page.context().storageState({ path: authFile })
})
