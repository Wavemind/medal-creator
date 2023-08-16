/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/')
})

test.describe('Create or update algorithm', () => {
  test('should create an algorithm', async ({ adminPage }) => {
    await adminPage.page
      .getByRole('link', { name: 'Project for Tanzania' })
      .click()
    await adminPage.page
      .getByRole('link', { name: 'Algorithms', exact: true })
      .click()
    await adminPage.page.getByRole('button', { name: 'New algorithm' }).click()
    await adminPage.page.getByLabel('Name*').click()
    await adminPage.page.getByLabel('Name*').fill('Test algorithm')
    await adminPage.page.locator('input[name="ageLimit"]').click()
    await adminPage.page.locator('input[name="ageLimit"]').fill('4')
    await adminPage.page
      .getByLabel(
        'Message displayed in medal-reader if patient above threshold*'
      )
      .click()
    await adminPage.page
      .getByLabel(
        'Message displayed in medal-reader if patient above threshold*'
      )
      .fill('This is a test age limit message')
    await adminPage.page.locator('input[name="minimumAge"]').click()
    await adminPage.page.locator('input[name="minimumAge"]').fill('3')
    await adminPage.page.getByLabel('Type*').selectOption('arm_control')
    await adminPage.page.getByLabel('Description*').click()
    await adminPage.page
      .getByLabel('Description*')
      .fill('This is a test description')
    await adminPage.page
      .locator('label')
      .filter({ hasText: 'French' })
      .locator('span')
      .first()
      .click()
    await adminPage.page.getByRole('button', { name: 'Save' }).click()
    await expect(
      await adminPage.page.getByText('Created successfully')
    ).toBeVisible()
    await expect(
      await adminPage.page.getByRole('cell', { name: 'Test algorithm' })
    ).toBeVisible()
  })

  test('should update an algorithm', async ({ adminPage }) => {
    await adminPage.page
      .getByRole('link', { name: 'Project for Tanzania' })
      .click()
    await adminPage.page
      .getByRole('link', { name: 'Algorithms', exact: true })
      .click()

    await adminPage.page
      .getByRole('row', {
        name: 'Test algorithm For control arm facilities Draft 16.08.2023 Open algorithm',
      })
      .getByRole('button')
      .click()
    await adminPage.page.getByRole('menuitem', { name: 'Edit' }).click()
    await adminPage.page.locator('input[name="minimumAge"]').click()
    await adminPage.page.locator('input[name="minimumAge"]').fill('6')
    await adminPage.page.getByLabel('Description*').click()
    await adminPage.page.getByLabel('Description*').click()
    await adminPage.page
      .getByLabel('Description*')
      .fill('This is another test description')
    await adminPage.page.getByRole('button', { name: 'Save' }).click()
    await expect(
      await adminPage.page.getByText('Updated successfully')
    ).toBeVisible()
  })
})
