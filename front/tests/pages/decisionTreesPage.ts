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
      .click()
    await this.context.page.getByTestId('sidebar-algorithms').click()
    await this.context.page.getByTestId('datatable-show').first().click()
    await expect(
      await this.context.page.getByRole('heading', {
        name: 'Decision trees & Diagnoses',
      })
    ).toBeVisible()
  }

  // DECISION TREES
  canSearchForDecisionTrees = async () => {
    await this.context.searchFor('col', 'Cold')
    await this.context.searchFor('toto', 'No data available')
  }

  cannotCreateDecisionTree = async () => {
    await expect(
      await this.context.getByTestId('create-decision-tree')
    ).not.toBeVisible()
  }

  cannotUpdateDecisionTree = async () => {
    await expect(
      await this.context.getByTestId('datatable-menu').first()
    ).not.toBeVisible()
  }

  cannotDuplicateDecisionTree = async () => {
    await expect(
      await this.context.getByTestId('datatable-menu').first()
    ).not.toBeVisible()
  }

  cannotDeleteDecisionTree = async () => {
    await expect(
      await this.context.getByTestId('datatable-menu').first()
    ).not.toBeVisible()
  }

  canCreateDecisionTree = async () => {
    await this.context.getByTestId('create-decision-tree').click()
    await this.context.fillInput('label', 'Test decision tree from front')
    await this.context.selectOptionByValue('nodeId', '42')
    await this.context.fillInput('cutOffStart', '0')
    await this.context.fillInput('cutOffEnd', '1')
    await this.context.submitForm()

    await expect(
      await this.context.page.getByText('Level of urgency')
    ).toBeVisible()
    await this.context.fillInput('label', 'Test diagnosis')
    await this.context.fillTextarea(
      'description',
      'This is a description message'
    )
    await this.context.submitForm()

    await this.context.page.getByRole('button', { name: 'Edit' }).click()
    await this.context.fillInput('label', 'Tested diagnosis')
    await this.context.submitForm()
    await this.context.page
      .getByRole('button', { name: 'Add a diagnosis' })
      .click()
    await this.context.fillInput('label', 'Another diagnosis')
    await this.context.submitForm()
    await this.context.page.getByRole('button', { name: 'Done' }).click()
    await expect(
      await this.context.page.getByText('Saved successfully')
    ).toBeVisible()
  }

  canUpdateDecisionTree = async () => {
    await this.context.getByTestId('datatable-menu').last().click()
    await this.context.page.getByRole('menuitem', { name: 'Edit' }).click()
    await this.context.fillInput('label', 'Tested decision tree from front')
    await this.context.fillInput('cutOffEnd', '40')
    await this.context.submitForm()
    await expect(
      await this.context.page.getByText('Saved successfully')
    ).toBeVisible()
  }

  canDuplicateDecisionTree = async () => {
    await this.context.getByTestId('datatable-menu').last().click()
    await this.context.page.getByRole('menuitem', { name: 'Duplicate' }).click()
    await this.context.page.getByRole('button', { name: 'Yes' }).click()
    await expect(
      await this.context.page.getByText('Duplicated successfully')
    ).toBeVisible()
  }

  canDeleteDecisionTree = async () => {
    await this.context.getByTestId('datatable-menu').last().click()
    await this.context.page.getByRole('menuitem', { name: 'Delete' }).click()
    await this.context.page.getByRole('button', { name: 'Yes' }).click()
    await expect(
      await this.context.page.getByText('Deleted successfully')
    ).toBeVisible()
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
    await expect(
      this.context.page.getByRole('button', { name: 'Add diagnosis' })
    ).not.toBeVisible()
  }

  cannotUpdateDiagnosis = async () => {
    await this.context.page
      .getByTestId('datatable-open-diagnosis')
      .first()
      .click()
    await this.context.getByTestId('datatable-menu').first().click()
    await expect(
      await this.context.page.getByRole('menuitem', { name: 'Edit' })
    ).not.toBeVisible()
  }

  cannotDeleteDiagnosis = async () => {
    await this.context.page
      .getByTestId('datatable-open-diagnosis')
      .first()
      .click()
    await this.context.getByTestId('datatable-menu').first().click()
    await expect(
      await this.context.page.getByRole('menuitem', { name: 'Delete' })
    ).not.toBeVisible()
  }

  canCreateDiagnosis = async () => {
    await this.context.page
      .getByTestId('datatable-open-diagnosis')
      .last()
      .click()
    await this.context.page
      .getByRole('button', { name: 'Add diagnosis' })
      .click()
    await this.context.fillInput('label', 'another diagnosis')
    await this.context.submitForm()
    await expect(
      await this.context.page.getByText('Saved successfully')
    ).toBeVisible()
  }

  canUpdateDiagnosis = async () => {
    await this.context.page
      .getByTestId('datatable-open-diagnosis')
      .last()
      .click()
    await this.context
      .getByTestId('diagnosis-row')
      .last()
      .getByTestId('datatable-menu')
      .first()
      .click()
    await this.context.page.getByRole('menuitem', { name: 'Edit' }).click()
    await this.context.page.getByLabel('Label *').click()
    await this.context.fillInput('label', 'first diagnosis updated')
    await this.context.submitForm()
    await expect(
      await this.context.page.getByText('Saved successfully')
    ).toBeVisible()
  }

  canDeleteDiagnosis = async () => {
    await this.context.page
      .getByTestId('datatable-open-diagnosis')
      .last()
      .click()

    await this.context
      .getByTestId('diagnosis-row')
      .last()
      .getByRole('button')
      .click()

    await expect(
      this.context.page.getByRole('menuitem', { name: 'Delete' })
    ).toHaveAttribute('disabled', '')
  }

  canViewInfo = async () => {
    await this.context.page
      .getByTestId('datatable-open-diagnosis')
      .first()
      .click()
    await this.context
      .getByTestId('diagnoses-row')
      .first()
      .getByTestId('datatable-menu')
      .first()
      .click()
    await this.context.page.getByRole('menuitem', { name: 'Info' }).click()
    await expect(
      await this.context.page.getByRole('heading', { name: 'Cold' })
    ).toBeVisible()
    await this.context.getByTestId('close-modal').click()
  }
}
