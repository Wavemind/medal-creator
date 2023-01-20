/**
 * The external imports
 */
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { Heading, Button, HStack, Tr, Td } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { ModalContext, AlertDialogContext } from '/lib/contexts'
import { AlgorithmForm, Page, DataTable, MenuCell } from '/components'
import { wrapper } from '/lib/store'
import { setSession } from '/lib/store/session'
import {
  useLazyGetAlgorithmsQuery,
  useDestroyAlgorithmMutation,
} from '/lib/services/modules/algorithm'
import { getProject } from '/lib/services/modules/project'
import getUserBySession from '/lib/utils/getUserBySession'
import { apiGraphql } from '/lib/services/apiGraphql'
import { getLanguages } from '/lib/services/modules/language'
import { useToast } from '/lib/hooks'
import { formatDate } from '/lib/utils/date'

export default function Algorithms({ projectId, currentUser }) {
  const { t } = useTranslation('algorithms')
  const { openModal } = useContext(ModalContext)
  const { openAlertDialog } = useContext(AlertDialogContext)
  const { newToast } = useToast()
  const [
    destroyAlgorithm,
    { isSuccess: isDestroySuccess, isError: isDestroyError },
  ] = useDestroyAlgorithmMutation()

  /**
   * Calculates whether the current user can perform CRUD actions on algorithms
   */
  const canCrud = useMemo(
    () => ['admin', 'clinician'].includes(currentUser.role),
    []
  )

  /**
   * Opens the modal with the algorithm form
   */
  const handleOpenForm = () => {
    openModal({
      title: t('create'),
      content: <AlgorithmForm projectId={projectId} />,
      size: 'xl',
    })
  }

  /**
   * Callback to handle the edit action in the table menu
   */
  const onEdit = useCallback(algorithmId => {
    openModal({
      title: t('edit'),
      content: (
        <AlgorithmForm projectId={projectId} algorithmId={algorithmId} />
      ),
      size: 'xl',
    })
  }, [])

  /**
   * Callback to handle the delete action in the table menu
   */
  const onDestroy = useCallback(algorithmId => {
    openAlertDialog(t('delete'), t('areYouSure', { ns: 'common' }), () =>
      destroyAlgorithm(algorithmId)
    )
  }, [])

  /**
   * Queue toast if successful destruction
   */
  useEffect(() => {
    if (isDestroySuccess) {
      newToast({
        message: t('notifications.destroySuccess', { ns: 'common' }),
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
   * Handles the button click in the table
   * @param {*} info
   */
  const handleButtonClick = info => {
    console.log(info)
  }

  const algorithmRow = useCallback(
    row => {
      return (
        <Tr>
          <Td>{row.name}</Td>
          <Td>{t(`enum.mode.${row.mode}`)}</Td>
          <Td>{t(`enum.status.${row.status}`)}</Td>
          <Td>{formatDate(new Date(row.updatedAt))}</Td>
          <Td>
            <Button>{t('openAlgorithm', { ns: 'datatable' })}</Button>
          </Td>
          <Td>
            <MenuCell
              row={row}
              onEdit={onEdit}
              onDestroy={onDestroy}
              onShow={`/projects/${projectId}/algorithms/${row.id}`}
            />
          </Td>
        </Tr>
      )
    },
    [t]
  )

  return (
    <Page title={t('title')}>
      <HStack justifyContent='space-between' mb={12}>
        <Heading as='h1'>{t('heading')}</Heading>
        {canCrud && (
          <Button
            data-cy='create_algorithm'
            onClick={handleOpenForm}
            variant='outline'
          >
            {t('create')}
          </Button>
        )}
      </HStack>

      <DataTable
        source='algorithms'
        hasButton
        searchable
        searchPlaceholder={t('searchPlaceholder')}
        onButtonClick={handleButtonClick}
        apiQuery={useLazyGetAlgorithmsQuery}
        requestParams={{ projectId }}
        editable={canCrud}
        renderItem={algorithmRow}
        destroyable={canCrud}
      />
    </Page>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res, query }) => {
      const { projectId } = query
      // Gotta do this everywhere where we have a sidebar
      // ************************************************
      const currentUser = getUserBySession(req, res)
      await store.dispatch(setSession(currentUser))
      store.dispatch(getProject.initiate(projectId))
      await Promise.all(
        store.dispatch(apiGraphql.util.getRunningQueriesThunk())
      )
      // ************************************************
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
          locale,
          currentUser,
          ...translations,
        },
      }
    }
)
