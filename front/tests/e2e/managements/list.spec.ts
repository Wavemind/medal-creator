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
  await adminPage.page.getByRole('link', { name: 'Managements' }).click()
})

// TODO : Remove this test when all role tests are implemented as this is tested there
test('should navigate to managements page and search for an existing management', async ({
  adminPage,
}) => {
  await adminPage.page.getByRole('textbox').click()
  await adminPage.page.getByRole('textbox').fill('refer')
  await expect(
    await adminPage.page.getByRole('cell', {
      name: 'M1 refer',
    })
  ).toBeVisible()
})

test('should search for an inexistant management', async ({ adminPage }) => {
  await adminPage.page.getByRole('textbox').click()
  await adminPage.page.getByRole('textbox').fill('toto')
  await expect(
    await adminPage.page.getByRole('cell', { name: 'No data available' })
  ).toBeVisible()
})
