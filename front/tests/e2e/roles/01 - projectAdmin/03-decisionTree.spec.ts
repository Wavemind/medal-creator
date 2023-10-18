/**
 * The internal imports
 */
import { test } from '@/tests/fixtures'
import { DecisionTreesPage } from '@/tests/pageObjectModels/decisionTrees'

test.describe('Check project admin decision tree permissions', () => {
  let decisionTreesPage: DecisionTreesPage

  test.beforeEach(async ({ projectAdminContext }) => {
    decisionTreesPage = new DecisionTreesPage(projectAdminContext)
    await decisionTreesPage.navigate()
  })

  test('should be able to search', async () => {
    await decisionTreesPage.canSearchForDecisionTrees()
  })

  test('should be able to create a decision tree', async () => {
    await decisionTreesPage.canCreateDecisionTree('109')
  })

  test('should be able to update a decision tree', async () => {
    await decisionTreesPage.canUpdateDecisionTree()
  })

  test('should be able to duplicate a decision tree', async () => {
    await decisionTreesPage.canDuplicateDecisionTree()
  })

  test('should be able to delete a decision tree', async () => {
    await decisionTreesPage.canDeleteDecisionTree()
  })

  test('should be able to view diagnosis info', async () => {
    await decisionTreesPage.canViewInfo()
  })

  test('should be able to create a diagnosis', async () => {
    await decisionTreesPage.canCreateDiagnosis()
  })

  test('should be able to update a diagnosis', async () => {
    await decisionTreesPage.canUpdateDiagnosis()
  })

  test('should be able to delete a diagnosis', async () => {
    await decisionTreesPage.canDeleteDiagnosis()
  })
})
