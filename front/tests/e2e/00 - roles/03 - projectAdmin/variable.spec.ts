/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { VariablesPage } from '@/playwright/pages/variablesPage'

test.describe('Check project admin variable permissions', () => {
  let variablesPage: VariablesPage

  test.beforeEach(async ({ projectAdminContext }) => {
    variablesPage = new VariablesPage(projectAdminContext)
    await variablesPage.navigate()
  })

  test('should be able to search', async () => {
    await variablesPage.canSearchForVariables()
  })

  test('should be able to to see the variable details', async () => {
    await variablesPage.canViewInfo()
  })

  test('should be able to create a variable', async () => {
    await variablesPage.canCreateVariable()
  })

  test('should be able to update a variable', async () => {
    await variablesPage.canUpdateVariable()
  })

  test('should be able to duplicate a variable', async () => {
    await variablesPage.canDuplicateVariable()
  })

  test('should be able to delete a variable', async () => {
    await variablesPage.canDeleteVariable()
  })
})
