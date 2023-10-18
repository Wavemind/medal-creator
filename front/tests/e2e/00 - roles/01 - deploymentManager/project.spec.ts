/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { ProjectsPage } from '@/playwright/pages/projectsPage'

test.describe('Check deployment manager project permissions', () => {
  let projectsPage: ProjectsPage

  test.beforeEach(async ({ deploymentManagerContext }) => {
    projectsPage = new ProjectsPage(deploymentManagerContext)
    await projectsPage.navigate()
  })

  test('should not be able to create a project', async () => {
    await projectsPage.cannotCreateProject()
  })

  test('should not be able to update a project', async () => {
    await projectsPage.cannotUpdateProject()
  })
})
