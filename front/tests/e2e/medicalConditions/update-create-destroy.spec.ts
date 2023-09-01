/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'
import { QuestionsSequenceCategoryEnum } from '@/types'

test.beforeEach(async ({ adminPage }) => {
  await adminPage.page.goto('/')
  await adminPage.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await adminPage.page
    .getByRole('link', { name: 'Library', exact: true })
    .click()
  await adminPage.page.getByRole('link', { name: 'Medical conditions' }).click()
})

test('should create medical conditions', async ({ adminPage }) => {
  await adminPage.getByTestId('create-medical-conditions').click()
  await adminPage.fillInput('label', 'New medical conditions')
  await adminPage.selectOptionByValue(
    'type',
    QuestionsSequenceCategoryEnum.Comorbidity
  )
  await adminPage.submitForm()

  await expect(
    await adminPage.page.getByText('Created successfully')
  ).toBeVisible()
})

test('should update a management', async ({ adminPage }) => {
  await adminPage.getByTestId('datatable-menu').first().click()
  await adminPage.page.getByRole('menuitem', { name: 'Edit' }).click()
  await adminPage.fillInput('label', 'updated medical conditions')
  await adminPage.fillInput('cutOffStart', '1')
  await adminPage.fillInput('cutOffEnd', '5')
  await adminPage.submitForm()

  await expect(
    await adminPage.page.getByText('Updated successfully')
  ).toBeVisible()
})

test('should destroy a management', async ({ adminPage }) => {
  await adminPage.getByTestId('datatable-menu').first().click()
  await adminPage.page.getByRole('menuitem', { name: 'Delete' }).click()
  await adminPage.page.getByRole('button', { name: 'Yes' }).click()
  await expect(
    await adminPage.page.getByText('Deleted successfully')
  ).toBeVisible()
})
