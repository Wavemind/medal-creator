/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/projects/1/algorithms/1')
})

test.describe('Create or update decision tree', () => {
  test('should create a decision tree', async ({ adminPage }) => {
    await adminPage.getByTestId('create-decision-tree').click()
    await adminPage.fillInput('label', 'Test decision tree from front')
    await adminPage.selectOptionByValue('nodeId', '10')
    await adminPage.fillInput('cutOffStart', '0')
    await adminPage.fillInput('cutOffEnd', '1')
    await adminPage.submitForm()

    await expect(
      await adminPage.page.getByText('Level of urgency')
    ).toBeVisible()
    await adminPage.fillInput('label', 'Test diagnosis')
    await adminPage.fillTextarea('description', 'This is a description message')
    await adminPage.submitForm()

    await adminPage.page.getByRole('button', { name: 'Edit' }).click()
    await adminPage.fillInput('label', 'Tested diagnosis')
    await adminPage.submitForm()
    await adminPage.page
      .getByRole('button', { name: 'Add a diagnosis' })
      .click()
    await adminPage.fillInput('label', 'Another diagnosis')
    await adminPage.submitForm()
    await adminPage.page.getByRole('button', { name: 'Done' }).click()
    await expect(
      await adminPage.page.getByText('Saved successfully')
    ).toBeVisible()
  })

  test('should update a decision tree', async ({ adminPage }) => {
    await adminPage.getByTestId('datatable-menu').first().click()
    await adminPage.page.getByRole('menuitem', { name: 'Edit' }).click()
    await adminPage.fillInput('label', 'Tested decision tree from front')
    await adminPage.fillInput('cutOffEnd', '40')
    await adminPage.submitForm()
    await expect(
      await adminPage.page.getByText('Saved successfully')
    ).toBeVisible()
  })
})
