/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { ProjectsPage } from '@/tests/pages/projectsPage'

test.describe('Check viewer project permissions', () => {
  let projectsPage: ProjectsPage

  test.beforeEach(async ({ viewerContext }) => {
    projectsPage = new ProjectsPage(viewerContext)
    await projectsPage.navigate()
  })

  test('should not be able to create a project', async () => {
    await projectsPage.cannotCreateProject()
  })

  test('should not be able to update a project', async () => {
    await projectsPage.cannotUpdateProject()
  })
})
