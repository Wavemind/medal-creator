/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/playwright/contexts/baseContext'
import { BasePage } from '@/tests/pages/basePage'

export class DrugsPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/')
    await this.context.page
      .getByRole('link', { name: this.context.projectName })
      .last()
      .click()
    await this.context.page.getByTestId('sidebar-library').click()
    await this.context.page.getByTestId('subMenu-drugs').click()
    await this.checkHeadingIsVisible('Drugs')
  }

  // DRUGS
  canSearchForDrugs = async () => {
    await this.searchForElement('Amo', 'Amox')
  }

  cannotCreateDrug = async () => {
    await expect(
      await this.context.getByTestId('create-drug')
    ).not.toBeVisible()
  }

  cannotUpdateDrug = async () => {
    await this.checkDoesNotHaveMenu()
  }

  cannotDeleteDrug = async () => {
    await this.checkDoesNotHaveMenu()
  }

  canCreateDrug = async () => {
    await this.context.getByTestId('create-drug').click()
    await this.validateDrugForm()

    await this.context.getByTestId('close-modal').click()
    await this.context.getByTestId('create-drug').click()
    await this.createDrugWithTabletFormulation()

    await this.context.getByTestId('create-drug').click()
    await this.createDrugWithSyrupFormulation()
  }

  canUpdateDrug = async () => {
    await this.context.getByTestId('datatable-menu').first().click()
    await this.context.page.getByRole('menuitem', { name: 'Edit' }).click()
    await this.context.fillInput('label', 'updated label')
    await this.context.nextStep()

    await this.context.selectOptionByValue('medicationForm', 'solution')
    await this.context.getByTestId('add-medication-form').click()
    await this.context.page.waitForTimeout(1000)

    // Tablet
    const solutionForm = 'formulationsAttributes[1]'
    await this.context.selectOptionByValue(
      `${solutionForm}.administrationRouteId`,
      '4'
    )

    await this.context.fillInput(`${solutionForm}.dosesPerDay`, '22')
    await this.context.fillInput(`${solutionForm}.liquidConcentration`, '25')
    await this.context.fillInput(`${solutionForm}.doseForm`, '25')
    await this.context.fillInput(`${solutionForm}.maximalDose`, '10')
    await this.context.fillInput(`${solutionForm}.maximalDosePerKg`, '10')
    await this.context.fillInput(`${solutionForm}.minimalDosePerKg`, '5')
    await this.context.fillTextarea(
      `${solutionForm}.description`,
      'one description'
    )
    await this.context.fillTextarea(
      `${solutionForm}.dispensingDescription`,
      'one dispensing description'
    )
    await this.context.fillTextarea(
      `${solutionForm}.injectionInstructions`,
      'one injection instructions'
    )

    await this.context.submitForm()

    await this.checkTextIsVisible('Saved successfully')
  }

  canDeleteDrug = async () => {
    await this.context.getByTestId('datatable-menu').first().click()
    await this.deleteElement()
  }

  // DRUG EXCLUSIONS
  cannotCreateDrugExclusion = async () => {
    await this.openDrugExclusion()
    await expect(
      this.context.page.getByRole('button', { name: 'Add exclusion' })
    ).not.toBeVisible()
  }

  cannotDeleteDrugExclusion = async () => {
    await this.openDrugExclusion()
    await expect(
      this.context.page.getByRole('button', { name: 'Delete' })
    ).not.toBeVisible()
  }

  canCreateDrugExclusion = async () => {
    await this.context.page.getByTestId('datatable-open-node').first().click()
    await this.context.page
      .getByRole('button', { name: 'Add exclusion' })
      .click()

    await this.context.page
      .locator('[id^="react-select-"][id$="-input"]')
      .nth(0)
      .fill('Test tablet drug')
    await this.context.page
      .getByRole('button', { name: 'Test tablet drug' })
      .click()
    await this.context.page.getByRole('button', { name: 'Save' }).click()

    await this.checkTextIsVisible('Loop alert: a node cannot exclude itself!')

    await this.context.page
      .locator('[id^="react-select-"][id$="-input"]')
      .nth(0)
      .fill('panad')
    await this.context.page.getByRole('button', { name: 'Panadol' }).click()

    await this.context.page.getByRole('button', { name: 'Add' }).click()

    await this.context.page
      .locator('[id^="react-select-"][id$="-input"]')
      .nth(1)
      .fill('panad')
    await this.context.page.getByRole('button', { name: 'Panadol' }).click()
    await this.context.page.getByRole('button', { name: 'Save' }).click()

    await this.checkTextIsVisible('This exclusion is already set.')

    await this.context.getByTestId('delete-exclusion').nth(1).click()
    await this.context.page.getByRole('button', { name: 'Save' }).click()

    await this.checkTextIsVisible('Saved successfully')
  }

  canDeleteDrugExclusion = async () => {
    await this.context.page.getByTestId('datatable-open-node').first().click()
    await this.deleteElementInSubrow()
  }

  private openDrugExclusion = async () => {
    await this.context.getByTestId('datatable-open-node').first().click()
    await expect(
      await this.context.page
        .getByTestId('node-exclusion-row')
        .getByRole('cell', { name: 'Panadol' })
    ).toBeVisible()
  }

  private validateDrugForm = async () => {
    await this.context.nextStep()

    await this.checkTextIsVisible('Label is required')

    await this.context.fillInput('label', 'Test label drug')
    await this.context.nextStep()

    await this.context.submitForm()
    await this.checkTextIsVisible(
      'Formulations field must have at least 1 items'
    )

    await this.context.selectOptionByValue('medicationForm', 'tablet')
    await this.context.getByTestId('add-medication-form').click()
    await this.context.page.waitForTimeout(1000)
    await this.context.submitForm()

    // Tablet
    const tabletForm = 'formulationsAttributes[0]'
    await this.checkTextIsVisible('Administration route is required')
    await this.checkTextIsVisible(
      'Number of administrations per day is required'
    )
    await expect(
      await this.context.getCheckbox(`${tabletForm}.byAge`)
    ).toBeVisible()
    await this.checkTextIsVisible('Is the tablet breakable ? is required')
    await expect(
      await this.context.getInput(`${tabletForm}.uniqueDose`)
    ).not.toBeVisible()
    await expect(
      await this.context.getInput(`${tabletForm}.liquidConcentration`)
    ).not.toBeVisible()
    await this.checkTextIsVisible('Total drug formulation volume is required')
    await this.checkTextIsVisible('Maximal daily dose (mg) is required')
    await this.checkTextIsVisible('Minimal dose mg/kg/day is required')
    await this.checkTextIsVisible('Maximal dose mg/kg/day is required')
    await expect(
      await this.context.getTextarea(`${tabletForm}.description`)
    ).toBeVisible()
    await expect(
      await this.context.getTextarea(`${tabletForm}.injectionInstructions`)
    ).not.toBeVisible()
    await expect(
      await this.context.getTextarea(`${tabletForm}.dispensingDescription`)
    ).toBeVisible()
    await this.context.getByTestId('remove-formulations-tablet').click()

    // Syrup
    await this.context.selectOptionByValue('medicationForm', 'syrup')
    await this.context.getByTestId('add-medication-form').click()
    await this.context.page.waitForTimeout(1000)
    await this.context.submitForm()

    const syrupForm = 'formulationsAttributes[0]'
    await this.checkTextIsVisible('Concentration (mg in dose) is required')
    await this.context.page.getByText('Fixed-dose administrations').click()
    await this.context.submitForm()
    await this.checkTextIsVisible(
      'Number of applications per administration is required'
    )
    await expect(
      await this.context.getInput(`${syrupForm}.doseForm`)
    ).not.toBeVisible()
    await expect(
      await this.context.getInput(`${syrupForm}.maximalDose`)
    ).not.toBeVisible()
    await expect(
      await this.context.getInput(`${syrupForm}.minimalDosePerKg`)
    ).not.toBeVisible()
    await expect(
      await this.context.getInput(`${syrupForm}.maximalDosePerKg`)
    ).not.toBeVisible()
  }

  private createDrugWithTabletFormulation = async () => {
    await this.context.fillInput('label', 'Test tablet drug')
    await this.context.nextStep()

    await this.context.selectOptionByValue('medicationForm', 'tablet')
    await this.context.getByTestId('add-medication-form').click()
    await this.context.page.waitForTimeout(1000)

    const tabletForm = 'formulationsAttributes[0]'
    await this.context.selectOptionByValue(
      `${tabletForm}.administrationRouteId`,
      '1'
    )
    await this.context.fillInput(`${tabletForm}.dosesPerDay`, '22')
    await this.context.selectOptionByValue(`${tabletForm}.breakable`, 'two')
    await this.context.fillInput(`${tabletForm}.doseForm`, '25')
    await this.context.fillInput(`${tabletForm}.maximalDose`, '10')
    await this.context.fillInput(`${tabletForm}.minimalDosePerKg`, '25')
    await this.context.fillInput(`${tabletForm}.maximalDosePerKg`, '25')

    await this.context.submitForm()

    await this.checkTextIsVisible('Must be less than maximal daily dose')

    await this.context.fillInput(`${tabletForm}.maximalDosePerKg`, '10')

    await this.context.submitForm()

    await this.checkTextIsVisible('Must be less than maximal dose per kg')

    await this.context.fillInput(`${tabletForm}.minimalDosePerKg`, '5')
    await this.context.fillTextarea(
      `${tabletForm}.description`,
      'one description'
    )
    await this.context.fillTextarea(
      `${tabletForm}.dispensingDescription`,
      'one dispensing description'
    )

    await this.context.submitForm()

    await this.checkTextIsVisible('Saved successfully')
  }

  private createDrugWithSyrupFormulation = async () => {
    await this.context.fillInput('label', 'Test syrup drug')
    await this.context.nextStep()

    await this.context.selectOptionByValue('medicationForm', 'syrup')
    await this.context.getByTestId('add-medication-form').click()
    await this.context.page.waitForTimeout(1000)

    // Tablet
    const syrupForm = 'formulationsAttributes[0]'
    await this.context.selectOptionByValue(
      `${syrupForm}.administrationRouteId`,
      '4'
    )

    await this.context.fillInput(`${syrupForm}.dosesPerDay`, '22')
    await this.context.fillInput(`${syrupForm}.liquidConcentration`, '25')
    await this.context.fillInput(`${syrupForm}.doseForm`, '25')
    await this.context.fillInput(`${syrupForm}.maximalDose`, '10')
    await this.context.fillInput(`${syrupForm}.maximalDosePerKg`, '10')
    await this.context.fillInput(`${syrupForm}.minimalDosePerKg`, '5')
    await this.context.fillTextarea(
      `${syrupForm}.description`,
      'one description'
    )
    await this.context.fillTextarea(
      `${syrupForm}.dispensingDescription`,
      'one dispensing description'
    )
    await this.context.fillTextarea(
      `${syrupForm}.injectionInstructions`,
      'one injection instructions'
    )

    await this.context.submitForm()

    await this.checkTextIsVisible('Saved successfully')
  }
}
