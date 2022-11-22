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
import { CreateAlgorithmForm } from '/components'

export default function Algorithms() {
  const { t } = useTranslation('algorithms')
  const { openModal } = useContext(ModalContext)

  const handleOpenModal = () => {
    openModal({
      title: t('create'),
      content: <CreateAlgorithmForm />,
    })
  }

  return (
    <HStack justifyContent='space-between'>
      <Heading as='h1'>{t('heading')}</Heading>
      <Button data-cy='create_algorithm' onClick={handleOpenModal}>
        {t('create')}
      </Button>
    </HStack>
  )
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'algorithms'])),
  },
})
