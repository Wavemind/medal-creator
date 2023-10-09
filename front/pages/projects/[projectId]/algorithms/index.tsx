/**
 * The external imports
 */
import { useCallback, useEffect } from 'react'
import {
  Heading,
  Button,
  HStack,
  Tr,
  Td,
  Highlight,
  Spinner,
} from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Link } from '@chakra-ui/next-js'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import AlgorithmForm from '@/components/forms/algorithm'
import Page from '@/components/page'
import DataTable from '@/components/table/datatable'
import MenuCell from '@/components/table/menuCell'
import { wrapper } from '@/lib/store'
import {
  useLazyGetAlgorithmsQuery,
  useDestroyAlgorithmMutation,
} from '@/lib/api/modules/enhanced/algorithm.enhanced'
import {
  getProject,
  useGetProjectQuery,
} from '@/lib/api/modules/enhanced/project.enhanced'
import { getLanguages } from '@/lib/api/modules/enhanced/language.enhanced'
import { useAlertDialog, useModal, useToast } from '@/lib/hooks'
import { formatDate } from '@/lib/utils/date'
import { useProject } from '@/lib/hooks'
import type { Algorithm, RenderItemFn, AlgorithmsPage, Scalars } from '@/types'

export default function Algorithms({ projectId }: AlgorithmsPage) {
  const { isAdminOrClinician } = useProject()
  const { t } = useTranslation('algorithms')
  const { open: openModal } = useModal()
  const { open: openAlertDialog } = useAlertDialog()
  const { newToast } = useToast()

  const { data: project, isSuccess: isProjectSuccess } = useGetProjectQuery({
    id: projectId,
  })
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
  const onEdit = useCallback(
    (algorithmId: Scalars['ID']) => {
      openModal({
        title: t('edit'),
        content: (
          <AlgorithmForm projectId={projectId} algorithmId={algorithmId} />
        ),
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
      <Tr data-testid='datatable-row'>
        <Td>
          <Highlight query={searchTerm} styles={{ bg: 'red.100' }}>
            {row.name}
          </Highlight>
        </Td>
        <Td>{t(`enum.mode.${row.mode}`, { defaultValue: '' })}</Td>
        <Td>{t(`enum.status.${row.status}`, { defaultValue: '' })}</Td>
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
              onEdit={() => onEdit(row.id)}
              onArchive={
                row.status !== 'archived' && project?.isCurrentUserAdmin
                  ? () => onArchive(row.id)
                  : undefined
              }
            />
          )}
        </Td>
      </Tr>
    ),
    [t]
  )

  if (isProjectSuccess) {
    return (
      <Page title={t('title')}>
        <HStack justifyContent='space-between' mb={12}>
          <Heading as='h1'>{t('heading')}</Heading>
          {project.isCurrentUserAdmin && (
            <Button
              data-testid='new-algorithm'
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

  return <Spinner />
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, query }: GetServerSidePropsContext) => {
      const { projectId } = query

      if (typeof locale === 'string' && typeof projectId === 'string') {
        const projectResponse = await store.dispatch(
          getProject.initiate({ id: projectId })
        )
        const languageResponse = await store.dispatch(getLanguages.initiate())

        if (projectResponse.isSuccess && languageResponse.isSuccess) {
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
              projectId,
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
