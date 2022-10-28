/**
 * The external imports
 */
import { useContext, useMemo } from 'react'
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
import {
  getAlgorithms,
  useGetAlgorithmsQuery,
  getRunningOperationPromises,
} from '/lib/services/modules/algorithm'
import { getProject } from '/lib/services/modules/project'
import getUserBySession from '/lib/utils/getUserBySession'

export default function Algorithms({ projectId }) {
  const { t } = useTranslation('algorithms')
  const { openModal } = useContext(ModalContext)

  const { data } = useGetAlgorithmsQuery({ projectId })

  const handleOpenModal = () => {
    openModal({
      title: t('create'),
      content: <CreateAlgorithmForm />,
    })
  }

  const tableData = useMemo(() => {
    return data.edges.map(algorithm => ({
      ...algorithm.node,
    }))
  }, [])

  console.log('data', data)

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
        data={tableData}
        hasButton
        searchable
        searchPlaceholder={t('searchPlaceholder')}
        buttonLabel={t('openDecisionTree')}
        onButtonClick={handleButtonClick}
      />
    </Page>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res, query }) => {
      const { projectId } = query
      // Gotta do this everywhere where we have a sidebar
      const currentUser = getUserBySession(req, res)
      await store.dispatch(setSession(currentUser))
      store.dispatch(getProject.initiate(projectId))

      store.dispatch(getAlgorithms.initiate({ projectId }))
      await Promise.all(getRunningOperationPromises())

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
