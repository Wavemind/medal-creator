/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/tests/contexts/baseContext'
import { BasePage } from '@/tests/pageObjectModels/base'

export class NewPasswordPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/auth/new-password')
    await this.checkTextIsVisible('Change your password')
  }

  checkFields = async () => {
    await expect(this.context.page.getByLabel('New password *')).toBeVisible()
    await expect(
      this.context.page.getByLabel('Password confirmation *')
    ).toBeVisible()
    await expect(this.getButtonByText('Save')).toBeVisible()
    await this.checkTextIsVisible('Sign in')
  }

  validateForm = async () => {
    await this.form.submitForm()
    await this.checkTextIsVisible('New password is required')
    await this.checkTextIsVisible('Password confirmation is required')
  }
}
