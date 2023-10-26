/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { ProjectsPage } from '@/tests/pageObjectModels/projects'

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

  test('should not be able to access other projects', async () => {
    await projectsPage.cannotAccessOtherProjects([1, 2, 3, 5])
    await projectsPage.canAccessOtherProjects([4])
  })
})
