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

test.describe('Create or update decision tree', () => {
  test('should create a decision tree', async ({ adminPage }) => {
    await adminPage.page
      .getByRole('row', { name: 'First algo Draft 16.08.2023 Open algorithm' })
      .getByRole('link')
      .click()
    await adminPage.page
      .getByRole('button', { name: 'New decision tree' })
      .click()
    await adminPage.page.getByLabel('Label*').click()
    await adminPage.page.getByLabel('Label*').fill('Test decision tree')
    await adminPage.page.getByLabel('Complaint category*').selectOption('1')
    await adminPage.page.locator('input[name="cutOffStart"]').click()
    await adminPage.page.locator('input[name="cutOffStart"]').fill('1')
    await adminPage.page.locator('input[name="cutOffEnd"]').click()
    await adminPage.page.locator('input[name="cutOffEnd"]').fill('5')
    await adminPage.page.getByRole('button', { name: 'Save' }).click()
    await adminPage.page.getByLabel('Label*').click()
    await adminPage.page.getByLabel('Label*').fill('Test diagnosis')
    await adminPage.page.getByLabel('Description').click()
    await adminPage.page
      .getByLabel('Description')
      .fill('This is a description message')
    await adminPage.page.getByRole('button', { name: 'Save' }).click()
    await adminPage.page.getByRole('button', { name: 'Edit' }).click()
    await adminPage.page.getByLabel('Label*').click()
    await adminPage.page.getByLabel('Label*').fill('Tested diagnosis')
    await adminPage.page.getByRole('button', { name: 'Save' }).click()
    await adminPage.page
      .getByRole('button', { name: 'Add a diagnosis' })
      .click()
    await adminPage.page
      .getByText('Label*Please fill this out in English')
      .click()
    await adminPage.page.getByLabel('Label*').fill('Another diagnosis')
    await adminPage.page.getByRole('button', { name: 'Save' }).click()
    await adminPage.page.getByRole('button', { name: 'Done' }).click()
    await expect(
      await adminPage.page.getByText('Created successfully')
    ).toBeVisible()
  })

  test('should update a decision tree', async ({ adminPage }) => {
    await adminPage.page
      .getByRole('row', { name: 'First algo Draft 16.08.2023 Open algorithm' })
      .getByRole('link')
      .click()
    await adminPage.page.locator('[data-cy="datatable-menu-3"]').click()
    await adminPage.page.getByRole('menuitem', { name: 'Edit' }).click()
    await adminPage.page.getByLabel('Label*').click()
    await adminPage.page.getByLabel('Label*').fill('Tested decision tree')
    await adminPage.page.locator('input[name="cutOffEnd"]').click()
    await adminPage.page.locator('input[name="cutOffEnd"]').fill('40')
    await adminPage.page.getByRole('button', { name: 'Save' }).click()
    await expect(
      await adminPage.page.getByText('Updated successfully')
    ).toBeVisible()
  })
})
