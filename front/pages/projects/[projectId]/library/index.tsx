/**
 * The external imports
 */
import { useCallback } from 'react'
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
import type { ReactElement } from 'react'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import { DataTable, MenuCell, Page } from '@/components'
import { wrapper } from '@/lib/store'
import Layout from '@/lib/layouts/default'
import { useLazyGetVariablesQuery } from '@/lib/api/modules'
import { VariableService } from '@/lib/services'
import { CheckIcon } from '@/assets/icons'
import { camelize } from '@/lib/utils'
import type { LibraryPage, RenderItemFn, Variable } from '@/types'

export default function Library({
  projectId,
  isAdminOrClinician,
}: LibraryPage) {
  const { t } = useTranslation('variables')

  const handleNewClick = () => {
    console.log('TODO: Open the create')
  }

  const handleEditClick = () => {
    console.log('TODO: Open the edit')
  }

    /**
   * Callback to handle the suppression of a decision tree
   */
    const onDestroy = useCallback((id: number) => {
      console.log('TODO : On destroy', id)
    }, [])
  
    /**
     * Callback to handle the duplication of a decision tree
     */
    const onDuplicate = useCallback((id: number) => {
      console.log('TODO : On duplicate', id)
    }, [])
    
    /**
     * Callback to handle the info action in the table menu
    */
   const onInfo = useCallback((id: number) => {
     console.log('TODO : On info', id)
  }, [])

  /**
   * Row definition for algorithms datatable
   */
  const variableRow = useCallback<RenderItemFn<Variable>>(
    (row, searchTerm) => (
      <Tr data-cy='datatable_row'>
        <Td>
          <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
            {row.labelTranslations.en}
          </Highlight>
        </Td>
        <Td>
          {t(
            `categories.${VariableService.extractCategoryKey(row.type)}.label`
          )}
        </Td>
        <Td>{t(`answerTypes.${camelize(row.answerType.value)}`)}</Td>
        <Td textAlign='center'>
          {row.isNeonat && <CheckIcon h={8} w={8} color='success' />}
        </Td>
        <Td>
          <Button onClick={handleEditClick} minW={24}>
            {t('edit', { ns: 'datatable' })}
          </Button>
        </Td>
        <Td>
          <MenuCell
            itemId={row.id}
            onInfo={onInfo}
            onDuplicate={onDuplicate}
            onDestroy={onDestroy}
          />
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
            onClick={handleNewClick}
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
  () =>
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
