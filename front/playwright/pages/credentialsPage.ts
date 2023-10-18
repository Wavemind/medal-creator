/**
 * The internal imports
 */
import { BaseContext } from '@/playwright/contexts/baseContext'
import { BasePage } from '@/playwright/pages/basePage'

export class CredentialsPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/account/credentials')
    await this.checkHeadingIsVisible('Change your password')
  }

  checkComplexity = async () => {
    // Due to 2 times password on the same view
    await this.getElementByTestId('new-password').fill('123456')
    await this.form.fillInput('passwordConfirmation', '123456')

    // Due to 2 times password on the same view
    await this.clickButtonByText('Save')
    await this.checkTextIsVisible('Complexity requirement not met')
  }

  successfullyChangePassword = async () => {
    await this.getElementByTestId('new-password').fill('P@ssw0rd')
    await this.form.fillInput('passwordConfirmation', 'P@ssw0rd')

    await this.clickButtonByText('Save')
    await this.checkTextIsVisible('Saved successfully')
  }
}
