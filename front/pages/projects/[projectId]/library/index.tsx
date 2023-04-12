/**
 * The external imports
 */
import {
  Button,
  Heading,
  Highlight,
  HStack,
  Spinner,
  Td,
  Tr,
} from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import type { GetServerSidePropsContext } from 'next'
import { ReactElement, useCallback } from 'react'

/**
 * The internal imports
 */
import { DataTable, MenuCell, Page } from '@/components'
import { wrapper } from '@/lib/store'
import Layout from '@/lib/layouts/default'
import { useLazyGetVariablesQuery } from '@/lib/api/modules'
import type { LibraryPage, RenderItemFn, Variable } from '@/types'

export default function Library({
  projectId,
  isAdminOrClinician,
}: LibraryPage) {
  const { t } = useTranslation('variables')

  const handleOpenForm = () => {
    console.log('TODO: Open the create')
  }

  const handleEditClick = () => {
    console.log('TODO: Open the edit')
  }

  /**
   * Row definition for algorithms datatable
   */
  const variableRow = useCallback<RenderItemFn<Variable>>(
    (row, searchTerm) => (
      <Tr data-cy='datatable_row' _hover={{ bg: 'yellow' }}>
        <Td>
          <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
            {row.labelTranslations.en}
          </Highlight>
        </Td>
        <Td>{row.type}</Td>
        <Td>{row.answerType.value}</Td>
        <Td>
          <Button onClick={handleEditClick}>
            {t('edit', { ns: 'datatable' })}
          </Button>
        </Td>
        <Td>
          <MenuCell itemId={row.id} />
        </Td>
      </Tr>
    ),
    [t]
  )

  return (
    <Page title={t('title')}>
      <HStack justifyContent='space-between' mb={12}>
        <Heading as='h1'>{t('heading')}</Heading>
        {isAdminOrClinician && (
          <Button
            data-cy='create_algorithm'
            onClick={handleOpenForm}
            variant='outline'
          >
            {t('createVariable')}
          </Button>
        )}
      </HStack>
      <DataTable
        source='variables'
        searchable
        apiQuery={useLazyGetVariablesQuery}
        requestParams={{ projectId }}
        renderItem={variableRow}
      />
    </Page>
  )

  return <Spinner size='xl' />
}

Library.getLayout = function getLayout(page: ReactElement) {
  return <Layout menuType='library'>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, query }: GetServerSidePropsContext) => {
      const { projectId } = query

      if (typeof locale === 'string') {
        // Translations
        const translations = await serverSideTranslations(locale, [
          'common',
          'datatable',
          'projects',
          'variables',
          'submenu',
        ])

        return {
          props: {
            projectId,
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
