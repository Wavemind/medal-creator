/**
 * The external imports
 */
import { ReactElement, useCallback, useContext } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Heading, Button, HStack } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import { ModalContext } from '@/lib/contexts'
import Layout from '@/lib/layouts/default'
import {
  Page,
  DataTable,
  DecisionTreeRow,
  DecisionTreeStepper,
} from '@/components'
import { wrapper } from '@/lib/store'
import {
  getAlgorithm,
  useGetAlgorithmQuery,
  getProject,
  useGetProjectQuery,
  useLazyGetDecisionTreesQuery,
} from '@/lib/services/modules'
import { apiGraphql } from '@/lib/services/apiGraphql'
import type { Project, Algorithm, RenderItemFn, DecisionTree } from '@/types'

/**
 * Type definitions
 */
type AlgorithmProps = {
  projectId: number
  algorithmId: number
  isAdminOrClinician: boolean
}

export default function Algorithm({
  projectId,
  algorithmId,
  isAdminOrClinician,
}: AlgorithmProps) {
  const { t } = useTranslation('decisionTrees')
  const { openModal } = useContext(ModalContext)
  const { data: algorithm = {} as Algorithm } = useGetAlgorithmQuery(
    Number(algorithmId)
  )
  const { data: project = {} as Project } = useGetProjectQuery(
    Number(projectId)
  )

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
  const decisionTreeRow = useCallback<RenderItemFn<DecisionTree>>(
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
        {isAdminOrClinician && (
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
        searchable
        apiQuery={useLazyGetDecisionTreesQuery}
        requestParams={{ algorithmId }}
        renderItem={decisionTreeRow}
      />
    </Page>
  )
}

Algorithm.getLayout = function getLayout(page: ReactElement) {
  return <Layout menuType='algorithm'>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, query }: GetServerSidePropsContext) => {
      const { projectId, algorithmId } = query

      if (typeof locale === 'string') {
        store.dispatch(getProject.initiate(Number(projectId)))
        store.dispatch(getAlgorithm.initiate(Number(algorithmId)))
        await Promise.all(
          store.dispatch(apiGraphql.util.getRunningQueriesThunk())
        )

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
            ...translations,
          },
        }
      }

      return {
        redirect: {
          destination: '/500',
          permanent: false,
        },
      }
    }
)
