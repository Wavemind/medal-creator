/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/tests/contexts/baseContext'
import { BasePage } from '@/tests/pageObjectModels/base'

export class DiagnosesExclusionsPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigateToDiagnosesExclusions = async () => {
    await this.context.page.goto('/')
    await this.context.page
      .getByRole('link', { name: this.context.projectName })
      .last()
      .click()
    await this.clickElementByTestId('sidebar-algorithms')
    await this.clickOnFirstAlgo()
    await this.clickElementByTestId('subMenu-diagnosis_exclusions')
    await this.checkHeadingIsVisible('Diagnoses exclusions')
  }

  cannotAddExclusion = async () => {
    await expect(
      await this.form.getInputById('excludingDiagnosis')
    ).not.toBeVisible()
    await expect(
      await this.form.getInputById('excludedDiagnosis')
    ).not.toBeVisible()
  }

  cannotDeleteExclusion = async () => {
    await expect(
      await this.getElementByTestId('delete-diagnosis-exclusion')
    ).not.toBeVisible()
  }

  canSearchForDiagnosisExclusions = async () => {
    await this.searchForElement('col', 'Cold')
  }

  canAddExclusion = async () => {
    await expect(
      await this.form.getInputById('excludingDiagnosis')
    ).toBeVisible()
    await expect(
      await this.form.getInputById('excludedDiagnosis')
    ).toBeVisible()

    await this.form.getInputById('excludingDiagnosis').click()
    await this.clickOptionByText('DI2 - Diarrhea')
    await this.form.getInputById('excludedDiagnosis').click()
    await this.clickOptionByText('DI1 - Cold')
    await this.clickButtonByText('Add')
    await this.checkTextIsVisible('This exclusion is already set.')

    await this.form.getInputById('excludingDiagnosis').click()
    await this.clickOptionByText('DI1 - Cold')
    await this.form.getInputById('excludedDiagnosis').click()
    await this.clickOptionByText('DI2  - Diarrhea')
    await this.clickButtonByText('Add')
    await this.checkTextIsVisible('Loop alert: a node cannot exclude itself!')

    await this.form.getInputById('excludingDiagnosis').click()
    await this.clickOptionByText('DI3 - HIV')
    await this.form.getInputById('excludedDiagnosis').click()
    await this.clickOptionByText('DI4 - Gastro')
    await this.clickButtonByText('Add')
    await this.checkTextIsVisible('Saved successfully')
  }

  canDeleteExclusion = async () => {
    await expect(
      await this.getElementByTestId('delete-diagnosis-exclusion').last()
    ).toBeVisible()
    await this.getElementByTestId('delete-diagnosis-exclusion').last().click()
    await this.clickButtonByText('Yes')
    await this.checkTextIsVisible('Deleted successfully')
  }
}
