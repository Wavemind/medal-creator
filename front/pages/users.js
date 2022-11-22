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
import { CreateUserForm } from '/components'

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
    })
  }

  return (
    <HStack justifyContent='space-between'>
      <Heading as='h1'>{t('heading')}</Heading>
      <Button data-cy='create_user' onClick={handleOpenModal}>
        {t('create')}
      </Button>
    </HStack>
  )
}

Users.getLayout = function getLayout(page) {
  return <Layout showSideBar={false}>{page}</Layout>
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'users',
      'validations',
    ])),
  },
})
