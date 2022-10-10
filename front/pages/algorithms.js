/**
 * The external imports
 */
import React, { useContext } from 'react'
import { Heading, Button, HStack } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

/**
 * The internal imports
 */
import { ModalContext } from '../lib/contexts'
import { CreateAlgorithmForm } from '/components'

export default function Algorithms() {
  const { openModal } = useContext(ModalContext)

  const handleOpenModal = () => {
    openModal({
      title: 'Create new algorithm',
      content: <CreateAlgorithmForm />,
    })
  }

  return (
    <HStack justifyContent='space-between'>
      <Heading as='h1'>Algorithms</Heading>
      <Button onClick={handleOpenModal}>Open Modal</Button>
    </HStack>
  )
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})
