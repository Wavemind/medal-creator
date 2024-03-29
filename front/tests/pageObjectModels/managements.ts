/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/tests/contexts/baseContext'
import { BasePage } from '@/tests/pageObjectModels/base'

export class ManagementsPage extends BasePage {
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
    await this.clickElementByTestId('subMenu-managements')
    await this.checkHeadingIsVisible('Managements')
  }

  // MANAGEMENTS
  canSearchForManagements = async () => {
    await this.searchForElement('refer', 'M1 refer')
  }

  cannotCreateManagement = async () => {
    await expect(
      await this.getElementByTestId('create-management')
    ).not.toBeVisible()
  }

  cannotUpdateManagement = async () => {
    await this.checkDoesNotHaveMenu()
  }

  cannotDeleteManagement = async () => {
    await this.checkDoesNotHaveMenu()
  }

  canCreateManagement = async () => {
    await this.clickElementByTestId('create-management')
    await this.form.fillInput('label', 'New management')
    await this.form.submitForm()

    await this.checkTextIsVisible('Saved successfully')
  }

  canUpdateManagement = async () => {
    await this.getElementByTestId('datatable-menu').first().click()
    await this.clickMenuItemByText('Edit')
    await this.form.fillInput('label', 'updated management label')
    await this.form.submitForm()

    await this.checkTextIsVisible('Saved successfully')
  }

  canDeleteManagement = async () => {
    await this.getElementByTestId('datatable-menu').first().click()
    await this.deleteElement()
  }

  // MANAGEMENT EXCLUSIONS
  cannotCreateManagementExclusion = async () => {
    await this.openManagementExclusion()
    await expect(this.getButtonByText('Add exclusion')).not.toBeVisible()
  }

  cannotDeleteManagementExclusion = async () => {
    await this.openManagementExclusion()
    await expect(this.getButtonByText('Delete')).not.toBeVisible()
  }

  canCreateManagementExclusion = async () => {
    await this.getElementByTestId('datatable-open-node').first().click()
    await this.clickButtonByText('Add exclusion')

    await this.context.page
      .locator('[id^="react-select-"][id$="-input"]')
      .first()
      .fill('new')
    await this.clickOptionByText('New management')
    await this.clickButtonByText('Save')
    await this.checkTextIsVisible('Loop alert: a node cannot exclude itself!')

    await this.context.page
      .locator('[id^="react-select-"][id$="-input"]')
      .first()
      .fill('refer')
    await this.clickOptionByText('refer')

    await this.clickButtonByText('Save')
    await this.checkTextIsVisible('Saved successfully')
  }

  canDeleteManagementExclusion = async () => {
    await this.getElementByTestId('datatable-open-node').last().click()
    await this.deleteElementInSubrow()
  }

  private openManagementExclusion = async () => {
    await this.getElementByTestId('datatable-open-node').last().click()
    await expect(
      await this.context.page
        .getByTestId('node-exclusion-row')
        .getByRole('cell', { name: 'advise' })
    ).toBeVisible()
  }
}
