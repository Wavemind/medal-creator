/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { ProjectsPage } from '@/tests/pageObjectModels/projects'

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

  test('should not be able to access other projects', async () => {
    await projectsPage.cannotAccessOtherProjects([2, 3, 4, 5])
    await projectsPage.canAccessOtherProjects([6])
  })
})
