/**
 * The external imports
 */
import { type Locator, expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/tests/contexts/baseContext'
import { Form } from '@/tests/pageObjectModels/form'

export class BasePage {
  readonly context: BaseContext
  readonly form: Form

  constructor(context: BaseContext) {
    this.context = context
    this.form = new Form(context.page)
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
    await expect(
      await this.context.page.getByText(text, options).last()
    ).toBeVisible()
  }

  // Check that the datatable does not have a menu
  checkDoesNotHaveMenu = async () => {
    await expect(
      await this.getElementByTestId('datatable-menu').first()
    ).not.toBeVisible()
  }

  // *************** Commonly used utility functions *************** //

  // Open the user menu and click on Edit
  openEditForm = async (): Promise<void> => {
    await this.getElementByTestId('datatable-menu').first().click()
    await this.clickMenuItemByText('Edit')
  }

  // Search for an existing element, and an inexistant element
  searchForElement = async (searchTerm: string, foundText: string) => {
    await this.searchFor(searchTerm, foundText)
    await this.searchFor('toto', 'No data available')
  }

  // Get a option by its text content
  getOptionByText = (text: string, exact: boolean): Locator => {
    return this.context.page.getByRole('option', { name: text, exact })
  }

  // Click a option by its text content
  clickOptionByText = async (text: string, exact = true): Promise<void> => {
    const option = this.getOptionByText(text, exact)
    await option.click()
  }

  // Get a button by its text content
  getButtonByText = (text: string): Locator => {
    return this.context.page.getByRole('button', { name: text, exact: true })
  }

  // Click a button by its text content
  clickButtonByText = async (text: string): Promise<void> => {
    const button = this.getButtonByText(text)
    await button.click()
  }

  // Get a MenuItem by its text content
  getMenuItemByText = (text: string): Locator => {
    return this.context.page.getByRole('menuitem', { name: text, exact: true })
  }

  // Click a MenuItem by its text content
  clickMenuItemByText = async (text: string): Promise<void> => {
    const button = this.getMenuItemByText(text)
    await button.click()
  }

  // Get a element by its testId
  getElementByTestId = (id: string): Locator => {
    return this.context.page.getByTestId(id)
  }

  // Click a element by its testId
  clickElementByTestId = async (id: string): Promise<void> => {
    const element = this.getElementByTestId(id)
    await element.click()
  }

  // Clicks on the show button on the first row of a datatable
  clickOnFirstAlgo = async () => {
    await this.context.page
      .getByRole('row', { name: 'First algo' })
      .getByTestId('datatable-show')
      .click()
  }

  // Click on "Delete" in the menu, and then confirm in the dialog
  deleteElement = async () => {
    await this.clickMenuItemByText('Delete')
    await this.clickButtonByText('Yes')
    await this.checkTextIsVisible('Deleted successfully')
  }

  // Click on "Delete" that is in a sub row and then confirm in the dialog
  deleteElementInSubrow = async () => {
    await this.context.page
      .getByRole('button', { name: 'Delete' })
      .first()
      .click()
    await this.clickElementByTestId('dialog-accept')
    await this.checkTextIsVisible('Deleted successfully')
  }

  // Generic test for search functionality in all datatables
  private searchFor = async (term: string, foundRow: string) => {
    await this.context.page.getByRole('textbox').click()
    await this.context.page.getByRole('textbox').fill(term)
    await expect(
      await this.context.page.getByRole('cell', {
        name: foundRow,
      })
    ).toBeVisible()
  }
}
