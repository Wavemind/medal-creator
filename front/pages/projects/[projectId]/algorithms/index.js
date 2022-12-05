/**
 * The external imports
 */
import { useCallback, useContext, useEffect } from 'react'
import { Heading, Button, HStack } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { ModalContext, AlertDialogContext } from '/lib/contexts'
import { AlgorithmForm, DataTable, Page } from '/components'
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

export default function Algorithms({ projectId }) {
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
      title: t('create'),
      content: <AlgorithmForm projectId={projectId} />,
      size: 'xl',
    })
  }

  /**
   * Callback to handle the edit action in the table menu
   */
  const onEditClick = useCallback(algorithmId => {
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
  const onDestroyClick = useCallback(algorithmId => {
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

  // TODO : CHECK AUTHORIZATION TO EDIT/DELETE
  return (
    <Page title={t('title')}>
      <HStack justifyContent='space-between'>
        <Heading as='h1'>{t('heading')}</Heading>
        <Button data-cy='create_algorithm' onClick={handleOpenForm}>
          {t('create')}
        </Button>
      </HStack>

      <DataTable
        source='algorithms'
        hasButton
        searchable
        searchPlaceholder={t('searchPlaceholder')}
        buttonLabelKey='openDecisionTree'
        onButtonClick={handleButtonClick}
        apiQuery={useLazyGetAlgorithmsQuery}
        requestParams={{ projectId }}
        handleEditClick={onEditClick}
        handleDestroyClick={onDestroyClick}
      />
    </Page>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res, query }) => {
      const { projectId } = query
      await store.dispatch(getLanguages.initiate())
      // Gotta do this everywhere where we have a sidebar
      // ************************************************
      const currentUser = getUserBySession(req, res)
      await store.dispatch(setSession(currentUser))
      store.dispatch(getProject.initiate(projectId))
      await Promise.all(
        store.dispatch(apiGraphql.util.getRunningQueriesThunk())
      )
      // ************************************************

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
          ...translations,
        },
      }
    }
)
