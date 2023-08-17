/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test('should archive an algorithm', async ({ adminPage }) => {
  await adminPage.page.goto('/')
  await adminPage.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await adminPage.page
    .getByRole('link', { name: 'Algorithms', exact: true })
    .click()
  await adminPage.getByDataCy('create-algorithm')
  await adminPage.fillInput('name', 'test archive')
  await adminPage.fillTextarea('ageLimitMessage', 'a message')
  await adminPage.fillInput('ageLimit', '3')
  await adminPage.selectOptionByValue('mode', 'arm_control')
  await adminPage.fillTextarea('description', 'This is a test description')
  await adminPage.submitForm()
  await adminPage.page
    .getByRole('row', {
      name: 'test archive Intervention Draft 16.08.2023 Open algorithm',
    })
    .getByRole('button')
    .click()
  await adminPage.page.getByRole('menuitem', { name: 'Archive' }).click()
  await adminPage.page.getByRole('button', { name: 'Yes' }).click()
  await expect(
    await adminPage.page.getByText('Archived successfully')
  ).toBeVisible()
})
