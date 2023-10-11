/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminContext }) => {
  await adminContext.page.goto('/projects/1/algorithms/1')
})

test.describe('Create or update decision tree', () => {
  test('should create a decision tree', async ({ adminContext }) => {
    await adminContext.getByTestId('create-decision-tree').click()
    await adminContext.fillInput('label', 'Test decision tree from front')
    await adminContext.selectOptionByValue('nodeId', '10')
    await adminContext.fillInput('cutOffStart', '0')
    await adminContext.fillInput('cutOffEnd', '1')
    await adminContext.submitForm()

    await expect(
      await adminContext.page.getByText('Level of urgency')
    ).toBeVisible()
    await adminContext.fillInput('label', 'Test diagnosis')
    await adminContext.fillTextarea(
      'description',
      'This is a description message'
    )
    await adminContext.submitForm()

    await adminContext.page.getByRole('button', { name: 'Edit' }).click()
    await adminContext.fillInput('label', 'Tested diagnosis')
    await adminContext.submitForm()
    await adminContext.page
      .getByRole('button', { name: 'Add a diagnosis' })
      .click()
    await adminContext.fillInput('label', 'Another diagnosis')
    await adminContext.submitForm()
    await adminContext.page.getByRole('button', { name: 'Done' }).click()
    await expect(
      await adminContext.page.getByText('Saved successfully')
    ).toBeVisible()
  })

  test('should update a decision tree', async ({ adminContext }) => {
    await adminContext.getByTestId('datatable-menu').first().click()
    await adminContext.page.getByRole('menuitem', { name: 'Edit' }).click()
    await adminContext.fillInput('label', 'Tested decision tree from front')
    await adminContext.fillInput('cutOffEnd', '40')
    await adminContext.submitForm()
    await expect(
      await adminContext.page.getByText('Saved successfully')
    ).toBeVisible()
  })
})
