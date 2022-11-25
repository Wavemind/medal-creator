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
import Layout from '/lib/layouts/default'
import { ModalContext } from '/lib/contexts'
import { CreateUserForm, Page } from '/components'
import { wrapper } from '/lib/store'
import { setSession } from '/lib/store/session'
import { getProjects } from '/lib/services/modules/project'
import { apiGraphql } from '/lib/services/apiGraphql'
import getUserBySession from '/lib/utils/getUserBySession'

export default function Users() {
  const { t } = useTranslation('users')
  const { openModal } = useContext(ModalContext)

  /**
   * Opens the new user form in a modal
   */
  const handleOpenModal = () => {
    openModal({
      title: t('create'),
      content: <CreateUserForm />,
      size: 'xl',
    })
  }

  return (
    <Page title={t('title')}>
      <HStack justifyContent='space-between'>
        <Heading as='h1'>{t('heading')}</Heading>
        <Button data-cy='create_user' onClick={handleOpenModal}>
          {t('create')}
        </Button>
      </HStack>
    </Page>
  )
}

Users.getLayout = function getLayout(page) {
  return <Layout showSideBar={false}>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res }) => {
      const currentUser = getUserBySession(req, res)
      await store.dispatch(setSession(currentUser))
      store.dispatch(getProjects.initiate())
      await Promise.all(
        store.dispatch(apiGraphql.util.getRunningQueriesThunk())
      )

      // Translations
      const translations = await serverSideTranslations(locale, [
        'common',
        'users',
        'validations',
      ])

      return {
        props: {
          isAdmin: currentUser.role === 'admin',
          ...translations,
        },
      }
    }
)
