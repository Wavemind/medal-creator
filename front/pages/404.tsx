/**
 * The external imports
 */
import { ReactElement } from 'react'
import { Flex, Heading, VStack } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import type { GetStaticProps } from 'next/types'

/**
 * The external imports
 */
import { OptimizedLink } from '@/components'

export default function Custom404() {
  const { t } = useTranslation('common')

  return (
    <VStack spacing={8}>
      <Heading as='h1'>{t('404')}</Heading>
      <OptimizedLink variant='solid' href='/' data-cy='go_home'>
        {t('home')}
      </OptimizedLink>
    </VStack>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['common'])),
  },
})

Custom404.getLayout = function getLayout(page: ReactElement) {
  return (
    <Flex w='full' h='100vh' alignItems='center' justifyContent='center'>
      {page}
    </Flex>
  )
}
