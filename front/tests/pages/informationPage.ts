/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/playwright/contexts/baseContext'
import { BasePage } from '@/tests/pages/basePage'

export class InformationPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/account/information')
    await this.checkHeadingIsVisible('Information')
  }

  checkFields = async () => {
    await expect(this.form.getInput('firstName')).toBeVisible()
    await expect(this.form.getInput('lastName')).toBeVisible()
    await expect(this.form.getInput('email')).toBeVisible()
    await expect(this.getButtonByText('Save')).toBeVisible()
  }

  successfullyUpdateInformation = async () => {
    await this.form.fillInput('firstName', 'Update first name')
    await this.form.fillInput('lastName', 'Update last name')
    await this.form.submitForm()

    await this.checkTextIsVisible('Saved successfully')
  }
}
