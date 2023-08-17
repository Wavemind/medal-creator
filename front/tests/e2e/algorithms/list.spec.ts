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
    .getByRole('link', { name: 'Algorithms', exact: true })
    .click()
})

test.describe('Algorithms page', () => {
  test('should navigate to algorithm page and search for an existing algorithm', async ({
    adminPage,
  }) => {
    await adminPage.page.getByRole('textbox').click()
    await adminPage.page.getByRole('textbox').fill('first algo')
    await expect(
      await adminPage.page.getByRole('cell', {
        name: 'First algo',
      })
    ).toBeVisible()
  })

  test('should search for an inexistant algorithm', async ({ adminPage }) => {
    await adminPage.page.getByRole('textbox').click()
    await adminPage.page.getByRole('textbox').fill('toto')
    await expect(
      await adminPage.page.getByRole('cell', { name: 'No data available' })
    ).toBeVisible()
  })
})
