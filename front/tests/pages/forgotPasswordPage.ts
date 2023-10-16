/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/playwright/contexts/baseContext'
import { BasePage } from '@/tests/pages/basePage'

export class ForgotPasswordPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/auth/forgot-password')
    await expect(
      await this.context.page.getByText('Reset your password')
    ).toBeVisible()
  }

  checkFields = async () => {
    await expect(this.context.page.getByLabel('Email *')).toBeVisible()
    await expect(
      this.context.page.getByRole('button', { name: 'Send' })
    ).toBeVisible()
    await expect(this.context.page.getByText('Sign in')).toBeVisible()
  }

  validateForm = async () => {
    await this.context.page.getByRole('button', { name: 'Send' }).click()

    await expect(this.context.page.getByText('Email is required')).toBeVisible()
  }

  successfullySubmitForm = async () => {
    await this.context.page.getByRole('button', { name: 'Send' }).click()

    await this.context.page.getByLabel('Email *').click()
    await this.context.page.getByLabel('Email *').fill('test@test.com')

    await this.context.page.getByRole('button', { name: 'Send' }).click()

    await expect(
      await this.context.page.getByText(
        'If your email address exists in our database, you will receive an email with instructions on how to reset your password in a few minutes.'
      )
    ).toBeVisible()
  }
}
