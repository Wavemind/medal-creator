/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/playwright/contexts/baseContext'
import { BasePage } from '@/tests/pages/basePage'

export class SignInPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/auth/sign-in')
    await expect(await this.context.page.getByText('Login')).toBeVisible()
  }

  checkFields = async () => {
    await expect(this.context.page.getByLabel('Email *')).toBeVisible()
    await expect(this.context.page.getByLabel('Password *')).toBeVisible()
    await expect(
      this.context.page.getByRole('button', { name: 'Sign in' })
    ).toBeVisible()
    await expect(
      this.context.page.getByText('Forgot your password ?')
    ).toBeVisible()
  }

  validateForm = async () => {
    await this.context.page.getByRole('button', { name: 'Sign in' }).click()

    await expect(this.context.page.getByText('Email is required')).toBeVisible()

    await expect(
      this.context.page.getByText('Password is required')
    ).toBeVisible()
  }

  checkInvalidUser = async () => {
    await this.context.page.getByLabel('Email *').click()
    await this.context.page.getByLabel('Email *').fill('test@test.com')
    await this.context.page.getByLabel('Password *').click()
    await this.context.page.getByLabel('Password *').fill('password')
    await this.context.page.getByRole('button', { name: 'Sign in' }).click()

    await expect(
      await this.context.page.getByText(
        'Invalid login credentials. Please try again.'
      )
    ).toBeVisible()
  }

  checkValidUser = async () => {
    await this.context.page.getByLabel('Email *').click()
    await this.context.page.getByLabel('Email *').fill('dev-admin@wavemind.ch')
    await this.context.page.getByLabel('Password *').click()
    await this.context.page.getByLabel('Password *').fill('P@ssw0rd')
    await this.context.page.getByRole('button', { name: 'Sign in' }).click()

    await expect(
      await this.context.page.getByRole('heading', { name: 'Projects' })
    ).toBeVisible()
  }
}
