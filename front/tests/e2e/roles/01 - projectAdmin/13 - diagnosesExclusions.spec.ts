/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { DiagnosesExclusionsPage } from '@/tests/pageObjectModels/diagnosesExclusions'

test.describe('Check project admin diagnoses exclusions permissions', () => {
  let diagnosesExclusionsPage: DiagnosesExclusionsPage

  test.beforeEach(async ({ projectAdminContext }) => {
    diagnosesExclusionsPage = new DiagnosesExclusionsPage(projectAdminContext)
    await diagnosesExclusionsPage.navigateToDiagnosesExclusions()
  })

  test('should be able to search', async () => {
    await diagnosesExclusionsPage.canSearchForDiagnosisExclusions()
  })

  test('should be able to add an exclusion', async () => {
    await diagnosesExclusionsPage.canAddExclusion()
  })

  test('should be able to delete an exclusion', async () => {
    await diagnosesExclusionsPage.canDeleteExclusion()
  })
})
