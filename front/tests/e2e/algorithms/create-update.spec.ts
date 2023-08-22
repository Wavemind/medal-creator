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

test('should create an algorithm', async ({ adminPage }) => {
  await adminPage.getByTestId('new-algorithm').click()
  await adminPage.fillInput('name', 'Test algorithm')
  await adminPage.fillInput('ageLimit', '4')
  await adminPage.fillTextarea(
    'ageLimitMessage',
    'This is a test age limit message'
  )
  await adminPage.fillInput('minimumAge', '2')
  await adminPage.selectOptionByValue('mode', 'arm_control')
  await adminPage.fillTextarea('description', 'This is a test description')

  await adminPage.page
    .locator('label')
    .filter({ hasText: 'French' })
    .locator('span')
    .first()
    .click()

  await adminPage.submitForm()
  await expect(
    await adminPage.page.getByText('Created successfully')
  ).toBeVisible()
})

test('should update an algorithm', async ({ adminPage }) => {
  await adminPage.getByTestId('datatable-menu').first().click()
  await adminPage.page.getByRole('menuitem', { name: 'Edit' }).click()
  await adminPage.fillInput('minimumAge', '6')
  await adminPage.fillInput('ageLimit', '10')

  await adminPage.fillTextarea(
    'description',
    'This is a another test description'
  )
  await adminPage.submitForm()

  await expect(
    await adminPage.page.getByText('Updated successfully')
  ).toBeVisible()
})
