/**
 * The external imports
 */
import { useContext } from 'react'
import { Heading, Button, HStack } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

/**
 * The internal imports
 */
import { ModalContext } from '/lib/contexts'
import { CreateAlgorithmForm, DataTable, Page } from '/components'
import { wrapper } from '/lib/store'
import { setSession } from '/lib/store/session'
import { useLazyGetAlgorithmsQuery } from '/lib/services/modules/algorithm'
import {
  getProject,
  getRunningOperationPromises,
} from '/lib/services/modules/project'
import getUserBySession from '/lib/utils/getUserBySession'

export default function Algorithms({ projectId }) {
  const { t } = useTranslation('algorithms')
  const { openModal } = useContext(ModalContext)

  /**
   * Opens the modal with the algorithm form
   */
  const handleOpenModal = () => {
    openModal({
      title: t('create'),
      content: <CreateAlgorithmForm />,
    })
  }

  /**
   * Handles the button click in the table
   * @param {*} info
   */
  const handleButtonClick = info => {
    console.log(info)
  }

  return (
    <Page title={t('title')}>
      <HStack justifyContent='space-between'>
        <Heading as='h1'>{t('heading')}</Heading>
        <Button data-cy='create_algorithm' onClick={handleOpenModal}>
          {t('create')}
        </Button>
      </HStack>

      <DataTable
        source='algorithms'
        hasButton
        searchable
        searchPlaceholder={t('searchPlaceholder')}
        buttonLabel={t('openDecisionTree')}
        onButtonClick={handleButtonClick}
        apiQuery={useLazyGetAlgorithmsQuery}
        requestParams={{ projectId }}
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
      await Promise.all(getRunningOperationPromises())
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
