/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/playwright/contexts/baseContext'
import { BasePage } from '@/tests/pages/basePage'

export class NewPasswordPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/auth/new-password')
    await expect(
      await this.context.page.getByText('Change your password')
    ).toBeVisible()
  }

  checkFields = async () => {
    await expect(this.context.page.getByLabel('New password *')).toBeVisible()
    await expect(
      this.context.page.getByLabel('Password confirmation *')
    ).toBeVisible()
    await expect(
      this.context.page.getByRole('button', { name: 'Save' })
    ).toBeVisible()
    await expect(this.context.page.getByText('Sign in')).toBeVisible()
  }

  validateForm = async () => {
    await this.context.page.getByRole('button', { name: 'Save' }).click()

    await expect(
      await this.context.page.getByText('New password is required')
    ).toBeVisible()

    await expect(
      await this.context.page.getByText('Password confirmation is required')
    ).toBeVisible()
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
