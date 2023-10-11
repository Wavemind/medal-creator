/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { ProjectsPage } from '@/tests/pages/projectsPage'

test.describe('Check super admin project permissions', () => {
  let projectsPage: ProjectsPage

  test.beforeEach(async ({ adminContext }) => {
    projectsPage = new ProjectsPage(adminContext)
    await projectsPage.navigate()
  })

  test('should be able to create a project', async () => {
    await projectsPage.canCreateProject()
  })

  test('should be able to update a project', async () => {
    await projectsPage.canUpdateProject('New Admin project')
  })
})
