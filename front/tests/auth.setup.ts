import { test as setup } from '@playwright/test'

const clinicianFile = './playwright/.auth/clinician.json'
const adminFile = './playwright/.auth/admin.json'
const viewerFile = './playwright/.auth/viewer.json'

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/auth/sign-in')

  await page.getByLabel('Email *').click()
  await page.getByLabel('Email *').fill('dev-admin@wavemind.ch')
  await page.getByLabel('Password *').click()
  await page.getByLabel('Password *').fill('P@ssw0rd')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL('/')

  // End of authentication steps.
  await page.context().storageState({ path: adminFile })
})

setup('authenticate as clinician', async ({ page }) => {
  await page.goto('/auth/sign-in')

  await page.getByLabel('Email *').click()
  await page.getByLabel('Email *').fill('dev@wavemind.ch')
  await page.getByLabel('Password *').click()
  await page.getByLabel('Password *').fill('P@ssw0rd')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL('/')

  // End of authentication steps.
  await page.context().storageState({ path: clinicianFile })
})

setup('authenticate as viewer', async ({ page }) => {
  await page.goto('/auth/sign-in')

  await page.getByLabel('Email *').click()
  await page.getByLabel('Email *').fill('viewer@wavemind.ch')
  await page.getByLabel('Password *').click()
  await page.getByLabel('Password *').fill('P@ssw0rd')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL('/')

  // End of authentication steps.
  await page.context().storageState({ path: viewerFile })
})
