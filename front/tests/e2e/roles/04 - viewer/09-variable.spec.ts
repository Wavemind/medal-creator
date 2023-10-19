/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { VariablesPage } from '@/tests/pageObjectModels/variables'

test.describe('Check viewer variable permissions', () => {
  let variablesPage: VariablesPage

  test.beforeEach(async ({ viewerContext }) => {
    variablesPage = new VariablesPage(viewerContext)
    await variablesPage.navigate()
  })

  test('should be able to search for variables', async () => {
    await variablesPage.canSearchForVariables()
  })

  test('should be able to view details', async () => {
    await variablesPage.canViewInfo()
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

  test('should not be able to delete a variable', async () => {
    await variablesPage.cannotDeleteVariable()
  })
})
