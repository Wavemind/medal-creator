/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { DiagnosesExclusionsPage } from '@/tests/pageObjectModels/diagnosesExclusions'

test.describe('Check veiwer diagnoses exclusions permissions', () => {
  let diagnosesExclusionsPage: DiagnosesExclusionsPage

  test.beforeEach(async ({ viewerContext }) => {
    diagnosesExclusionsPage = new DiagnosesExclusionsPage(viewerContext)
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
