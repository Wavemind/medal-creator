/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/playwright/contexts/baseContext'
import { BasePage } from '@/tests/pages/basePage'

export class DecisionTreesPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/')
    await this.context.page
      .getByRole('link', { name: this.context.projectName })
      .last()
      .click()
    await this.clickElementByTestId('sidebar-algorithms')
    await this.context.page
      .getByRole('row', { name: 'First algo' })
      .getByTestId('datatable-show')
      .click()
    await this.checkHeadingIsVisible('Decision trees & Diagnoses')
  }

  // DECISION TREES
  canSearchForDecisionTrees = async () => {
    await this.searchForElement('col', 'Cold')
  }

  cannotCreateDecisionTree = async () => {
    await expect(
      await this.getElementByTestId('create-decision-tree')
    ).not.toBeVisible()
  }

  cannotUpdateDecisionTree = async () => {
    await this.checkDoesNotHaveMenu()
  }

  cannotDuplicateDecisionTree = async () => {
    await this.checkDoesNotHaveMenu()
  }

  cannotDeleteDecisionTree = async () => {
    await this.checkDoesNotHaveMenu()
  }

  canCreateDecisionTree = async (optionId: string) => {
    await this.clickElementByTestId('create-decision-tree')
    await this.form.fillInput('label', 'Test decision tree from front')
    await this.form.selectOptionByValue('nodeId', optionId)
    await this.form.fillInput('cutOffStart', '0')
    await this.form.fillInput('cutOffEnd', '1')
    await this.form.submitForm()

    await this.checkTextIsVisible('Level of urgency')
    await this.form.fillInput('label', 'Test diagnosis')
    await this.form.fillTextarea('description', 'This is a description message')
    await this.form.submitForm()

    await this.clickButtonByText('Edit')
    await this.form.fillInput('label', 'Tested diagnosis')
    await this.form.submitForm()
    await this.clickButtonByText('Add a diagnosis')
    await this.form.fillInput('label', 'Another diagnosis')
    await this.form.submitForm()
    await this.checkTextIsVisible('All diagnoses for decision tree')
    await this.clickButtonByText('Done')
    await this.checkTextIsVisible('Saved successfully')
  }

  canUpdateDecisionTree = async () => {
    await this.getElementByTestId('datatable-menu').last().click()
    await this.clickMenuItemByText('Edit')
    await this.form.fillInput('label', 'Tested decision tree from front')
    await this.form.fillInput('cutOffEnd', '40')
    await this.form.submitForm()
    await this.checkTextIsVisible('Saved successfully')
  }

  canDuplicateDecisionTree = async () => {
    await this.getElementByTestId('datatable-menu').last().click()
    await this.clickMenuItemByText('Duplicate')
    await this.clickButtonByText('Yes')
    await this.checkTextIsVisible('Duplicated successfully')
  }

  canDeleteDecisionTree = async () => {
    await this.getElementByTestId('datatable-menu').last().click()
    await this.deleteElement()
  }

  // DIAGNOSES
  cannotCreateDiagnosis = async () => {
    await this.context.page
      .getByTestId('datatable-open-diagnosis')
      .first()
      .click()
    await expect(
      await this.context.page
        .getByTestId('diagnoses-row')
        .getByRole('cell', { name: 'Diarrhea' })
    ).toBeVisible()
    await expect(this.getButtonByText('Add diagnosis')).not.toBeVisible()
  }

  cannotUpdateDiagnosis = async () => {
    await this.context.page
      .getByTestId('datatable-open-diagnosis')
      .first()
      .click()
    await this.getElementByTestId('datatable-menu').first().click()
    await expect(await this.getMenuItemByText('Edit')).not.toBeVisible()
  }

  cannotDeleteDiagnosis = async () => {
    await this.context.page
      .getByTestId('datatable-open-diagnosis')
      .first()
      .click()
    await this.getElementByTestId('datatable-menu').first().click()
    await expect(await this.getMenuItemByText('Delete')).not.toBeVisible()
  }

  canCreateDiagnosis = async () => {
    await this.context.page
      .getByTestId('datatable-open-diagnosis')
      .last()
      .click()
    await this.clickButtonByText('Add diagnosis')
    await this.form.fillInput('label', 'another diagnosis')
    await this.form.submitForm()
    await this.checkTextIsVisible('Saved successfully')
  }

  canUpdateDiagnosis = async () => {
    await this.context.page
      .getByTestId('datatable-open-diagnosis')
      .last()
      .click()
    await this.context.page
      .getByTestId('diagnosis-row')
      .last()
      .getByTestId('datatable-menu')
      .first()
      .click()
    await this.clickMenuItemByText('Edit')
    await this.context.page.getByLabel('Label *').click()
    await this.form.fillInput('label', 'first diagnosis updated')
    await this.form.submitForm()
    await this.checkTextIsVisible('Saved successfully')
  }

  // TODO : Check this one. Can we ever delete a diagnosis ?
  canDeleteDiagnosis = async () => {
    await this.context.page
      .getByTestId('datatable-open-diagnosis')
      .last()
      .click()

    await this.context.page
      .getByTestId('diagnosis-row')
      .last()
      .getByRole('button')
      .click()

    await expect(this.getMenuItemByText('Delete')).toHaveAttribute(
      'disabled',
      ''
    )
  }

  canViewInfo = async () => {
    await this.context.page
      .getByTestId('datatable-open-diagnosis')
      .first()
      .click()
    await this.context.page
      .getByTestId('diagnoses-row')
      .first()
      .getByTestId('datatable-menu')
      .first()
      .click()
    await this.clickMenuItemByText('Info')
    await this.checkHeadingIsVisible('Cold')
    await this.clickElementByTestId('close-modal')
  }
}
