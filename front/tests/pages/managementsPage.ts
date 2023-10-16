/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/playwright/contexts/baseContext'
import { BasePage } from '@/tests/pages/basePage'

export class ManagementsPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/')
    await this.context.page
      .getByRole('link', { name: this.context.projectName })
      .click()
    await this.context.page.getByTestId('sidebar-library').click()
    await this.context.page.getByTestId('subMenu-managements').click()
    await expect(
      await this.context.page.getByRole('heading', { name: 'Managements' })
    ).toBeVisible()
  }

  // MANAGEMENTS
  canSearchForManagements = async () => {
    await this.context.searchFor('refer', 'M2 refer')
    await this.context.searchFor('toto', 'No data available')
  }

  cannotCreateManagement = async () => {
    await expect(
      await this.context.getByTestId('create-management')
    ).not.toBeVisible()
  }

  cannotUpdateManagement = async () => {
    await expect(
      await this.context.getByTestId('datatable-menu')
    ).not.toBeVisible()
  }

  cannotDeleteManagement = async () => {
    await expect(
      await this.context.getByTestId('datatable-menu')
    ).not.toBeVisible()
  }

  canCreateManagement = async () => {
    await this.context.getByTestId('create-management').click()
    await this.context.fillInput('label', 'New management')
    await this.context.submitForm()

    await expect(
      await this.context.page.getByText('Saved successfully')
    ).toBeVisible()
  }

  canUpdateManagement = async () => {
    await this.context.getByTestId('datatable-menu').first().click()
    await this.context.page.getByRole('menuitem', { name: 'Edit' }).click()
    await this.context.fillInput('label', 'updated management label')
    await this.context.submitForm()

    await expect(
      await this.context.page.getByText('Saved successfully')
    ).toBeVisible()
  }

  canDestroyManagement = async () => {
    await this.context.getByTestId('datatable-menu').first().click()
    await this.context.page.getByRole('menuitem', { name: 'Delete' }).click()
    await this.context.page.getByRole('button', { name: 'Yes' }).click()
    await expect(
      await this.context.page.getByText('Deleted successfully')
    ).toBeVisible()
  }

  // MANAGEMENT EXCLUSIONS
  cannotCreateManagementExclusion = async () => {
    await this.openManagementExclusion()
    await expect(
      this.context.page.getByRole('button', { name: 'Add exclusion' })
    ).not.toBeVisible()
  }

  cannotDestroyManagementExclusion = async () => {
    await this.openManagementExclusion()
    await expect(
      this.context.page.getByRole('button', { name: 'Delete' })
    ).not.toBeVisible()
  }

  canCreateManagementExclusion = async () => {
    await this.context.page.getByTestId('datatable-open-node').first().click()
    await this.context.page
      .getByRole('button', { name: 'Add exclusion' })
      .click()

    await this.context.page
      .locator('[id^="react-select-"][id$="-input"]')
      .first()
      .fill('new')
    await this.context.page
      .getByRole('button', { name: 'New management' })
      .click()
    await this.context.getButtonByText('Save').click()
    await expect(
      await this.context.page.getByText(
        'Loop alert: a node cannot exclude itself!'
      )
    ).toBeVisible()

    await this.context.page
      .locator('[id^="react-select-"][id$="-input"]')
      .first()
      .fill('refer')
    await this.context.page.getByRole('button', { name: 'refer' }).click()

    await this.context.getButtonByText('Save').click()
    await expect(
      await this.context.page.getByText('Saved successfully')
    ).toBeVisible()
  }

  canDestroyManagementExclusion = async () => {
    await this.context.page.getByTestId('datatable-open-node').first().click()
    await this.context.page
      .getByRole('button', { name: 'Delete' })
      .first()
      .click()
    await this.context.getByTestId('dialog-accept').click()

    await expect(
      await this.context.page.getByText('Deleted successfully')
    ).toBeVisible()
  }

  private openManagementExclusion = async () => {
    await this.context.getByTestId('datatable-open-node').first().click()
    await expect(
      await this.context.page
        .getByTestId('node-exclusion-row')
        .getByRole('cell', { name: 'advise' })
    ).toBeVisible()
  }
}
