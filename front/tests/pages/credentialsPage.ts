/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/playwright/contexts/baseContext'
import { BasePage } from '@/tests/pages/basePage'

export class CredentialsPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/account/credentials')
    await expect(
      await this.context.page.getByRole('heading', {
        name: 'Change your password',
      })
    ).toBeVisible()
  }

  checkComplexity = async () => {
    // Due to 2 times password on the same view
    await this.context.getByTestId('new-password').fill('123456')
    await this.context.fillInput('passwordConfirmation', '123456')

    // Due to 2 times password on the same view
    await this.context.page.getByRole('button', { name: 'Save' }).click()

    await expect(
      await this.context.page.getByText('Complexity requirement not met')
    ).toBeVisible()
  }

  successfullyChangePassword = async () => {
    await this.context.getByTestId('new-password').fill('P@ssw0rd')
    await this.context.fillInput('passwordConfirmation', 'P@ssw0rd')

    await this.context.page.getByRole('button', { name: 'Save' }).click()
    await expect(
      await this.context.page.getByText('Saved successfully')
    ).toBeVisible()
  }
}
