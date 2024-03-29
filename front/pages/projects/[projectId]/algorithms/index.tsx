/**
 * The external imports
 */
import { useCallback, useEffect, useState } from 'react'
import { Heading, Button, HStack, Tr, Td, Highlight } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Link } from '@chakra-ui/next-js'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import AlgorithmForm from '@/components/forms/algorithm'
import Page from '@/components/page'
import Duplicate from '@/components/duplicate'
import DataTable from '@/components/table/datatable'
import MenuCell from '@/components/table/menuCell'
import { wrapper } from '@/lib/store'
import {
  useLazyGetAlgorithmsQuery,
  useDestroyAlgorithmMutation,
  useDuplicateAlgorithmMutation,
} from '@/lib/api/modules/enhanced/algorithm.enhanced'
import { getLanguages } from '@/lib/api/modules/enhanced/language.enhanced'
import { useAlertDialog } from '@/lib/hooks/useAlertDialog'
import AlgorithmStatus from '@/components/algorithmStatus'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useModal } from '@/lib/hooks/useModal'
import { useToast } from '@/lib/hooks/useToast'
import { useProject } from '@/lib/hooks/useProject'
import { formatDate } from '@/lib/utils/date'
import WebSocketProvider from '@/lib/providers/webSocket'
import { Algorithm, AlgorithmStatusEnum, RenderItemFn, Scalars } from '@/types'

export default function Algorithms() {
  const { t } = useTranslation('algorithms')
  const { open: openModal } = useModal()
  const { open: openAlertDialog } = useAlertDialog()
  const { newToast } = useToast()
  const { isAdminOrClinician } = useProject()
  const {
    query: { projectId },
  } = useAppRouter()

  const [isDuplicating, setIsDuplicating] = useState(false)

  const [
    destroyAlgorithm,
    { isSuccess: isDestroySuccess, isError: isDestroyError },
  ] = useDestroyAlgorithmMutation()
  const [
    duplicateAlgorithm,
    { isError: isDuplicateError, error: duplicateError },
  ] = useDuplicateAlgorithmMutation()

  /**
   * Opens the modal with the algorithm form
   */
  const handleOpenForm = () => {
    openModal({
      title: t('new'),
      content: <AlgorithmForm />,
    })
  }

  /**
   * Callback to handle the edit action in the table menu
   */
  const onEdit = useCallback(
    (algorithmId: Scalars['ID']) => {
      openModal({
        title: t('edit'),
        content: <AlgorithmForm algorithmId={algorithmId} />,
      })
    },
    [t]
  )

  /**
   * Callback to handle the archive an algorithm
   */
  const onArchive = useCallback(
    (algorithmId: Scalars['ID']) => {
      openAlertDialog({
        title: t('archive'),
        content: t('areYouSure', { ns: 'common' }),
        action: () => destroyAlgorithm({ id: algorithmId }),
      })
    },
    [t]
  )

  /**
   * Callback to handle the duplication an algorithm
   */
  const onDuplicate = useCallback(
    (algorithmId: Scalars['ID']) => {
      openAlertDialog({
        title: t('duplicate'),
        content: t('areYouSure', { ns: 'common' }),
        action: () => {
          duplicateAlgorithm({ id: algorithmId })
        },
      })
    },
    [t]
  )

  /**
   * Queue toast if successful destruction
   */
  useEffect(() => {
    if (isDestroySuccess) {
      newToast({
        message: t('notifications.archiveSuccess', { ns: 'common' }),
        status: 'success',
      })
    }
  }, [isDestroySuccess])

  /**
   * Queue toast if error during destruction
   */
  useEffect(() => {
    if (isDestroyError) {
      newToast({
        message: t('notifications.archiveError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [isDestroyError])

  /**
   * Queue toast if error during duplication
   */
  useEffect(() => {
    if (isDuplicateError) {
      newToast({
        message: t('notifications.duplicateError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [isDuplicateError])

  /**
   * Row definition for algorithms datatable
   */
  const algorithmRow = useCallback<RenderItemFn<Algorithm>>(
    (row, searchTerm) => (
      <Tr data-testid='datatable-row'>
        <Td>
          <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
            {row.name}
          </Highlight>
        </Td>
        <Td>{t(`enum.mode.${row.mode}`, { defaultValue: '' })}</Td>
        <Td>
          <AlgorithmStatus status={row.status} />
        </Td>
        <Td>{formatDate(new Date(row.updatedAt))}</Td>
        <Td>
          <Link
            href={`/projects/${projectId}/algorithms/${row.id}`}
            variant='solid'
            data-testid='datatable-show'
          >
            {t('openAlgorithm', { ns: 'datatable' })}
          </Link>
        </Td>
        <Td>
          {isAdminOrClinician && (
            <MenuCell
              itemId={row.id}
              onEdit={
                row.status === AlgorithmStatusEnum.Draft
                  ? () => onEdit(row.id)
                  : undefined
              }
              canDuplicate={!isDuplicating}
              onDuplicate={() => onDuplicate(row.id)}
              onArchive={
                row.status !== AlgorithmStatusEnum.Archived
                  ? () => onArchive(row.id)
                  : undefined
              }
              tooltip={{
                duplicate: t('tooltip.isDefault', { ns: 'datatable' }),
              }}
            />
          )}
        </Td>
      </Tr>
    ),
    [t, isAdminOrClinician, isDuplicating]
  )

  return (
    <Page title={t('title')}>
      <WebSocketProvider channel='JobStatusChannel' job='duplication'>
        <HStack justifyContent='space-between' mb={12}>
          <Heading as='h1'>{t('heading')}</Heading>
          {isAdminOrClinician && (
            <Button
              data-testid='create-algorithm'
              onClick={handleOpenForm}
              variant='outline'
            >
              {t('new')}
            </Button>
          )}
        </HStack>

        <Duplicate error={duplicateError} setIsDuplicating={setIsDuplicating} />

        <DataTable
          source='algorithms'
          searchable
          apiQuery={useLazyGetAlgorithmsQuery}
          requestParams={{ projectId }}
          renderItem={algorithmRow}
        />
      </WebSocketProvider>
    </Page>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale }: GetServerSidePropsContext) => {
      if (typeof locale === 'string') {
        const languageResponse = await store.dispatch(getLanguages.initiate())

        if (languageResponse.isSuccess) {
          // Translations
          const translations = await serverSideTranslations(locale, [
            'common',
            'datatable',
            'projects',
            'algorithms',
            'validations',
          ])

          return {
            props: {
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
