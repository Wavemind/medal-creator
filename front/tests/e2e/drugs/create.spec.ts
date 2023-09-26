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
  await adminPage.getByTestId('create-drug').click()
})

test('should validate drug form', async ({ adminPage }) => {
  await adminPage.nextStep()

  await expect(
    await adminPage.page.getByText('Label is required')
  ).toBeVisible()

  await adminPage.fillInput('label', 'Test label drug')
  await adminPage.nextStep()

  await adminPage.submitForm()
  await expect(
    await adminPage.page.getByText(
      'Formulations field must have at least 1 items'
    )
  ).toBeVisible()

  await adminPage.selectOptionByValue('medicationForm', 'tablet')
  await adminPage.getByTestId('add-medication-form').click()
  await adminPage.page.waitForTimeout(1000)
  await adminPage.getByTestId('formulation-tablet').click()

  // Tablet
  const tabletForm = 'formulationsAttributes[0]'
  await expect(
    await adminPage.getSelect(`${tabletForm}.administrationRouteId`)
  ).toHaveAttribute('required', '')
  await expect(
    await adminPage.getInput(`${tabletForm}.dosesPerDay`)
  ).toHaveAttribute('required', '')
  await expect(await adminPage.getCheckbox(`${tabletForm}.byAge`)).toBeVisible()
  await expect(
    await adminPage.getSelect(`${tabletForm}.breakable`)
  ).toHaveAttribute('required', '')
  await expect(
    await adminPage.getInput(`${tabletForm}.uniqueDose`)
  ).not.toBeVisible()
  await expect(
    await adminPage.getInput(`${tabletForm}.liquidConcentration`)
  ).not.toBeVisible()
  await expect(
    await adminPage.getInput(`${tabletForm}.doseForm`)
  ).toHaveAttribute('required', '')
  await expect(
    await adminPage.getInput(`${tabletForm}.maximalDose`)
  ).toHaveAttribute('required', '')
  await expect(
    await adminPage.getInput(`${tabletForm}.minimalDosePerKg`)
  ).toHaveAttribute('required', '')
  await expect(
    await adminPage.getInput(`${tabletForm}.maximalDosePerKg`)
  ).toHaveAttribute('required', '')
  await expect(
    await adminPage.getTextarea(`${tabletForm}.description`)
  ).toBeVisible()
  await expect(
    await adminPage.getTextarea(`${tabletForm}.injectionInstructions`)
  ).not.toBeVisible()
  await expect(
    await adminPage.getTextarea(`${tabletForm}.dispensingDescription`)
  ).toBeVisible()
  await adminPage.getByTestId('remove-formulations-tablet').click()

  // Syrup
  await adminPage.selectOptionByValue('medicationForm', 'syrup')
  await adminPage.getByTestId('add-medication-form').click()
  await adminPage.page.waitForTimeout(1000)
  await adminPage.getByTestId('formulation-syrup').click()

  const syrupForm = 'formulationsAttributes[0]'
  await expect(
    await adminPage.getInput(`${syrupForm}.liquidConcentration`)
  ).toHaveAttribute('required', '')
  await adminPage.page.getByText('Fixed-dose administrations').click()
  await expect(
    await adminPage.getInput(`${syrupForm}.uniqueDose`)
  ).toHaveAttribute('required', '')
  await expect(
    await adminPage.getInput(`${syrupForm}.doseForm`)
  ).not.toBeVisible()
  await expect(
    await adminPage.getInput(`${syrupForm}.maximalDose`)
  ).not.toBeVisible()
  await expect(
    await adminPage.getInput(`${syrupForm}.minimalDosePerKg`)
  ).not.toBeVisible()
  await expect(
    await adminPage.getInput(`${syrupForm}.maximalDosePerKg`)
  ).not.toBeVisible()
})

test('should create a drug with one tablet formulation', async ({
  adminPage,
}) => {
  await adminPage.fillInput('label', 'Test tablet drug')
  await adminPage.nextStep()

  await adminPage.selectOptionByValue('medicationForm', 'tablet')
  await adminPage.getByTestId('add-medication-form').click()
  await adminPage.page.waitForTimeout(1000)
  await adminPage.getByTestId('formulation-tablet').click()

  const tabletForm = 'formulationsAttributes[0]'
  await adminPage.selectOptionByValue(
    `${tabletForm}.administrationRouteId`,
    '1'
  )
  await adminPage.fillInput(`${tabletForm}.dosesPerDay`, '22')
  await adminPage.selectOptionByValue(`${tabletForm}.breakable`, 'two')
  await adminPage.fillInput(`${tabletForm}.doseForm`, '25')
  await adminPage.fillInput(`${tabletForm}.maximalDose`, '10')
  await adminPage.fillInput(`${tabletForm}.minimalDosePerKg`, '25')
  await adminPage.fillInput(`${tabletForm}.maximalDosePerKg`, '25')

  await adminPage.submitForm()

  await expect(
    await adminPage.page.getByText('Must be less than maximal daily dose')
  ).toBeVisible()

  await adminPage.fillInput(`${tabletForm}.maximalDosePerKg`, '10')

  await adminPage.submitForm()

  await expect(
    await adminPage.page.getByText('Must be less than maximal dose per kg')
  ).toBeVisible()

  await adminPage.fillInput(`${tabletForm}.minimalDosePerKg`, '5')
  await adminPage.fillTextarea(`${tabletForm}.description`, 'one description')
  await adminPage.fillTextarea(
    `${tabletForm}.dispensingDescription`,
    'one dispensing description'
  )

  await adminPage.submitForm()

  await expect(
    await adminPage.page.getByText('Saved successfully')
  ).toBeVisible()
})

test('should create a drug with one syrup formulation', async ({
  adminPage,
}) => {
  await adminPage.fillInput('label', 'Test syrup drug')
  await adminPage.nextStep()

  await adminPage.selectOptionByValue('medicationForm', 'syrup')
  await adminPage.getByTestId('add-medication-form').click()
  await adminPage.page.waitForTimeout(1000)
  await adminPage.getByTestId('formulation-syrup').click()

  // Tablet
  const syrupForm = 'formulationsAttributes[0]'
  await adminPage.selectOptionByValue(`${syrupForm}.administrationRouteId`, '4')

  await adminPage.fillInput(`${syrupForm}.dosesPerDay`, '22')
  await adminPage.fillInput(`${syrupForm}.liquidConcentration`, '25')
  await adminPage.fillInput(`${syrupForm}.doseForm`, '25')
  await adminPage.fillInput(`${syrupForm}.maximalDose`, '10')
  await adminPage.fillInput(`${syrupForm}.maximalDosePerKg`, '10')
  await adminPage.fillInput(`${syrupForm}.minimalDosePerKg`, '5')
  await adminPage.fillTextarea(`${syrupForm}.description`, 'one description')
  await adminPage.fillTextarea(
    `${syrupForm}.dispensingDescription`,
    'one dispensing description'
  )
  await adminPage.fillTextarea(
    `${syrupForm}.injectionInstructions`,
    'one injection instructions'
  )

  await adminPage.submitForm()

  await expect(
    await adminPage.page.getByText('Saved successfully')
  ).toBeVisible()
})
