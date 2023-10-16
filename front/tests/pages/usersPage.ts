/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/playwright/contexts/baseContext'
import { BasePage } from '@/tests/pages/basePage'

export class UsersPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/')
  }

  cannotAccessUsersPage = async () => {
    await this.context.page.getByTestId('user-menu').click()
    await expect(await this.context.getByTestId('menu-users')).not.toBeVisible()
    await this.context.page.getByTestId('user-menu').click()
    await this.context.page.goto('/users')
    await expect(
      await this.context.page.getByRole('heading', { name: 'Users' })
    ).not.toBeVisible()
  }

  canAccessUsersPage = async () => {
    await this.context.getByTestId('user-menu').click()
    await this.context.page.getByRole('menuitem', { name: 'Users' }).click()
    await expect(
      await this.context.page.getByRole('heading', { name: 'Users' })
    ).toBeVisible()
  }

  canCreateUser = async () => {
    await this.context.getByTestId('new-user').click()
    await this.context.fillInput('firstName', 'Quentin')
    await this.context.fillInput('lastName', 'Ucak')
    await this.context.fillInput('email', 'quentin.fresco@wavemind.ch')
    await this.context.selectOptionByValue('role', 'viewer')
    await this.context.page
      .getByRole('button', { name: 'Viewer project' })
      .click()

    await this.context.submitForm()
    // TODO : Figure out what to do with mailer
  }

  canUpdateUser = async () => {
    this.canAccessUsersPage()
    await this.context.getByTestId('datatable-menu').last().click()
    await this.context.page.getByRole('menuitem', { name: 'Edit' }).click()
    await this.context.fillInput('lastName', 'Fresco')

    await this.context.submitForm()
    await expect(
      await this.context.page.getByText('Saved successfully')
    ).toBeVisible()
  }

  canSearchForExistingUser = async () => {
    await this.context.page.getByRole('textbox').click()
    await this.context.page.getByRole('textbox').fill('dev-admin@wavemind.ch')
    await expect(
      await this.context.page.getByRole('cell', {
        name: 'dev-admin@wavemind.ch',
      })
    ).toBeVisible()
  }

  canSearchForInexistantUser = async () => {
    await this.context.page.getByRole('textbox').click()
    await this.context.page.getByRole('textbox').fill('toto')
    await expect(
      await this.context.page.getByRole('cell', { name: 'No data available' })
    ).toBeVisible()
  }

  canLockUser = async () => {
    await this.context.page.getByRole('textbox').click()
    await this.context.page.getByRole('textbox').fill('john.doe@wavemind.ch')

    await this.context.page.waitForTimeout(500)

    await this.context.getByTestId('datatable-menu').first().click()
    await this.context.page.getByRole('menuitem', { name: 'Lock' }).click()

    const alertDialog = await this.context.getByTestId('alert-dialog')
    await alertDialog.getByRole('button', { name: 'Yes' }).click()

    await expect(
      await this.context.getByTestId('datatable-row-lock-3')
    ).toBeVisible()
  }

  canUnlockUser = async () => {
    await this.context.page.getByRole('textbox').click()
    await this.context.page.getByRole('textbox').fill('john.doe@wavemind.ch')

    await this.context.page.waitForTimeout(500)

    await this.context.getByTestId('datatable-menu').first().click()
    await this.context.page.getByRole('menuitem', { name: 'Unlock' }).click()
    const alertDialog = await this.context.getByTestId('alert-dialog')
    await alertDialog.getByRole('button', { name: 'Yes' }).click()

    await expect(
      await this.context.getByTestId('datatable-row-lock-3')
    ).toBeHidden()
  }
}
