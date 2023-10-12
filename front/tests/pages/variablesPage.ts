/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/playwright/contexts/baseContext'
import { BasePage } from '@/tests/pages/basePage'

export class VariablesPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/')
    await this.context.page
      .getByRole('link', { name: this.context.projectName })
      .click()
    await this.context.page.getByTestId('sidebar-library').click()
    await expect(
      await this.context.page.getByRole('heading', { name: 'Variables' })
    ).toBeVisible()
  }

  canSearchForVariables = async () => {
    await this.context.searchFor('Cough', 'Cough')
    await this.context.searchFor('toto', 'No data available')
  }

  cannotCreateVariable = async () => {
    await expect(
      await this.context.getByTestId('create-variable')
    ).not.toBeVisible()
  }

  cannotUpdateVariable = async () => {
    await this.context.getByTestId('datatable-menu').first().click()
    await expect(
      await this.context.page.getByRole('menuitem', { name: 'Edit' })
    ).not.toBeVisible()
  }

  cannotDuplicateVariable = async () => {
    await this.context.getByTestId('datatable-menu').first().click()
    await expect(
      await this.context.page.getByRole('menuitem', { name: 'Duplicate' })
    ).not.toBeVisible()
  }

  cannotDeleteVariable = async () => {
    await this.context.getByTestId('datatable-menu').first().click()
    await expect(
      await this.context.page.getByRole('menuitem', { name: 'Delete' })
    ).not.toBeVisible()
  }

  canViewInfo = async () => {
    await this.context.getByTestId('datatable-menu').first().click()
    await this.context.page.getByRole('menuitem', { name: 'Info' }).click()
    await expect(await this.context.page.getByText('Fever')).toBeVisible()
    await this.context.getByTestId('close-modal').click()
  }

  canCreateVariable = async () => {
    await expect(
      await this.context.getByTestId('create-algorithm')
    ).toBeVisible()
    await this.context.getByTestId('create-algorithm').click()
    await this.context.fillInput('name', 'Test algorithm')
    await this.context.fillInput('ageLimit', '4')
    await this.context.fillTextarea(
      'ageLimitMessage',
      'This is a test age limit message'
    )
    await this.context.fillInput('minimumAge', '2')
    await this.context.selectOptionByValue('mode', 'arm_control')
    await this.context.fillTextarea('description', 'This is a test description')

    await this.context.page
      .locator('label')
      .filter({ hasText: 'French' })
      .locator('span')
      .first()
      .click()

    await this.submitForm()
    await expect(
      await this.context.page.getByText('Saved successfully')
    ).toBeVisible()
  }

  canUpdateVariable = async (description: string) => {
    await this.context.fillTextarea('description', description)
    await this.submitForm()

    await expect(
      await this.context.page.getByText('Saved successfully')
    ).toBeVisible()
  }

  canArchiveVariable = async () => {
    await expect(
      await this.context.getByTestId('create-algorithm')
    ).toBeVisible()
    await this.context.getByTestId('create-algorithm').click()
    await this.context.fillInput('name', 'test archive')
    await this.context.fillTextarea('ageLimitMessage', 'a message')
    await this.context.fillInput('ageLimit', '3')
    await this.context.fillInput('minimumAge', '2')
    await this.context.selectOptionByValue('mode', 'arm_control')
    await this.context.fillTextarea('description', 'This is a test description')
    await this.submitForm()

    await this.context.page.waitForTimeout(500)

    await this.context.fillInput('search', 'test archive')

    await this.context.page.getByTestId('datatable-menu').first().click()
    await this.context.page.getByRole('menuitem', { name: 'Archive' }).click()
    await this.context.page.getByRole('button', { name: 'Yes' }).click()
    await expect(
      await this.context.page.getByText('Archived successfully')
    ).toBeVisible()
  }
}
