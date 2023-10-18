/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/tests/contexts/baseContext'
import { BasePage } from '@/tests/pageObjectModels/base'

export class ForgotPasswordPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/auth/forgot-password')
    await this.checkTextIsVisible('Reset your password')
  }

  checkFields = async () => {
    await expect(this.context.page.getByLabel('Email *')).toBeVisible()
    await expect(this.getButtonByText('Send')).toBeVisible()
    this.checkTextIsVisible('Sign in')
  }

  validateForm = async () => {
    await this.form.submitForm()
    this.checkTextIsVisible('Email is required')
  }

  successfullySubmitForm = async () => {
    this.form.fillInput('email', 'test@test.com')
    await this.form.submitForm()
    await this.checkTextIsVisible(
      'If your email address exists in our database, you will receive an email with instructions on how to reset your password in a few minutes.'
    )
  }
}
