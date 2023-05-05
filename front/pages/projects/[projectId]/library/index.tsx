/**
 * The external imports
 */
import { useCallback, useContext } from 'react'
import { Button, Heading, Highlight, HStack, Td, Tr } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import type { ReactElement } from 'react'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import { DataTable, MenuCell, Page, VariableDetail } from '@/components'
import { wrapper } from '@/lib/store'
import Layout from '@/lib/layouts/default'
import {
  getProject,
  useGetProjectQuery,
  useLazyGetVariablesQuery,
} from '@/lib/api/modules'
import { VariableService } from '@/lib/services'
import { CheckIcon } from '@/assets/icons'
import { camelize } from '@/lib/utils'
import { apiGraphql } from '@/lib/api/apiGraphql'
import { ModalContext } from '@/lib/contexts'
import type { LibraryPage, RenderItemFn, Variable } from '@/types'

export default function Library({
  projectId,
  isAdminOrClinician,
}: LibraryPage) {
  const { t } = useTranslation('variables')

  const { data: project } = useGetProjectQuery(projectId)

  const { openModal } = useContext(ModalContext)

  /**
   * Opens the form to create a new variable
   */
  const handleNewClick = () => {
    console.log('TODO: Open the create')
  }

  /**
   * Opens the form to edit a new variable
   */
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
  const onInfo = useCallback(async (id: number) => {
    openModal({
      content: <VariableDetail variableId={Number(id)} />,
      size: '5xl',
    })
  }, [])

  /**
   * Row definition for algorithms datatable
   */
  const variableRow = useCallback<RenderItemFn<Variable>>(
    (row, searchTerm) => (
      <Tr data-cy='datatable_row'>
        <Td>
          <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
            {row.labelTranslations[project?.language.code || 'en']}
          </Highlight>
        </Td>
        <Td>
          {t(
            `categories.${VariableService.extractCategoryKey(row.type)}.label`,
            { defaultValue: '' }
          )}
        </Td>
        <Td>
          {t(`answerTypes.${camelize(row.answerType.value)}`, {
            defaultValue: '',
          })}
        </Td>
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
            canDestroy={!row.hasInstances}
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
}

Library.getLayout = function getLayout(page: ReactElement) {
  return <Layout menuType='library'>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, query }: GetServerSidePropsContext) => {
      const { projectId } = query

      if (typeof locale === 'string') {
        store.dispatch(getProject.initiate(Number(projectId)))
        await Promise.all(
          store.dispatch(apiGraphql.util.getRunningQueriesThunk())
        )

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
