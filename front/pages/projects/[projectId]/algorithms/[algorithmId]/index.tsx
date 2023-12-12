/**
 * The external imports
 */
import { ReactElement, useCallback } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Heading, Button, HStack, Spinner, Tooltip } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
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
import { useLazyGetDecisionTreesQuery } from '@/lib/api/modules/enhanced/decisionTree.enhanced'
import { useModal } from '@/lib/hooks/useModal'
import { useProject } from '@/lib/hooks/useProject'
import {
  Algorithm,
  RenderItemFn,
  DecisionTree,
  AlgorithmPage,
  AlgorithmStatusEnum,
} from '@/types'

export default function Algorithm({ algorithmId }: AlgorithmPage) {
  const { isAdminOrClinician } = useProject()
  const { t } = useTranslation('decisionTrees')
  const { open } = useModal()

  const { data: algorithm, isSuccess: isAlgorithmSuccess } =
    useGetAlgorithmQuery({ id: algorithmId })

  /**
   * Opens the modal with the algorithm form
   */
  const handleOpenForm = () => {
    open({
      content: <DecisionTreeStepper algorithmId={algorithmId} />,
    })
  }

  /**
   * One row of decision tree
   */
  const decisionTreeRow = useCallback<RenderItemFn<DecisionTree>>(
    (row, searchTerm) => <DecisionTreeRow row={row} searchTerm={searchTerm} />,
    [t]
  )

  if (isAlgorithmSuccess) {
    return (
      <Page title={algorithm.name}>
        <HStack justifyContent='space-between' mb={12}>
          <Heading as='h1'>{t('title')}</Heading>
          {isAdminOrClinician && (
            <Tooltip
              label={t('tooltip.inProduction', { ns: 'common' })}
              hasArrow
              isDisabled={algorithm.status == AlgorithmStatusEnum.Draft}
            >
              <Button
                data-testid='create-decision-tree'
                onClick={handleOpenForm}
                variant='outline'
                isDisabled={[
                  AlgorithmStatusEnum.Prod,
                  AlgorithmStatusEnum.Archived,
                ].includes(algorithm.status)}
              >
                {t('new')}
              </Button>
            </Tooltip>
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
      const { algorithmId } = query

      if (typeof locale === 'string' && typeof algorithmId === 'string') {
        const algorithmResponse = await store.dispatch(
          getAlgorithm.initiate({ id: algorithmId })
        )

        if (algorithmResponse.isSuccess) {
          // Translations
          const translations = await serverSideTranslations(locale, [
            'common',
            'datatable',
            'submenu',
            'algorithms',
            'decisionTrees',
            'diagnoses',
            'diagram',
          ])

          return {
            props: {
              algorithmId,
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
