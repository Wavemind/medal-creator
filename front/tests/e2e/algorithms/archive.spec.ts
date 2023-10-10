/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

// TODO : Delete all of this ?
test('should archive an algorithm', async ({ adminPage }) => {
  await adminPage.page.goto('/')
  await adminPage.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await adminPage.page
    .getByRole('link', { name: 'Algorithms', exact: true })
    .click()
  await adminPage.getByTestId('create-algorithm').click()
  await adminPage.fillInput('name', 'test archive')
  await adminPage.fillTextarea('ageLimitMessage', 'a message')
  await adminPage.fillInput('ageLimit', '3')
  await adminPage.fillInput('minimumAge', '2')
  await adminPage.selectOptionByValue('mode', 'arm_control')
  await adminPage.fillTextarea('description', 'This is a test description')
  await adminPage.submitForm()

  await adminPage.page.waitForTimeout(500)

  await adminPage.fillInput('search', 'test archive')

  await adminPage.getByTestId('datatable-menu').first().click()
  await adminPage.page.getByRole('menuitem', { name: 'Archive' }).click()
  await adminPage.page.getByRole('button', { name: 'Yes' }).click()
  await expect(
    await adminPage.page.getByText('Archived successfully')
  ).toBeVisible()
})
