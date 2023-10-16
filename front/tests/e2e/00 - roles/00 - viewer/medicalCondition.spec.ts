/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { MedicalConditionsPage } from '@/tests/pages/medicalConditionsPage'

test.describe('Check viewer medical condition permissions', () => {
  let medicalConditionsPage: MedicalConditionsPage

  test.beforeEach(async ({ viewerContext }) => {
    medicalConditionsPage = new MedicalConditionsPage(viewerContext)
    await medicalConditionsPage.navigate()
  })

  test('should be able to search', async () => {
    await medicalConditionsPage.canSearchForMedicalConditions()
  })

  test('should not be able to create a management', async () => {
    await medicalConditionsPage.cannotCreateMedicalCondition()
  })

  test('should not be able to update a management', async () => {
    await medicalConditionsPage.cannotUpdateMedicalCondition()
  })

  test('should not be able to delete a management', async () => {
    await medicalConditionsPage.cannotDeleteMedicalCondition()
  })
})
