/**
 * The external imports
 */
import { useCallback, useContext } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Heading, Button, HStack } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { ModalContext } from '/lib/contexts'
import Layout from '/lib/layouts/default'
import {
  Page,
  DataTable,
  DecisionTreeRow,
  DecisionTreeStepper,
} from '/components'
import { wrapper } from '/lib/store'
import { setSession } from '/lib/store/session'
import { getProject, useGetProjectQuery } from '/lib/services/modules/project'
import {
  getAlgorithm,
  useGetAlgorithmQuery,
} from '/lib/services/modules/algorithm'
import getUserBySession from '/lib/utils/getUserBySession'
import { apiGraphql } from '/lib/services/apiGraphql'
import { useLazyGetDecisionTreesQuery } from '/lib/services/modules/decisionTree'

export default function Algorithm({ projectId, algorithmId, canCrud }) {
  const { t } = useTranslation('decisionTrees')
  const { openModal } = useContext(ModalContext)
  const { data: algorithm } = useGetAlgorithmQuery(algorithmId)
  const { data: project } = useGetProjectQuery(projectId)

  /**
   * Opens the modal with the algorithm form
   */
  const handleOpenForm = () => {
    openModal({
      content: (
        <DecisionTreeStepper algorithmId={algorithmId} projectId={projectId} />
      ),
    })
  }

  /**
   * One row of decision tree
   */
  const decisionTreeRow = useCallback(
    (row, searchTerm) => (
      <DecisionTreeRow
        row={row}
        searchTerm={searchTerm}
        language={project.language.code}
      />
    ),
    [t]
  )

  return (
    <Page title={algorithm.name}>
      <HStack justifyContent='space-between' mb={12}>
        <Heading as='h1'>{t('title')}</Heading>
        {canCrud && (
          <Button
            data-cy='create_decision_tree'
            onClick={handleOpenForm}
            variant='outline'
          >
            {t('new')}
          </Button>
        )}
      </HStack>

      <DataTable
        source='decisionTrees'
        hasButton
        searchable
        apiQuery={useLazyGetDecisionTreesQuery}
        requestParams={{ algorithmId }}
        editable={canCrud}
        renderItem={decisionTreeRow}
        destroyable={canCrud}
      />
    </Page>
  )
}

Algorithm.getLayout = function getLayout(page) {
  return <Layout menuType='algorithm'>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res, query }) => {
      const { projectId, algorithmId } = query
      // Gotta do this everywhere where we have a sidebar
      // ************************************************
      const currentUser = getUserBySession(req, res)
      store.dispatch(setSession(currentUser))
      store.dispatch(getProject.initiate(projectId))
      store.dispatch(getAlgorithm.initiate(algorithmId))
      await Promise.all(
        store.dispatch(apiGraphql.util.getRunningQueriesThunk())
      )
      // ************************************************

      // Calculates whether the current user can perform CRUD actions on decision trees
      const canCrud = ['admin', 'clinician'].includes(currentUser.role)

      // Translations
      const translations = await serverSideTranslations(locale, [
        'common',
        'datatable',
        'submenu',
        'algorithms',
        'decisionTrees',
        'diagnoses',
      ])

      return {
        props: {
          algorithmId,
          projectId,
          locale,
          canCrud,
          ...translations,
        },
      }
    }
)
