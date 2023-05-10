/**
 * The external imports
 */
import { useCallback, useContext, useEffect } from 'react'
import { Button, Heading, Highlight, HStack, Td, Tr } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import type { ReactElement } from 'react'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import {
  DataTable,
  MenuCell,
  Page,
  VariableDetail,
  VariableStepper,
} from '@/components'
import { wrapper } from '@/lib/store'
import Layout from '@/lib/layouts/default'
import {
  getProject,
  useDestroyVariableMutation,
  useDuplicateVariableMutation,
  useGetProjectQuery,
  useLazyGetVariablesQuery,
} from '@/lib/api/modules'
import { VariableService } from '@/lib/services'
import { CheckIcon } from '@/assets/icons'
import { camelize } from '@/lib/utils'
import { apiGraphql } from '@/lib/api/apiGraphql'
import { AlertDialogContext, ModalContext } from '@/lib/contexts'
import { useToast } from '@/lib/hooks'
import type { LibraryPage, RenderItemFn, Variable } from '@/types'

export default function Library({
  projectId,
  isAdminOrClinician,
}: LibraryPage) {
  const { t } = useTranslation('variables')
  const { newToast } = useToast()

  const { data: project } = useGetProjectQuery(projectId)

  const { openAlertDialog } = useContext(AlertDialogContext)
  const { openModal } = useContext(ModalContext)

  const [
    duplicateVariable,
    { isSuccess: isDuplicateSuccess, isError: isDuplicateError },
  ] = useDuplicateVariableMutation()

  const [
    destroyVariable,
    { isSuccess: isDestroySuccess, isError: isDestroyError },
  ] = useDestroyVariableMutation()

  /**
   * Opens the form to create a new variable
   */
  const handleNewClick = () => {
    openModal({
      content: <VariableStepper projectId={projectId} />,
    })
  }

  /**
   * Opens the form to edit a new variable
   */
  const handleEditClick = () => {
    console.log('TODO: Open the edit')
  }

  /**
   * Callback to handle the suppression of a variable
   */
  const onDestroy = useCallback((diagnosisId: number) => {
    openAlertDialog({
      title: t('delete', { ns: 'datatable' }),
      content: t('areYouSure', { ns: 'common' }),
      action: () => destroyVariable(Number(diagnosisId)),
    })
  }, [])

  /**
   * Callback to handle the duplication of a variable
   */
  const onDuplicate = useCallback((id: number) => {
    openAlertDialog({
      title: t('duplicate', { ns: 'datatable' }),
      content: t('areYouSure', { ns: 'common' }),
      action: () => duplicateVariable(Number(id)),
    })
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

  useEffect(() => {
    if (isDuplicateSuccess) {
      newToast({
        message: t('notifications.duplicateSuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isDuplicateSuccess])

  useEffect(() => {
    if (isDuplicateError) {
      newToast({
        message: t('notifications.duplicateError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [isDuplicateError])

  useEffect(() => {
    if (isDestroySuccess) {
      newToast({
        message: t('notifications.destroySuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isDestroySuccess])

  useEffect(() => {
    if (isDestroyError) {
      newToast({
        message: t('notifications.destroyError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [isDestroyError])

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
          {isAdminOrClinician && (
            <Button onClick={handleEditClick} minW={24}>
              {t('edit', { ns: 'datatable' })}
            </Button>
          )}
        </Td>
        <Td>
          <MenuCell
            itemId={row.id}
            onInfo={onInfo}
            onDuplicate={isAdminOrClinician ? onDuplicate : undefined}
            onDestroy={isAdminOrClinician ? onDestroy : undefined}
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
            data-cy='create_variable'
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
