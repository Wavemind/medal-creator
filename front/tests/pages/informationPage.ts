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
    await expect(this.context.getInput('firstName')).toBeVisible()
    await expect(this.context.getInput('lastName')).toBeVisible()
    await expect(this.context.getInput('email')).toBeVisible()
    await expect(
      this.context.page.getByRole('button', { name: 'Save' })
    ).toBeVisible()
  }

  successfullyUpdateInformation = async () => {
    await this.context.fillInput('firstName', 'Update first name')
    await this.context.fillInput('lastName', 'Update last name')
    await this.context.submitForm()

    await this.checkTextIsVisible('Saved successfully')
  }
}
