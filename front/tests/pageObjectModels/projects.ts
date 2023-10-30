/**
 * The external imports
 */
import { expect } from '@playwright/test'

/**
 * The internal imports
 */
import { BaseContext } from '@/tests/contexts/baseContext'
import { BasePage } from '@/tests/pageObjectModels/base'

export class ProjectsPage extends BasePage {
  constructor(context: BaseContext) {
    super(context)
  }

  navigate = async () => {
    await this.context.page.goto('/')
  }

  cannotCreateProject = async () => {
    await expect(await this.getElementByTestId('new-project')).not.toBeVisible()
    await this.context.page.goto('/projects/new')
    await expect(
      await this.context.page.getByRole('heading', { name: 'New project' })
    ).not.toBeVisible()
  }

  cannotUpdateProject = async () => {
    await this.context.page
      .getByTestId(`project-menu-${this.context.projectName}`)
      .click()
    await expect(await this.getMenuItemByText('Settings')).not.toBeVisible()
    await this.context.page
      .getByRole('link', { name: this.context.projectName })
      .click()
    await this.checkHeadingIsVisible(`Project : ${this.context.projectName}`)
    const url = await this.context.page.url()
    await this.context.page.goto(`${url}/edit`)
    await expect(
      await this.context.page.getByRole('heading', {
        name: `Edit ${this.context.projectName}`,
      })
    ).not.toBeVisible()
    await this.context.page
      .getByRole('link', { name: this.context.projectName })
      .click()
    await expect(
      await this.getElementByTestId('project-settings')
    ).not.toBeVisible()
  }

  canCreateProject = async () => {
    await this.clickElementByTestId('new-project')
    await this.form.fillInput('name', 'New project')
    await this.context.page.getByText('Consent management ?').click()
    await this.form.fillTextarea(
      'description',
      'Practice Guidelines for Evaluation of Fever in returning Travelers or Migrants'
    )
    await this.context.page
      .locator("input[type='file']")
      .setInputFiles('tests/fixtures/example.json')
    await this.form.selectOptionByValue('languageId', '1')
    await this.form.fillInput('users', 'wavemind')
    await this.clickButtonByText('Project Admin project-admin@wavemind.ch')
    await this.form.submitForm()
    await this.checkTextIsVisible('Saved successfully')
  }

  async canUpdateProject(name = this.context.projectName) {
    await this.clickElementByTestId(`project-menu-${name}`)
    await this.clickMenuItemByText('Settings')
    await this.form.fillTextarea(
      'description',
      'This a the project admin description'
    )
    await this.form.submitForm()
    await this.checkTextIsVisible('Saved successfully')
  }

  canAddUserToProject = async (name = this.context.projectName) => {
    await this.clickElementByTestId(`project-menu-${name}`)
    await this.clickMenuItemByText('Settings')
    await this.form.fillInput('users', 'viewer')
    await this.clickButtonByText('View Er viewer@wavemind.ch')
    await this.form.submitForm()
    await this.checkTextIsVisible('Saved successfully')
  }
}
