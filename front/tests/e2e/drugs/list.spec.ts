/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/')
  await adminPage.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await adminPage.page
    .getByRole('link', { name: 'Library', exact: true })
    .click()
  await adminPage.page.getByRole('link', { name: 'Drugs' }).click()
})

test('should navigate to drugs page and search for an existing drug', async ({
  adminPage,
}) => {
  await adminPage.page.getByRole('textbox').click()
  await adminPage.page.getByRole('textbox').fill('Amo')
  await expect(
    await adminPage.page.getByRole('cell', {
      name: 'Amox',
    })
  ).toBeVisible()
})

test('should search for an inexistant drug', async ({ adminPage }) => {
  await adminPage.page.getByRole('textbox').click()
  await adminPage.page.getByRole('textbox').fill('toto')
  await expect(
    await adminPage.page.getByRole('cell', { name: 'No data available' })
  ).toBeVisible()
})
