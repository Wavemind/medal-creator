/**
 * The external imports
 */
import React, { useCallback, useEffect } from 'react'
import {
  Tag,
  Button,
  Heading,
  Highlight,
  HStack,
  Td,
  Tooltip,
  Tr,
  Text,
  VStack,
} from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import type { ReactElement } from 'react'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import DataTable from '@/components/table/datatable'
import MenuCell from '@/components/table/menuCell'
import Page from '@/components/page'
import VariableDetail from '@/components/modal/variableDetail'
import VariableStepper from '@/components/forms/variableStepper'
import { wrapper } from '@/lib/store'
import Layout from '@/lib/layouts/default'
import {
  useDestroyVariableMutation,
  useDuplicateVariableMutation,
  useLazyGetVariablesQuery,
} from '@/lib/api/modules/enhanced/variable.enhanced'
import CheckIcon from '@/assets/icons/Check'
import { camelize, extractTranslation } from '@/lib/utils/string'
import { useAlertDialog } from '@/lib/hooks/useAlertDialog'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useModal } from '@/lib/hooks/useModal'
import { useProject } from '@/lib/hooks/useProject'
import { useToast } from '@/lib/hooks/useToast'
import type { RenderItemFn, Scalars, Variable } from '@/types'

export default function Library() {
  const { t } = useTranslation('variables')
  const { newToast } = useToast()
  const { isAdminOrClinician, projectLanguage } = useProject()
  const {
    query: { projectId },
  } = useAppRouter()

  const { open: openAlertDialog } = useAlertDialog()
  const { open: openModal } = useModal()

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
      content: <VariableStepper />,
      size: '5xl',
    })
  }

  /**
   * Opens the form to edit a new variable
   */
  const handleEditClick = (id: string): void => {
    openModal({
      content: <VariableStepper variableId={id} />,
      size: '5xl',
    })
  }

  /**
   * Callback to handle the suppression of a variable
   */
  const onDestroy = useCallback(
    (diagnosisId: Scalars['ID']) => {
      openAlertDialog({
        title: t('delete', { ns: 'datatable' }),
        content: t('areYouSure', { ns: 'common' }),
        action: () => destroyVariable({ id: diagnosisId }),
      })
    },
    [t]
  )

  /**
   * Callback to handle the duplication of a variable
   */
  const onDuplicate = useCallback(
    (id: string) => {
      openAlertDialog({
        title: t('duplicate', { ns: 'datatable' }),
        content: t('areYouSure', { ns: 'common' }),
        action: () => duplicateVariable({ id }),
      })
    },
    [t]
  )

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
      <Tr data-testid='datatable-row'>
        <Td>
          <VStack alignItems='left'>
            <Text fontSize='sm' fontWeight='light'>
              {row.fullReference}
            </Text>
            <Text>
              <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
                {extractTranslation(row.labelTranslations, projectLanguage)}
              </Highlight>
            </Text>
          </VStack>
        </Td>

        <Td>{t(`categories.${row.type}.label`, { defaultValue: '' })}</Td>
        <Td>
          {row.conditionedByCcs?.map(ncc => (
            <Tag mx={1} key={`${row.id}-${ncc.id}`}>
              {extractTranslation(
                ncc.complaintCategory.labelTranslations,
                projectLanguage
              )}
            </Tag>
          ))}
        </Td>
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
                data-testid='variable-edit-button'
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
            canDestroy={!row.hasInstances && !row.isDefault && !row.isDeployed}
          />
        </Td>
      </Tr>
    ),
    [t, isAdminOrClinician]
  )

  return (
    <Page title={t('title')}>
      <HStack justifyContent='space-between' mb={12}>
        <Heading as='h1'>{t('heading')}</Heading>
        {isAdminOrClinician && (
          <Button
            data-testid='create-variable'
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
  () =>
    async ({ locale }: GetServerSidePropsContext) => {
      if (typeof locale === 'string') {
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
