/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ adminContext }) => {
  await adminContext.page.goto('/')
  await adminContext.page
    .getByRole('link', { name: 'Project for Tanzania' })
    .click()
  await adminContext.page
    .getByRole('link', { name: 'Library', exact: true })
    .click()
  await adminContext.page.getByRole('link', { name: 'Drugs' }).click()
})
test('should update label and add solution to an existing drug', async ({
  adminContext,
}) => {
  await adminContext.getByTestId('datatable-menu').first().click()
  await adminContext.page.getByRole('menuitem', { name: 'Edit' }).click()
  await adminContext.fillInput('label', 'updated label')
  await adminContext.nextStep()

  await adminContext.selectOptionByValue('medicationForm', 'solution')
  await adminContext.getByTestId('add-medication-form').click()
  await adminContext.page.waitForTimeout(1000)

  // Tablet
  const solutionForm = 'formulationsAttributes[1]'
  await adminContext.selectOptionByValue(
    `${solutionForm}.administrationRouteId`,
    '4'
  )

  await adminContext.fillInput(`${solutionForm}.dosesPerDay`, '22')
  await adminContext.fillInput(`${solutionForm}.liquidConcentration`, '25')
  await adminContext.fillInput(`${solutionForm}.doseForm`, '25')
  await adminContext.fillInput(`${solutionForm}.maximalDose`, '10')
  await adminContext.fillInput(`${solutionForm}.maximalDosePerKg`, '10')
  await adminContext.fillInput(`${solutionForm}.minimalDosePerKg`, '5')
  await adminContext.fillTextarea(
    `${solutionForm}.description`,
    'one description'
  )
  await adminContext.fillTextarea(
    `${solutionForm}.dispensingDescription`,
    'one dispensing description'
  )
  await adminContext.fillTextarea(
    `${solutionForm}.injectionInstructions`,
    'one injection instructions'
  )

  await adminContext.submitForm()

  await expect(
    await adminContext.page.getByText('Saved successfully')
  ).toBeVisible()
})
