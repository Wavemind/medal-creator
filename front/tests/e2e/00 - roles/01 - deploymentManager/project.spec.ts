/**
 * The internal imports
 */
import { test, expect } from '@/playwright/fixtures'

test.beforeEach(async ({ deploymentManagerPage }) => {
  await deploymentManagerPage.page.goto('/')
})

test.describe('Check deploymentManager project permissions', () => {
  test('should not be able to create or update a project', async ({
    deploymentManagerPage,
  }) => {
    await expect(
      await deploymentManagerPage.getByTestId('new-project')
    ).not.toBeVisible()
    await deploymentManagerPage.page.goto('/projects/new')
    await expect(
      await deploymentManagerPage.page.getByRole('heading', {
        name: 'New project',
      })
    ).not.toBeVisible()
    await deploymentManagerPage.getByTestId('project-menu-1').click()
    await expect(
      await deploymentManagerPage.page.getByRole('menuitem', {
        name: 'Settings',
      })
    ).not.toBeVisible()
    await deploymentManagerPage.page.goto('/projects/1/edit')
    await expect(
      await deploymentManagerPage.page.getByRole('heading', {
        name: 'Edit Project for Tanzania',
      })
    ).not.toBeVisible()
    await deploymentManagerPage.page
      .getByRole('link', { name: 'Project for Tanzania' })
      .click()
    await expect(
      await deploymentManagerPage.getByTestId('project-settings')
    ).not.toBeVisible()
  })
})
