/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/playwright/contexts/baseContext'

export class BasePage {
  readonly context: BaseContext

  constructor(context: BaseContext) {
    this.context = context
  }

  // *************** Commonly used checks *************** //

  // Check if heading is visible
  checkHeadingIsVisible = async (name: string) => {
    await expect(
      await this.context.page.getByRole('heading', { name })
    ).toBeVisible()
  }

  // Check if a specific text is visible on the screen
  checkTextIsVisible = async (text: string, options = {}) => {
    await expect(await this.context.page.getByText(text, options)).toBeVisible()
  }

  // Check that the datatable does not have a menu
  checkDoesNotHaveMenu = async () => {
    await expect(
      await this.context.getByTestId('datatable-menu').first()
    ).not.toBeVisible()
  }

  // *************** Commonly used utility functions *************** //

  // Open the user menu and click on Edit
  openEditForm = async (): Promise<void> => {
    await this.context.page.getByTestId('datatable-menu').first().click()
    await this.context.page.getByRole('menuitem', { name: 'Edit' }).click()
  }

  // Search for an existing element, and an inexistant element
  searchForElement = async (searchTerm: string, foundText: string) => {
    await this.context.searchFor(searchTerm, foundText)
    await this.context.searchFor('toto', 'No data available')
  }

  // Submit a form by clicking a submit button
  submitForm = async (): Promise<void> => {
    const submitButton = this.context.page.locator('button[type="submit"]')
    await submitButton.click()
  }

  // Clicks on the show button on the first row of a datatable
  clickOnFirstRowShow = async () => {
    this.context.page.getByTestId('datatable-show').first().click()
  }

  // Click on "Delete" in the menu, and then confirm in the dialog
  deleteElement = async () => {
    await this.context.page.getByRole('menuitem', { name: 'Delete' }).click()
    await this.context.page.getByRole('button', { name: 'Yes' }).click()
    await this.checkTextIsVisible('Deleted successfully')
  }

  // Click on "Delete" that is in a sub row and then confirm in the dialog
  deleteElementInSubrow = async () => {
    await this.context.page
      .getByRole('button', { name: 'Delete' })
      .first()
      .click()
    await this.context.getByTestId('dialog-accept').click()
    await this.checkTextIsVisible('Deleted successfully')
  }
}
