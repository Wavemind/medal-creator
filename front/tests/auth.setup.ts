import { test as setup } from '@playwright/test'

const userFile = './.auth/user.json'
const adminFile = './.auth/admin.json'

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/auth/sign-in')

  await page.getByLabel('Email*').click()
  await page.getByLabel('Email*').fill('dev-admin@wavemind.ch')
  await page.getByLabel('Password*').click()
  await page.getByLabel('Password*').fill('P@ssw0rd')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL('account/credentials')

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
  await page.waitForURL('account/credentials')

  // End of authentication steps.
  await page.context().storageState({ path: userFile })
})
