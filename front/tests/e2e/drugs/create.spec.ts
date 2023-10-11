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
  await adminContext.getByTestId('create-drug').click()
})

test('should validate drug form', async ({ adminContext }) => {
  await adminContext.nextStep()

  await expect(
    await adminContext.page.getByText('Label is required')
  ).toBeVisible()

  await adminContext.fillInput('label', 'Test label drug')
  await adminContext.nextStep()

  await adminContext.submitForm()
  await expect(
    await adminContext.page.getByText(
      'Formulations field must have at least 1 items'
    )
  ).toBeVisible()

  await adminContext.selectOptionByValue('medicationForm', 'tablet')
  await adminContext.getByTestId('add-medication-form').click()
  await adminContext.page.waitForTimeout(1000)
  await adminContext.submitForm()

  // Tablet
  const tabletForm = 'formulationsAttributes[0]'
  await expect(
    await adminContext.page.getByText('Administration route is required')
  ).toBeVisible()
  await expect(
    await adminContext.page.getByText(
      'Number of administrations per day is required'
    )
  ).toBeVisible()
  await expect(
    await adminContext.getCheckbox(`${tabletForm}.byAge`)
  ).toBeVisible()
  await expect(
    await adminContext.page.getByText('Is the tablet breakable ? is required')
  ).toBeVisible()
  await expect(
    await adminContext.getInput(`${tabletForm}.uniqueDose`)
  ).not.toBeVisible()
  await expect(
    await adminContext.getInput(`${tabletForm}.liquidConcentration`)
  ).not.toBeVisible()
  await expect(
    await adminContext.page.getByText(
      'Total drug formulation volume is required'
    )
  ).toBeVisible()
  await expect(
    await adminContext.page.getByText('Maximal daily dose (mg) is required')
  ).toBeVisible()
  await expect(
    await adminContext.page.getByText('Minimal dose mg/kg/day is required')
  ).toBeVisible()
  await expect(
    await adminContext.page.getByText('Maximal dose mg/kg/day is required')
  ).toBeVisible()
  await expect(
    await adminContext.getTextarea(`${tabletForm}.description`)
  ).toBeVisible()
  await expect(
    await adminContext.getTextarea(`${tabletForm}.injectionInstructions`)
  ).not.toBeVisible()
  await expect(
    await adminContext.getTextarea(`${tabletForm}.dispensingDescription`)
  ).toBeVisible()
  await adminContext.getByTestId('remove-formulations-tablet').click()

  // Syrup
  await adminContext.selectOptionByValue('medicationForm', 'syrup')
  await adminContext.getByTestId('add-medication-form').click()
  await adminContext.page.waitForTimeout(1000)
  await adminContext.submitForm()

  const syrupForm = 'formulationsAttributes[0]'
  await expect(
    await adminContext.page.getByText('Concentration (mg in dose) is required')
  ).toBeVisible()
  await adminContext.page.getByText('Fixed-dose administrations').click()
  await adminContext.submitForm()
  await expect(
    await adminContext.page.getByText(
      'Number of applications per administration is required'
    )
  ).toBeVisible()
  await expect(
    await adminContext.getInput(`${syrupForm}.doseForm`)
  ).not.toBeVisible()
  await expect(
    await adminContext.getInput(`${syrupForm}.maximalDose`)
  ).not.toBeVisible()
  await expect(
    await adminContext.getInput(`${syrupForm}.minimalDosePerKg`)
  ).not.toBeVisible()
  await expect(
    await adminContext.getInput(`${syrupForm}.maximalDosePerKg`)
  ).not.toBeVisible()
})

test('should create a drug with one tablet formulation', async ({
  adminContext,
}) => {
  await adminContext.fillInput('label', 'Test tablet drug')
  await adminContext.nextStep()

  await adminContext.selectOptionByValue('medicationForm', 'tablet')
  await adminContext.getByTestId('add-medication-form').click()
  await adminContext.page.waitForTimeout(1000)

  const tabletForm = 'formulationsAttributes[0]'
  await adminContext.selectOptionByValue(
    `${tabletForm}.administrationRouteId`,
    '1'
  )
  await adminContext.fillInput(`${tabletForm}.dosesPerDay`, '22')
  await adminContext.selectOptionByValue(`${tabletForm}.breakable`, 'two')
  await adminContext.fillInput(`${tabletForm}.doseForm`, '25')
  await adminContext.fillInput(`${tabletForm}.maximalDose`, '10')
  await adminContext.fillInput(`${tabletForm}.minimalDosePerKg`, '25')
  await adminContext.fillInput(`${tabletForm}.maximalDosePerKg`, '25')

  await adminContext.submitForm()

  await expect(
    await adminContext.page.getByText('Must be less than maximal daily dose')
  ).toBeVisible()

  await adminContext.fillInput(`${tabletForm}.maximalDosePerKg`, '10')

  await adminContext.submitForm()

  await expect(
    await adminContext.page.getByText('Must be less than maximal dose per kg')
  ).toBeVisible()

  await adminContext.fillInput(`${tabletForm}.minimalDosePerKg`, '5')
  await adminContext.fillTextarea(
    `${tabletForm}.description`,
    'one description'
  )
  await adminContext.fillTextarea(
    `${tabletForm}.dispensingDescription`,
    'one dispensing description'
  )

  await adminContext.submitForm()

  await expect(
    await adminContext.page.getByText('Saved successfully')
  ).toBeVisible()
})

test('should create a drug with one syrup formulation', async ({
  adminContext,
}) => {
  await adminContext.fillInput('label', 'Test syrup drug')
  await adminContext.nextStep()

  await adminContext.selectOptionByValue('medicationForm', 'syrup')
  await adminContext.getByTestId('add-medication-form').click()
  await adminContext.page.waitForTimeout(1000)

  // Tablet
  const syrupForm = 'formulationsAttributes[0]'
  await adminContext.selectOptionByValue(
    `${syrupForm}.administrationRouteId`,
    '4'
  )

  await adminContext.fillInput(`${syrupForm}.dosesPerDay`, '22')
  await adminContext.fillInput(`${syrupForm}.liquidConcentration`, '25')
  await adminContext.fillInput(`${syrupForm}.doseForm`, '25')
  await adminContext.fillInput(`${syrupForm}.maximalDose`, '10')
  await adminContext.fillInput(`${syrupForm}.maximalDosePerKg`, '10')
  await adminContext.fillInput(`${syrupForm}.minimalDosePerKg`, '5')
  await adminContext.fillTextarea(`${syrupForm}.description`, 'one description')
  await adminContext.fillTextarea(
    `${syrupForm}.dispensingDescription`,
    'one dispensing description'
  )
  await adminContext.fillTextarea(
    `${syrupForm}.injectionInstructions`,
    'one injection instructions'
  )

  await adminContext.submitForm()

  await expect(
    await adminContext.page.getByText('Saved successfully')
  ).toBeVisible()
})
