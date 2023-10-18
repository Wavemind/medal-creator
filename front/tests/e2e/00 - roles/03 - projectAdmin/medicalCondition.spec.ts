/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { MedicalConditionsPage } from '@/playwright/pages/medicalConditionsPage'

test.describe('Check project admin medical condition permissions', () => {
  let medicalConditionsPage: MedicalConditionsPage

  test.beforeEach(async ({ projectAdminContext }) => {
    medicalConditionsPage = new MedicalConditionsPage(projectAdminContext)
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
