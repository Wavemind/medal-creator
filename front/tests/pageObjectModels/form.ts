/**
 * The external imports
 */
import { type Locator, Page } from '@playwright/test'

export class Form {
  page: Page

  constructor(page: Page) {
    this.page = page
  }

  // Get an input field using its name attribute
  getInput(name: string): Locator {
    return this.page.locator(`input[name="${name}"]`)
  }

  // Get a textarea field using its name attribute
  getTextarea(name: string): Locator {
    return this.page.locator(`textarea[name="${name}"]`)
  }

  // Get a select field using its name attribute
  getSelect(name: string): Locator {
    return this.page.locator(`select[name="${name}"]`)
  }

  // Check if an option with a specific value exists in a select element
  async optionExistsInSelect(
    selectName: string,
    optionValue: string
  ): Promise<boolean> {
    const select = this.getSelect(selectName)
    const option = select.locator(`option[value="${optionValue}"]`)
    return (await option.count()) > 0
  }

  // Get a checkbox using its name attribute
  getCheckbox(name: string): Locator {
    return this.page.locator(`input[type="checkbox"][name="${name}"]`)
  }

  // Fill an input field with a value
  async fillInput(name: string, value: string): Promise<void> {
    const input = this.getInput(name)
    await input.fill(value)
  }

  // Fill a textarea field with a value
  async fillTextarea(name: string, value: string): Promise<void> {
    const textarea = this.getTextarea(name)
    await textarea.fill(value)
  }

  // Select an option in a select field by its value
  async selectOptionByValue(name: string, value: string): Promise<void> {
    const select = this.getSelect(name)
    await select.selectOption({ value })
  }

  // Go to next step in a form
  async nextStep(): Promise<void> {
    await this.page.getByTestId('next').click()
  }

  // Go to previous step in a form
  async previousStep(): Promise<void> {
    await this.page.getByTestId('previous').click()
  }

  // Submit a form by clicking a submit button
  async submitForm(): Promise<void> {
    const submitButton = this.page.locator('button[type="submit"]')
    await submitButton.click()
  }
}
