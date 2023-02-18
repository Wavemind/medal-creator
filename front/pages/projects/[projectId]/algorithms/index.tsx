/**
 * The external imports
 */
import { useCallback, useContext, useEffect } from 'react'
import { Heading, Button, HStack, Tr, Td, Highlight } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { ModalContext, AlertDialogContext } from '@/lib/contexts'
import {
  AlgorithmForm,
  Page,
  DataTable,
  MenuCell,
  OptimizedLink,
} from '@/components'
import { wrapper } from '@/lib/store'
import { setSession } from '@/lib/store/session'
import {
  useLazyGetAlgorithmsQuery,
  useDestroyAlgorithmMutation,
} from '@/lib/services/modules/algorithm'
import { getProject } from '@/lib/services/modules/project'
import getUserBySession from '@/lib/utils/getUserBySession'
import { apiGraphql } from '@/lib/services/apiGraphql'
import { getLanguages } from '@/lib/services/modules/language'
import { useToast } from '@/lib/hooks'
import { formatDate } from '@/lib/utils/date'
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'
import { Algorithm } from '@/types/algorithm'
import { RenderItemFn } from '@/types/datatable'

type AlgorithmsProps = {
  projectId: number
  userCanEdit: boolean
}

export default function Algorithms({
  projectId,
  userCanEdit,
}: AlgorithmsProps) {
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
          <OptimizedLink
            href={`/projects/${projectId}/algorithms/${row.id}`}
            variant='solid'
            data-cy='datatable_show'
          >
            {t('openAlgorithm', { ns: 'datatable' })}
          </OptimizedLink>
        </Td>
        <Td>
          <MenuCell
            itemId={row.id}
            onEdit={userCanEdit ? () => onEdit(row.id) : undefined}
            onArchive={
              row.status !== 'archived' && userCanEdit
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
        {userCanEdit && (
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
    async ({ locale, req, res, query }: GetServerSidePropsContext) => {
      const { projectId } = query

      if (typeof locale === 'string') {
        const currentUser = getUserBySession(
          req as NextApiRequest,
          res as NextApiResponse
        )
        store.dispatch(setSession(currentUser))
        store.dispatch(getProject.initiate(Number(projectId)))
        await Promise.all(
          store.dispatch(apiGraphql.util.getRunningQueriesThunk())
        )
        await store.dispatch(getLanguages.initiate())

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
            userCanEdit: ['admin', 'clinician'].includes(currentUser.role), // TODO WAIT FOR UNISANTE
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
