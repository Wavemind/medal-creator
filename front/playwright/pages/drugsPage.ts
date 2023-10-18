/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/playwright/contexts/baseContext'
import { BasePage } from '@/playwright/pages/basePage'

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
    await this.clickElementByTestId('sidebar-library')
    await this.clickElementByTestId('subMenu-drugs')
    await this.checkHeadingIsVisible('Drugs')
  }

  // DRUGS
  canSearchForDrugs = async () => {
    await this.searchForElement('Amo', 'Amox')
  }

  cannotCreateDrug = async () => {
    await expect(await this.getElementByTestId('create-drug')).not.toBeVisible()
  }

  cannotUpdateDrug = async () => {
    await this.checkDoesNotHaveMenu()
  }

  cannotDeleteDrug = async () => {
    await this.checkDoesNotHaveMenu()
  }

  canCreateDrug = async () => {
    await this.clickElementByTestId('create-drug')
    await this.validateDrugForm()

    await this.clickElementByTestId('close-modal')
    await this.clickElementByTestId('create-drug')
    await this.createDrugWithTabletFormulation()

    await this.clickElementByTestId('create-drug')
    await this.createDrugWithSyrupFormulation()
  }

  canUpdateDrug = async () => {
    await this.getElementByTestId('datatable-menu').first().click()
    await this.clickMenuItemByText('Edit')
    await this.form.fillInput('label', 'updated label')
    await this.form.nextStep()

    await this.form.selectOptionByValue('medicationForm', 'solution')
    await this.clickElementByTestId('add-medication-form')
    await this.context.page.waitForTimeout(1000)

    // Tablet
    const solutionForm = 'formulationsAttributes[1]'
    await this.form.selectOptionByValue(
      `${solutionForm}.administrationRouteId`,
      '4'
    )

    await this.form.fillInput(`${solutionForm}.dosesPerDay`, '22')
    await this.form.fillInput(`${solutionForm}.liquidConcentration`, '25')
    await this.form.fillInput(`${solutionForm}.doseForm`, '25')
    await this.form.fillInput(`${solutionForm}.maximalDose`, '10')
    await this.form.fillInput(`${solutionForm}.maximalDosePerKg`, '10')
    await this.form.fillInput(`${solutionForm}.minimalDosePerKg`, '5')
    await this.form.fillTextarea(
      `${solutionForm}.description`,
      'one description'
    )
    await this.form.fillTextarea(
      `${solutionForm}.dispensingDescription`,
      'one dispensing description'
    )
    await this.form.fillTextarea(
      `${solutionForm}.injectionInstructions`,
      'one injection instructions'
    )

    await this.form.submitForm()

    await this.checkTextIsVisible('Saved successfully')
  }

  canDeleteDrug = async () => {
    await this.getElementByTestId('datatable-menu').first().click()
    await this.deleteElement()
  }

  // DRUG EXCLUSIONS
  cannotCreateDrugExclusion = async () => {
    await this.openDrugExclusion()
    await expect(this.getButtonByText('Add exclusion')).not.toBeVisible()
  }

  cannotDeleteDrugExclusion = async () => {
    await this.openDrugExclusion()
    await expect(this.getButtonByText('Delete')).not.toBeVisible()
  }

  canCreateDrugExclusion = async () => {
    await this.getElementByTestId('datatable-open-node').first().click()
    await this.clickButtonByText('Add exclusion')

    await this.context.page
      .locator('[id^="react-select-"][id$="-input"]')
      .nth(0)
      .fill('Test tablet drug')
    await this.clickButtonByText('Test tablet drug')
    await this.clickButtonByText('Save')

    await this.checkTextIsVisible('Loop alert: a node cannot exclude itself!')

    await this.context.page
      .locator('[id^="react-select-"][id$="-input"]')
      .first()
      .fill('panad')
    await this.clickButtonByText('Panadol')

    await this.clickButtonByText('Add')

    await this.context.page
      .locator('[id^="react-select-"][id$="-input"]')
      .nth(1)
      .fill('panad')
    await this.clickButtonByText('Panadol')
    await this.clickButtonByText('Save')

    await this.checkTextIsVisible('This exclusion is already set.')

    await this.getElementByTestId('delete-exclusion').nth(1).click()
    await this.clickButtonByText('Save')

    await this.checkTextIsVisible('Saved successfully')
  }

  canDeleteDrugExclusion = async () => {
    await this.getElementByTestId('datatable-open-node').first().click()
    await this.deleteElementInSubrow()
  }

  private openDrugExclusion = async () => {
    await this.getElementByTestId('datatable-open-node').first().click()
    await expect(
      await this.context.page
        .getByTestId('node-exclusion-row')
        .getByRole('cell', { name: 'Panadol' })
    ).toBeVisible()
  }

  private validateDrugForm = async () => {
    await this.form.nextStep()

    await this.checkTextIsVisible('Label is required')

    await this.form.fillInput('label', 'Test label drug')
    await this.form.nextStep()

    await this.form.submitForm()
    await this.checkTextIsVisible(
      'Formulations field must have at least 1 items'
    )

    await this.form.selectOptionByValue('medicationForm', 'tablet')
    await this.clickElementByTestId('add-medication-form')
    await this.context.page.waitForTimeout(1000)
    await this.form.submitForm()

    // Tablet
    const tabletForm = 'formulationsAttributes[0]'
    await this.checkTextIsVisible('Administration route is required')
    await this.checkTextIsVisible(
      'Number of administrations per day is required'
    )
    await expect(
      await this.form.getCheckbox(`${tabletForm}.byAge`)
    ).toBeVisible()
    await this.checkTextIsVisible('Is the tablet breakable ? is required')
    await expect(
      await this.form.getInput(`${tabletForm}.uniqueDose`)
    ).not.toBeVisible()
    await expect(
      await this.form.getInput(`${tabletForm}.liquidConcentration`)
    ).not.toBeVisible()
    await this.checkTextIsVisible('Total drug formulation volume is required')
    await this.checkTextIsVisible('Maximal daily dose (mg) is required')
    await this.checkTextIsVisible('Minimal dose mg/kg/day is required')
    await this.checkTextIsVisible('Maximal dose mg/kg/day is required')
    await expect(
      await this.form.getTextarea(`${tabletForm}.description`)
    ).toBeVisible()
    await expect(
      await this.form.getTextarea(`${tabletForm}.injectionInstructions`)
    ).not.toBeVisible()
    await expect(
      await this.form.getTextarea(`${tabletForm}.dispensingDescription`)
    ).toBeVisible()
    await this.clickElementByTestId('remove-formulations-tablet')

    // Syrup
    await this.form.selectOptionByValue('medicationForm', 'syrup')
    await this.clickElementByTestId('add-medication-form')
    await this.context.page.waitForTimeout(1000)
    await this.form.submitForm()

    const syrupForm = 'formulationsAttributes[0]'
    await this.checkTextIsVisible('Concentration (mg in dose) is required')
    await this.context.page.getByText('Fixed-dose administrations').click()
    await this.form.submitForm()
    await this.checkTextIsVisible(
      'Number of applications per administration is required'
    )
    await expect(
      await this.form.getInput(`${syrupForm}.doseForm`)
    ).not.toBeVisible()
    await expect(
      await this.form.getInput(`${syrupForm}.maximalDose`)
    ).not.toBeVisible()
    await expect(
      await this.form.getInput(`${syrupForm}.minimalDosePerKg`)
    ).not.toBeVisible()
    await expect(
      await this.form.getInput(`${syrupForm}.maximalDosePerKg`)
    ).not.toBeVisible()
  }

  private createDrugWithTabletFormulation = async () => {
    await this.form.fillInput('label', 'Test tablet drug')
    await this.form.nextStep()

    await this.form.selectOptionByValue('medicationForm', 'tablet')
    await this.clickElementByTestId('add-medication-form')
    await this.context.page.waitForTimeout(1000)

    const tabletForm = 'formulationsAttributes[0]'
    await this.form.selectOptionByValue(
      `${tabletForm}.administrationRouteId`,
      '1'
    )
    await this.form.fillInput(`${tabletForm}.dosesPerDay`, '22')
    await this.form.selectOptionByValue(`${tabletForm}.breakable`, 'two')
    await this.form.fillInput(`${tabletForm}.doseForm`, '25')
    await this.form.fillInput(`${tabletForm}.maximalDose`, '10')
    await this.form.fillInput(`${tabletForm}.minimalDosePerKg`, '25')
    await this.form.fillInput(`${tabletForm}.maximalDosePerKg`, '25')

    await this.form.submitForm()

    await this.checkTextIsVisible('Must be less than maximal daily dose')

    await this.form.fillInput(`${tabletForm}.maximalDosePerKg`, '10')

    await this.form.submitForm()

    await this.checkTextIsVisible('Must be less than maximal dose per kg')

    await this.form.fillInput(`${tabletForm}.minimalDosePerKg`, '5')
    await this.form.fillTextarea(`${tabletForm}.description`, 'one description')
    await this.form.fillTextarea(
      `${tabletForm}.dispensingDescription`,
      'one dispensing description'
    )

    await this.form.submitForm()

    await this.checkTextIsVisible('Saved successfully')
  }

  private createDrugWithSyrupFormulation = async () => {
    await this.form.fillInput('label', 'Test syrup drug')
    await this.form.nextStep()

    await this.form.selectOptionByValue('medicationForm', 'syrup')
    await this.clickElementByTestId('add-medication-form')
    await this.context.page.waitForTimeout(1000)

    // Tablet
    const syrupForm = 'formulationsAttributes[0]'
    await this.form.selectOptionByValue(
      `${syrupForm}.administrationRouteId`,
      '4'
    )

    await this.form.fillInput(`${syrupForm}.dosesPerDay`, '22')
    await this.form.fillInput(`${syrupForm}.liquidConcentration`, '25')
    await this.form.fillInput(`${syrupForm}.doseForm`, '25')
    await this.form.fillInput(`${syrupForm}.maximalDose`, '10')
    await this.form.fillInput(`${syrupForm}.maximalDosePerKg`, '10')
    await this.form.fillInput(`${syrupForm}.minimalDosePerKg`, '5')
    await this.form.fillTextarea(`${syrupForm}.description`, 'one description')
    await this.form.fillTextarea(
      `${syrupForm}.dispensingDescription`,
      'one dispensing description'
    )
    await this.form.fillTextarea(
      `${syrupForm}.injectionInstructions`,
      'one injection instructions'
    )

    await this.form.submitForm()

    await this.checkTextIsVisible('Saved successfully')
  }
}
