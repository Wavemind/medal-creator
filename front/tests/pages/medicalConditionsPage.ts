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
      .click()
    await this.context.page.getByTestId('sidebar-library').click()
    await this.context.page.getByTestId('subMenu-medicalConditions').click()
    await expect(
      await this.context.page.getByRole('heading', {
        name: 'Medical conditions',
      })
    ).toBeVisible()
  }

  // MANAGEMENTS
  canSearchForMedicalConditions = async () => {
    await this.context.searchFor('Resp', 'Respiratory Distress')
    await this.context.searchFor('toto', 'No data available')
  }

  cannotCreateMedicalCondition = async () => {
    await expect(
      await this.context.getByTestId('create-medical-condition')
    ).not.toBeVisible()
  }

  cannotUpdateMedicalCondition = async () => {
    await expect(
      await this.context.getByTestId('datatable-menu')
    ).not.toBeVisible()
  }

  cannotDeleteMedicalCondition = async () => {
    await expect(
      await this.context.getByTestId('datatable-menu')
    ).not.toBeVisible()
  }

  canCreateMedicalCondition = async () => {
    await this.context.getByTestId('create-medical-condition').click()
    await this.context.fillInput('label', 'New medical conditions')
    await this.context.selectOptionByValue(
      'type',
      QuestionsSequenceCategoryEnum.Comorbidity
    )
    await this.context.submitForm()

    await expect(
      await this.context.page.getByText('Saved successfully')
    ).toBeVisible()
  }

  canUpdateMedicalCondition = async () => {
    await this.context.getByTestId('datatable-menu').first().click()
    await this.context.page.getByRole('menuitem', { name: 'Edit' }).click()
    await this.context.fillInput('label', 'updated medical conditions')
    await this.context.fillInput('cutOffStart', '1')
    await this.context.fillInput('cutOffEnd', '5')
    await this.context.submitForm()

    await expect(
      await this.context.page.getByText('Saved successfully')
    ).toBeVisible()
  }

  canDestroyMedicalCondition = async () => {
    await this.context.getByTestId('datatable-menu').first().click()
    await this.context.page.getByRole('menuitem', { name: 'Delete' }).click()
    await this.context.page.getByRole('button', { name: 'Yes' }).click()
    await expect(
      await this.context.page.getByText('Deleted successfully')
    ).toBeVisible()
  }
}
