/**
 * The external imports
 */
import { useCallback, useContext, useEffect } from 'react'
import { Heading, Button, HStack, Tr, Td, Highlight } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Link } from '@chakra-ui/next-js'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import { ModalContext, AlertDialogContext } from '@/lib/contexts'
import { AlgorithmForm, Page, DataTable, MenuCell } from '@/components'
import { wrapper } from '@/lib/store'
import {
  useLazyGetAlgorithmsQuery,
  useDestroyAlgorithmMutation,
  getProject,
  getLanguages,
} from '@/lib/api/modules'
import { apiGraphql } from '@/lib/api/apiGraphql'
import { useToast } from '@/lib/hooks'
import { formatDate } from '@/lib/utils'
import type { Algorithm, RenderItemFn, AlgorithmsPage } from '@/types'

export default function Algorithms({
  projectId,
  isAdminOrClinician,
}: AlgorithmsPage) {
  const { t } = useTranslation('algorithms')
  const { openModal } = useContext(ModalContext)
  const { openAlertDialog } = useContext(AlertDialogContext)
  const { newToast } = useToast()
  const [
    destroyAlgorithm,
    { isSuccess: isDestroySuccess, isError: isDestroyError },
  ] = useDestroyAlgorithmMutation()

  /**
   * Opens the modal with the algorithm form
   */
  const handleOpenForm = () => {
    openModal({
      title: t('new'),
      content: <AlgorithmForm projectId={projectId} />,
    })
  }

  /**
   * Callback to handle the edit action in the table menu
   */
  const onEdit = useCallback((algorithmId: number) => {
    openModal({
      title: t('edit'),
      content: (
        <AlgorithmForm projectId={projectId} algorithmId={algorithmId} />
      ),
    })
  }, [])

  /**
   * Callback to handle the archive an algorithm
   */
  const onArchive = useCallback(
    (algorithmId: number) => {
      openAlertDialog({
        title: t('archive'),
        content: t('areYouSure', { ns: 'common' }),
        action: () => destroyAlgorithm(algorithmId),
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
        message: t('notifications.destroyError', { ns: 'common' }),
        status: 'error',
      })
    }
  }, [isDestroyError])

  /**
   * Row definition for algorithms datatable
   */
  const algorithmRow = useCallback<RenderItemFn<Algorithm>>(
    (row, searchTerm) => (
      <Tr data-cy='datatable_row'>
        <Td>
          <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
            {row.name}
          </Highlight>
        </Td>
        <Td>{t(`enum.mode.${row.mode}`)}</Td>
        <Td>{t(`enum.status.${row.status}`)}</Td>
        <Td>{formatDate(new Date(row.updatedAt))}</Td>
        <Td>
          <Link
            href={`/projects/${projectId}/algorithms/${row.id}`}
            variant='solid'
            data-cy='datatable_show'
          >
            {t('openAlgorithm', { ns: 'datatable' })}
          </Link>
        </Td>
        <Td>
          <MenuCell
            itemId={row.id}
            onEdit={isAdminOrClinician ? () => onEdit(row.id) : undefined}
            onArchive={
              row.status !== 'archived' && isAdminOrClinician
                ? () => onArchive(row.id)
                : undefined
            }
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
            onClick={handleOpenForm}
            variant='outline'
          >
            {t('new')}
          </Button>
        )}
      </HStack>

      <DataTable
        source='algorithms'
        searchable
        apiQuery={useLazyGetAlgorithmsQuery}
        requestParams={{ projectId }}
        renderItem={algorithmRow}
      />
    </Page>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, query }: GetServerSidePropsContext) => {
      const { projectId } = query

      if (typeof locale === 'string') {
        store.dispatch(getProject.initiate(Number(projectId)))
        store.dispatch(getLanguages.initiate())
        await Promise.all(
          store.dispatch(apiGraphql.util.getRunningQueriesThunk())
        )

        // Translations
        const translations = await serverSideTranslations(locale, [
          'common',
          'datatable',
          'projects',
          'algorithms',
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
