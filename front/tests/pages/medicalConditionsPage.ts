/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/playwright/contexts/baseContext'
import { BasePage } from '@/tests/pages/basePage'
import { QuestionsSequenceCategoryEnum } from '@/types'

export class MedicalConditionsPage extends BasePage {
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
    await this.clickElementByTestId('subMenu-medicalConditions')
    await this.checkHeadingIsVisible('Medical conditions')
  }

  // MANAGEMENTS
  canSearchForMedicalConditions = async () => {
    await this.searchForElement('Resp', 'Respiratory Distress')
  }

  cannotCreateMedicalCondition = async () => {
    await expect(
      await this.getElementByTestId('create-medical-condition')
    ).not.toBeVisible()
  }

  cannotUpdateMedicalCondition = async () => {
    await this.checkDoesNotHaveMenu()
  }

  cannotDeleteMedicalCondition = async () => {
    await this.checkDoesNotHaveMenu()
  }

  canCreateMedicalCondition = async () => {
    await this.clickElementByTestId('create-medical-condition')
    await this.form.fillInput('label', 'New medical conditions')
    await this.form.selectOptionByValue(
      'type',
      QuestionsSequenceCategoryEnum.Comorbidity
    )
    await this.form.submitForm()

    await this.checkTextIsVisible('Saved successfully')
  }

  canUpdateMedicalCondition = async () => {
    await this.getElementByTestId('datatable-menu').first().click()
    await this.clickMenuItemByText('Edit')
    await this.form.fillInput('label', 'updated medical conditions')
    await this.form.fillInput('cutOffStart', '1')
    await this.form.fillInput('cutOffEnd', '5')
    await this.form.submitForm()

    await this.checkTextIsVisible('Saved successfully')
  }

  canDeleteMedicalCondition = async () => {
    await this.getElementByTestId('datatable-menu').first().click()
    await this.clickMenuItemByText('Delete')
    await this.clickButtonByText('Yes')
    await this.checkTextIsVisible('Deleted successfully')
  }
}
