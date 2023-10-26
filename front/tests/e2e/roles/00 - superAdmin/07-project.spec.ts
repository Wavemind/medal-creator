/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { ProjectsPage } from '@/tests/pageObjectModels/projects'

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
    await projectsPage.canUpdateProject('New project')
  })

  test('should be able to add a user to a project', async () => {
    await projectsPage.canAddUserToProject('New project')
  })

  test('should be able to access all projects', async () => {
    await projectsPage.canAccessOtherProjects([1, 2, 3, 4, 5])
  })
})
