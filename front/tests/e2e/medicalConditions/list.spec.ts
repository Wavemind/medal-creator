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
  await adminPage.page.getByRole('link', { name: 'Medical conditions' }).click()
})

test('should search for an existing medical conditions', async ({
  adminPage,
}) => {
  await adminPage.page.getByRole('textbox').click()
  await adminPage.page.getByRole('textbox').fill('Resp')
  await expect(
    await adminPage.page.getByRole('cell', {
      name: 'Respiratory Distress',
    })
  ).toBeVisible()
})

test('should search for an inexistant medical conditions', async ({
  adminPage,
}) => {
  await adminPage.page.getByRole('textbox').click()
  await adminPage.page.getByRole('textbox').fill('toto')
  await expect(
    await adminPage.page.getByRole('cell', { name: 'No data available' })
  ).toBeVisible()
})
