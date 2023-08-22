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
import Page from '@/components/page'
import DataTable from '@/components/table/datatable'
import DecisionTreeRow from '@/components/table/decisionTreeRow'
import DecisionTreeStepper from '@/components/forms/decisionTreeStepper'
import { wrapper } from '@/lib/store'
import {
  getAlgorithm,
  useGetAlgorithmQuery,
} from '@/lib/api/modules/enhanced/algorithm.enhanced'
import {
  getProject,
  useGetProjectQuery,
} from '@/lib/api/modules/enhanced/project.enhanced'
import { useLazyGetDecisionTreesQuery } from '@/lib/api/modules/enhanced/decisionTree.enhanced'
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
  const { open } = useContext(ModalContext)
  const { data: algorithm, isSuccess: isAlgorithmSuccess } =
    useGetAlgorithmQuery({ id: algorithmId })
  const { data: project, isSuccess: isProjectSuccess } = useGetProjectQuery({
    id: projectId,
  })

  /**
   * Opens the modal with the algorithm form
   */
  const handleOpenForm = () => {
    open({
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
              data-testid='create-decision-tree'
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
        const projectResponse = await store.dispatch(
          getProject.initiate({ id: projectId })
        )
        const algorithmResponse = await store.dispatch(
          getAlgorithm.initiate({ id: algorithmId })
        )

        if (projectResponse.isSuccess && algorithmResponse.isSuccess) {
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
        } else {
          return {
            notFound: true,
          }
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
