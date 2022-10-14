/**
 * The external imports
 */
import React, { useContext } from 'react'
import { Heading, Button, HStack } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { getCookie } from 'cookies-next'

/**
 * The internal imports
 */
import { setSession } from '/lib/store/session'
import { wrapper } from '/lib/store'
import { ModalContext } from '/lib/contexts'
import { CreateAlgorithmForm, DataTable } from '/components'
import {
  getAlgorithms,
  useGetAlgorithmsQuery,
  getRunningOperationPromises,
} from '/lib/services/modules/algorithm'

export default function Algorithms({ projectName }) {
  const { t } = useTranslation('algorithms')
  const { openModal } = useContext(ModalContext)
  const { data } = useGetAlgorithmsQuery(projectName)

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
    <React.Fragment>
      <HStack justifyContent='space-between'>
        <Heading as='h1'>{t('heading')}</Heading>
        <Button data-cy='create_algorithm' onClick={handleOpenModal}>
          {t('create')}
        </Button>
      </HStack>

      <DataTable
        source='algorithms'
        data={data}
        hasButton
        searchable
        searchPlaceholder={t('algorithms.searchPlaceholder', {
          ns: 'datatable',
        })}
        buttonLabel='Open decision tree'
        onButtonClick={handleButtonClick}
      />
    </React.Fragment>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res, query }) => {
      const { name: projectName } = query
      await store.dispatch(
        setSession(JSON.parse(getCookie('session', { req, res })))
      )
      store.dispatch(getAlgorithms.initiate(projectName))
      await Promise.all(getRunningOperationPromises())

      // Translations
      const translations = await serverSideTranslations(locale, [
        'common',
        'datatable',
        'algorithms',
      ])

      return {
        props: {
          projectName,
          ...translations,
        },
      }
    }
)
