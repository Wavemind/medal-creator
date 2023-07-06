/**
 * The external imports
 */
import { ReactElement, useCallback, useContext } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Heading, Button, HStack, Spinner } from '@chakra-ui/react'
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
} from '@/lib/api/modules'
import { apiGraphql } from '@/lib/api/apiGraphql'
import type {
  Algorithm,
  RenderItemFn,
  DecisionTree,
  AlgorithmPage,
} from '@/types'

export default function Algorithm({
  projectId,
  algorithmId,
  isAdminOrClinician,
}: AlgorithmPage) {
  const { t } = useTranslation('decisionTrees')
  const { openModal } = useContext(ModalContext)
  const { data: algorithm, isSuccess: isAlgorithmSuccess } =
    useGetAlgorithmQuery({ id: algorithmId })
  const { data: project, isSuccess: isProjectSuccess } = useGetProjectQuery({
    id: projectId,
  })

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
        language={project!.language.code}
        isAdminOrClinician={isAdminOrClinician}
      />
    ),
    [t]
  )

  if (isAlgorithmSuccess && isProjectSuccess) {
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

  return <Spinner size='xl' />
}

Algorithm.getLayout = function getLayout(page: ReactElement) {
  return <Layout menuType='algorithm'>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, query }: GetServerSidePropsContext) => {
      const { projectId, algorithmId } = query

      if (
        typeof locale === 'string' &&
        typeof projectId === 'string' &&
        typeof algorithmId === 'string'
      ) {
        store.dispatch(getProject.initiate({ id: projectId }))
        store.dispatch(getAlgorithm.initiate({ id: algorithmId }))
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
