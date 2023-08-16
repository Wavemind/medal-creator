/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/')
})

test('should archive an algorithm', async ({ adminPage }) => {
  await adminPage.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await adminPage.page
    .getByRole('link', { name: 'Algorithms', exact: true })
    .click()
  await adminPage.page.getByRole('button', { name: 'New algorithm' }).click()
  await adminPage.page.getByLabel('Name*').click()
  await adminPage.page.getByLabel('Name*').fill('test archive')
  await adminPage.page
    .getByLabel('Message displayed in medal-reader if patient above threshold*')
    .click()
  await adminPage.page
    .getByLabel('Message displayed in medal-reader if patient above threshold*')
    .fill('a message')
  await adminPage.page.getByLabel('Type*').selectOption('intervention')
  await adminPage.page.getByLabel('Description*').click()
  await adminPage.page.getByLabel('Description*').fill('a description')
  await adminPage.page.getByRole('button', { name: 'Save' }).click()
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
