/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { VariablesPage } from '@/tests/pages/variablesPage'

test.describe('Check viewer variable permissions', () => {
  let variablesPage: VariablesPage

  test.beforeEach(async ({ viewerContext }) => {
    variablesPage = new VariablesPage(viewerContext)
    await variablesPage.navigate()
  })

  test('should not be able to create a variable', async () => {
    await variablesPage.cannotCreateVariable()
  })

  test('should not be able to update a variable', async () => {
    await variablesPage.cannotUpdateVariable()
  })

  test('should not be able to duplicate a variable', async () => {
    await variablesPage.cannotDuplicateVariable()
  })

  test('should not be able to archive a variable', async () => {
    await variablesPage.cannotDeleteVariable()
  })

  test('should be able to view details', async () => {
    await variablesPage.canViewInfo()
  })

  test('should be able to search for variables', async () => {
    await variablesPage.canSearchForVariables()
  })
})
