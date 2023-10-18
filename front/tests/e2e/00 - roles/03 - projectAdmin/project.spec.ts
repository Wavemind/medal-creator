/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { ProjectsPage } from '@/playwright/pages/projectsPage'

test.describe('Check project admin project permissions', () => {
  let projectsPage: ProjectsPage

  test.beforeEach(async ({ projectAdminContext }) => {
    projectsPage = new ProjectsPage(projectAdminContext)
    await projectsPage.navigate()
  })

  test('should not be able to create a project', async () => {
    await projectsPage.cannotCreateProject()
  })

  test('should be able to update a project', async () => {
    await projectsPage.canUpdateProject()
  })

  test('should be able to add a user to a project', async () => {
    await projectsPage.canAddUserToProject()
  })
})
