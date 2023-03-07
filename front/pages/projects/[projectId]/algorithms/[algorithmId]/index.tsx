/**
 * The external imports
 */
import { ReactElement, useCallback, useContext } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Heading, Button, HStack } from '@chakra-ui/react'
import { getServerSession } from 'next-auth'
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
import { getProject, useGetProjectQuery } from '@/lib/services/modules/project'
import {
  getAlgorithm,
  useGetAlgorithmQuery,
} from '@/lib/services/modules/algorithm'
import { apiGraphql } from '@/lib/services/apiGraphql'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { useLazyGetDecisionTreesQuery } from '@/lib/services/modules/decisionTree'
import type { Project } from '@/types/project'
import type { Algorithm } from '@/types/algorithm'
import type { RenderItemFn } from '@/types/datatable'
import type { DecisionTree } from '@/types/decisionTree'
import { isAdminOrClinician } from '@/lib/utils/access'

/**
 * Type definitions
 */
type AlgorithmProps = {
  projectId: number
  algorithmId: number
  canCrud: boolean
}

export default function Algorithm({
  projectId,
  algorithmId,
  canCrud,
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
    async ({ locale, req, res, query }: GetServerSidePropsContext) => {
      const { projectId, algorithmId } = query

      if (typeof locale === 'string') {
        const session = await getServerSession(req, res, authOptions)

        if (session) {
          store.dispatch(getProject.initiate(Number(projectId)))
          store.dispatch(getAlgorithm.initiate(Number(algorithmId)))
          await Promise.all(
            store.dispatch(apiGraphql.util.getRunningQueriesThunk())
          )

          // Calculates whether the current user can perform CRUD actions on decision trees
          const canCrud = isAdminOrClinician(session.user.role)

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
      }

      return {
        redirect: {
          destination: '/500',
          permanent: false,
        },
      }
    }
)
