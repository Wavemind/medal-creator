/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/tests/contexts/baseContext'
import { BasePage } from '@/tests/pageObjectModels/base'

export class SignInPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/auth/sign-in')
    await this.checkTextIsVisible('Login')
  }

  redirect = async () => {
    await this.context.page.goto('/')
    expect(await this.context.page.url()).toContain('/auth/sign-in')
  }

  checkFields = async () => {
    await expect(this.form.getInput('email')).toBeVisible()
    await expect(this.form.getInput('password')).toBeVisible()
    await expect(this.getButtonByText('Sign in')).toBeVisible()
    await this.checkTextIsVisible('Forgot your password ?')
  }

  validateForm = async () => {
    await this.form.submitForm()
    await this.checkTextIsVisible('Email is required')
    await this.checkTextIsVisible('Password is required')
  }

  checkInvalidUser = async () => {
    await this.form.fillInput('email', 'test@test.com')
    await this.form.fillInput('password', 'password')
    await this.form.submitForm()

    await this.checkTextIsVisible(
      'Invalid login credentials. Please try again.'
    )
  }

  checkValidUser = async () => {
    await this.form.fillInput('email', 'dev-admin@wavemind.ch')
    await this.form.fillInput('password', 'P@ssw0rd')
    await this.form.submitForm()

    await this.checkHeadingIsVisible('Projects')
  }
}
