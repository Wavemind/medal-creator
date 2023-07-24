/**
 * The external imports
 */
import { useCallback, useContext, useEffect } from 'react'
import {
  Button,
  Heading,
  Highlight,
  HStack,
  Td,
  Tooltip,
  Tr,
} from '@chakra-ui/react'
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
import { CheckIcon } from '@/assets/icons'
import { camelize, extractTranslation } from '@/lib/utils'
import { apiGraphql } from '@/lib/api/apiGraphql'
import { AlertDialogContext, ModalContext } from '@/lib/contexts'
import { useToast } from '@/lib/hooks'
import type { LibraryPage, RenderItemFn, Scalars, Variable } from '@/types'
import { FormEnvironments } from '@/lib/config/constants'

export default function Library({
  projectId,
  isAdminOrClinician,
}: LibraryPage) {
  const { t } = useTranslation('variables')
  const { newToast } = useToast()

  const { data: project } = useGetProjectQuery({ id: projectId })

  const { open: openAlertDialog } = useContext(AlertDialogContext)
  const { open: openModal } = useContext(ModalContext)

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
  const handleNewClick = (): void => {
    openModal({
      content: (
        <VariableStepper
          projectId={projectId}
          formEnvironment={FormEnvironments.Default}
        />
      ),
      size: '5xl',
    })
  }

  /**
   * Opens the form to edit a new variable
   */
  const handleEditClick = (id: string): void => {
    openModal({
      content: (
        <VariableStepper
          projectId={projectId}
          variableId={id}
          formEnvironment={FormEnvironments.Default}
        />
      ),
      size: '5xl',
    })
  }

  /**
   * Callback to handle the suppression of a variable
   */
  const onDestroy = useCallback((diagnosisId: Scalars['ID']) => {
    openAlertDialog({
      title: t('delete', { ns: 'datatable' }),
      content: t('areYouSure', { ns: 'common' }),
      action: () => destroyVariable({ id: diagnosisId }),
    })
  }, [])

  /**
   * Callback to handle the duplication of a variable
   */
  const onDuplicate = useCallback((id: string) => {
    openAlertDialog({
      title: t('duplicate', { ns: 'datatable' }),
      content: t('areYouSure', { ns: 'common' }),
      action: () => duplicateVariable({ id }),
    })
  }, [])

  /**
   * Callback to handle the info action in the table menu
   */
  const onInfo = useCallback(async (id: string) => {
    openModal({
      content: <VariableDetail variableId={id} />,
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
            {extractTranslation(row.labelTranslations, project!.language.code)}
          </Highlight>
        </Td>
        <Td>{t(`categories.${row.type}.label`, { defaultValue: '' })}</Td>
        <Td>
          {t(`answerTypes.${camelize(row.answerType.labelKey)}`, {
            defaultValue: '',
          })}
        </Td>
        <Td textAlign='center'>
          {row.isNeonat && <CheckIcon h={8} w={8} color='success' />}
        </Td>
        <Td>
          {isAdminOrClinician && (
            <Tooltip
              label={t('hasInstances', { ns: 'datatable' })}
              hasArrow
              isDisabled={!row.isDefault}
            >
              <Button
                data-cy='variable_edit_button'
                onClick={() => handleEditClick(row.id)}
                minW={24}
                isDisabled={row.isDefault}
              >
                {t('edit', { ns: 'datatable' })}
              </Button>
            </Tooltip>
          )}
        </Td>
        <Td>
          <MenuCell
            itemId={row.id}
            onInfo={onInfo}
            canDuplicate={!row.isDefault}
            onDuplicate={isAdminOrClinician ? onDuplicate : undefined}
            onDestroy={isAdminOrClinician ? onDestroy : undefined}
            canDestroy={!row.hasInstances && !row.isDefault}
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

      if (typeof locale === 'string' && typeof projectId === 'string') {
        store.dispatch(getProject.initiate({ id: projectId }))
        await Promise.all(
          store.dispatch(apiGraphql.util.getRunningQueriesThunk())
        )

        // Translations
        const translations = await serverSideTranslations(locale, [
          'common',
          'datatable',
          'projects',
          'variables',
          'validations',
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
