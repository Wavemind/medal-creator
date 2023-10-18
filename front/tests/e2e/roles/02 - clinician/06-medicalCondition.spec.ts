/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { MedicalConditionsPage } from '@/tests/pageObjectModels/medicalConditions'

test.describe('Check clinician medical condition permissions', () => {
  let medicalConditionsPage: MedicalConditionsPage

  test.beforeEach(async ({ clinicianContext }) => {
    medicalConditionsPage = new MedicalConditionsPage(clinicianContext)
    await medicalConditionsPage.navigate()
  })

  test('should be able to search', async () => {
    await medicalConditionsPage.canSearchForMedicalConditions()
  })

  test('should be able to create a management', async () => {
    await medicalConditionsPage.canCreateMedicalCondition()
  })

  test('should be able to update a management', async () => {
    await medicalConditionsPage.canUpdateMedicalCondition()
  })

  test('should be able to delete a management', async () => {
    await medicalConditionsPage.canDeleteMedicalCondition()
  })
})
