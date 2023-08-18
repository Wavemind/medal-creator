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
    .getByRole('link', { name: 'Library', exact: true })
    .click()
  await adminPage.page.getByRole('link', { name: 'Drugs' }).click()
})
test('should update label and add solution to an existing drug', async ({
  adminPage,
}) => {
  await adminPage.getByDataCy('datatable-menu').first().click()
  await adminPage.page.getByRole('menuitem', { name: 'Edit' }).click()
  await adminPage.fillInput('label', 'updated label')
  await adminPage.nextStep()

  await adminPage.selectOptionByValue('medicationForm', 'solution')
  await adminPage.getByDataCy('add-medication-form').click()
  await adminPage.page.waitForTimeout(1000)
  await adminPage.getByDataCy('formulation-solution').click()

  // Tablet
  const solutionForm = 'formulationsAttributes[1]'
  await adminPage.selectOptionByValue(
    `${solutionForm}.administrationRouteId`,
    '4'
  )

  await adminPage.fillInput(`${solutionForm}.dosesPerDay`, '22')
  await adminPage.fillInput(`${solutionForm}.liquidConcentration`, '25')
  await adminPage.fillInput(`${solutionForm}.doseForm`, '25')
  await adminPage.fillInput(`${solutionForm}.maximalDose`, '10')
  await adminPage.fillInput(`${solutionForm}.maximalDosePerKg`, '10')
  await adminPage.fillInput(`${solutionForm}.minimalDosePerKg`, '5')
  await adminPage.fillTextarea(`${solutionForm}.description`, 'one description')
  await adminPage.fillTextarea(
    `${solutionForm}.dispensingDescription`,
    'one dispensing description'
  )
  await adminPage.fillTextarea(
    `${solutionForm}.injectionInstructions`,
    'one injection instructions'
  )

  await adminPage.submitForm()

  await expect(
    await adminPage.page.getByText('Updated successfully')
  ).toBeVisible()
})
