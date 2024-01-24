/**
 * The external imports
 */
import { useCallback } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Heading, Text, Tr, Td, Highlight } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import Page from '@/components/page'
import DataTable from '@/components/table/datatable'
import DiagramButton from '@/components/diagramButton'
import { wrapper } from '@/lib/store'
import { useLazyGetLastUpdatedDecisionTreesQuery } from '@/lib/api/modules/enhanced/project.enhanced'
import { extractTranslation } from '@/lib/utils/string'
import { formatDate } from '@/lib/utils/date'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useProject } from '@/lib/hooks/useProject'
import type { DecisionTree, RenderItemFn } from '@/types'

export default function Recents() {
  const { t } = useTranslation('recents')
  const { projectLanguage } = useProject()
  const {
    query: { projectId },
  } = useAppRouter()

  /**
   * Row definition for lastActivities datatable
   */
  const lastActivityRow = useCallback<RenderItemFn<DecisionTree>>(
    (row, searchTerm) => (
      <Tr data-testid='datatable-row'>
        <Td>
          <Text fontSize='sm' fontWeight='light'>
            <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
              {row.fullReference}
            </Highlight>
          </Text>
          <Text whiteSpace='normal'>
            <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
              {extractTranslation(row.labelTranslations, projectLanguage)}
            </Highlight>
          </Text>
        </Td>
        <Td>{row.algorithm.name}</Td>
        <Td>
          {extractTranslation(row.node.labelTranslations, projectLanguage)}
        </Td>
        <Td>{formatDate(new Date(row.updatedAt))}</Td>
        <Td>
          <DiagramButton
            href={`/projects/${projectId}/diagram/decision-tree/${row.id}`}
          >
            {t('openDecisionTree', { ns: 'datatable' })}
          </DiagramButton>
        </Td>
      </Tr>
    ),
    [t]
  )

  return (
    <Page title={t('title')}>
      <Heading>{t('heading')}</Heading>

      <DataTable
        source='lastActivities'
        apiQuery={useLazyGetLastUpdatedDecisionTreesQuery}
        requestParams={{ projectId }}
        renderItem={lastActivityRow}
        searchable
      />
    </Page>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  () =>
    async ({ locale }: GetServerSidePropsContext) => {
      if (typeof locale === 'string') {
        // Translations
        const translations = await serverSideTranslations(locale, [
          'common',
          'datatable',
          'projects',
          'recents',
        ])

        return {
          props: {
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
