/**
 * The internal imports
 */
import { BaseContext } from '@/playwright/contexts/baseContext'

export class BasePage {
  readonly context: BaseContext

  constructor(context: BaseContext) {
    this.context = context
  }

  // Open the user menu and click on Edit
  openEditForm = async (): Promise<void> => {
    await this.context.page.getByTestId('datatable-menu').first().click()
    await this.context.page.getByRole('menuitem', { name: 'Edit' }).click()
  }

  // Submit a form by clicking a submit button
  submitForm = async (): Promise<void> => {
    const submitButton = this.context.page.locator('button[type="submit"]')
    await submitButton.click()
  }

  clickOnFirstRowShow = async () => {
    this.context.page.getByTestId('datatable-show').first().click()
  }
}
