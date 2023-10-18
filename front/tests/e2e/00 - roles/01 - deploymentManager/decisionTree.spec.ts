/**
 * The internal imports
 */
import { test } from '@/playwright/fixtures'
import { DecisionTreesPage } from '@/playwright/pages/decisionTreesPage'

test.describe('Check deployment manager decision tree permissions', () => {
  let decisionTreesPage: DecisionTreesPage

  test.beforeEach(async ({ deploymentManagerContext }) => {
    decisionTreesPage = new DecisionTreesPage(deploymentManagerContext)
    await decisionTreesPage.navigate()
  })

  test('should be able to search', async () => {
    await decisionTreesPage.canSearchForDecisionTrees()
  })

  test('should not be able to create a decision tree', async () => {
    await decisionTreesPage.cannotCreateDecisionTree()
  })

  test('should not be able to update a decision tree', async () => {
    await decisionTreesPage.cannotUpdateDecisionTree()
  })

  test('should not be able to duplicate a decision tree', async () => {
    await decisionTreesPage.cannotDuplicateDecisionTree()
  })

  test('should not be able to delete a decision tree', async () => {
    await decisionTreesPage.cannotDeleteDecisionTree()
  })

  test('should not be able to view diagnosis info', async () => {
    await decisionTreesPage.canViewInfo()
  })

  test('should not be able to create a diagnosis', async () => {
    await decisionTreesPage.cannotCreateDiagnosis()
  })

  test('should not be able to update a diagnosis', async () => {
    await decisionTreesPage.cannotUpdateDiagnosis()
  })

  test('should not be able to delete a diagnosis', async () => {
    await decisionTreesPage.cannotDeleteDiagnosis()
  })
})
