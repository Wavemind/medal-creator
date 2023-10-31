/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { DiagnosesExclusionsPage } from '@/tests/pageObjectModels/diagnosesExclusions'

test.describe('Check deployment manager diagnoses exclusions permissions', () => {
  let diagnosesExclusionsPage: DiagnosesExclusionsPage

  test.beforeEach(async ({ deploymentManagerContext }) => {
    diagnosesExclusionsPage = new DiagnosesExclusionsPage(
      deploymentManagerContext
    )
    await diagnosesExclusionsPage.navigateToDiagnosesExclusions()
  })

  test('should not be able to add an exclusion', async () => {
    await diagnosesExclusionsPage.cannotAddExclusion()
  })

  test('should not be able to delete an exclusion', async () => {
    await diagnosesExclusionsPage.cannotAddExclusion()
  })

  test('should be able to search', async () => {
    await diagnosesExclusionsPage.canSearchForDiagnosisExclusions()
  })
})
