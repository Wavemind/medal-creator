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

  navigateToPage = async () => {
    this.navigate()
    await this.clickElementByTestId('user-menu')
    await this.clickMenuItemByText('Users')
    await this.checkHeadingIsVisible('Users')
  }

  cannotAccessUsersPage = async () => {
    await this.clickElementByTestId('user-menu')
    await expect(await this.getElementByTestId('menu-users')).not.toBeVisible()
    await this.clickElementByTestId('user-menu')
    await this.context.page.goto('/users')
    await expect(
      await this.context.page.getByRole('heading', { name: 'Users' })
    ).not.toBeVisible()
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

  canCreateUser = async () => {
    await this.clickElementByTestId('new-user')
    await this.form.fillInput('firstName', 'Quentin')
    await this.form.fillInput('lastName', 'Ucak')
    await this.form.fillInput('email', 'quentin.fresco@wavemind.ch')
    await this.form.selectOptionByValue('role', 'viewer')
    await this.clickButtonByText('Viewer project')

    await this.form.submitForm()
    // TODO : Figure out what to do with mailer
  }

  canUpdateUser = async () => {
    await this.getElementByTestId('datatable-menu').last().click()
    await this.clickMenuItemByText('Edit')
    await this.form.fillInput('lastName', 'Fresco')

    await this.form.submitForm()
    await this.checkTextIsVisible('Saved successfully')
  }

  canLockUser = async () => {
    await this.context.page.getByRole('textbox').click()
    await this.context.page
      .getByRole('textbox')
      .fill('quentin.fresco@wavemind.ch')

    await this.context.page.waitForTimeout(500)

    await this.getElementByTestId('datatable-menu').first().click()
    await this.clickMenuItemByText('Lock')

    await this.clickButtonByText('Yes')

    await expect(
      await this.getElementByTestId('datatable-row-lock-6')
    ).toBeVisible()
  }

  canUnlockUser = async () => {
    await this.context.page.getByRole('textbox').click()
    await this.context.page
      .getByRole('textbox')
      .fill('quentin.fresco@wavemind.ch')

    await this.context.page.waitForTimeout(500)

    await this.getElementByTestId('datatable-menu').first().click()
    await this.clickMenuItemByText('Unlock')
    await this.clickButtonByText('Yes')

    await expect(
      await this.getElementByTestId('datatable-row-lock-3')
    ).toBeHidden()
  }
}
