/**
 * The internal imports
 */
import { BaseContext, expect } from '@/playwright/fixtures'

export class ProjectsPage {
  readonly context: BaseContext

  constructor(context: BaseContext) {
    this.context = context
  }

  async navigate() {
    await this.context.page.goto('/')
  }

  async cannotCreateProject() {
    await expect(
      await this.context.getByTestId('new-project')
    ).not.toBeVisible()
    await this.context.page.goto('/projects/new')
    await expect(
      await this.context.page.getByRole('heading', { name: 'New project' })
    ).not.toBeVisible()
  }

  async cannotUpdateProject() {
    await this.context.getByTestId('project-menu-1').click()
    await expect(
      await this.context.page.getByRole('menuitem', { name: 'Settings' })
    ).not.toBeVisible()
    await this.context.page.goto('/projects/1/edit')
    await expect(
      await this.context.page.getByRole('heading', {
        name: 'Edit Project for Tanzania',
      })
    ).not.toBeVisible()
    await this.context.page
      .getByRole('link', { name: 'Project for Tanzania' })
      .click()
    await expect(
      await this.context.getByTestId('project-settings')
    ).not.toBeVisible()
  }

  async canCreateProject() {
    await this.context.getByTestId('new-project').click()
    await this.context.fillInput('name', 'FeverTravel App 2')
    await this.context.page.getByText('Consent management ?').click()
    await this.context.fillTextarea(
      'description',
      'Practice Guidelines for Evaluation of Fever in returning Travelers or Migrants'
    )

    await this.context.page
      .locator("input[type='file']")
      .setInputFiles('playwright/fixtures/example.json')
    await this.context.selectOptionByValue('languageId', '1')
    await this.context.page
      .getByPlaceholder('John doe | john.doe@email.com')
      .fill('wavemind')

    await this.context.page
      .getByRole('button', { name: 'Quentin Doe dev-admin@wavemind.ch' })
      .click()

    await this.context.submitForm()
    await expect(
      await this.context.page.getByText('Saved successfully')
    ).toBeVisible()
  }

  async canUpdateProject() {
    await this.context.getByTestId('project-menu-1').click()
    await this.context.page.getByRole('menuitem', { name: 'Settings' }).click()
    await this.context.fillInput('name', 'Renamed project')
    await this.context.submitForm()

    await expect(
      await this.context.page.getByText('Saved successfully')
    ).toBeVisible()
  }
}
