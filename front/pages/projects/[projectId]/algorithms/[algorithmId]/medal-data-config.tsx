/**
 * The external imports
 */
import React, { ReactElement } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Heading, HStack, Spinner } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import type { GetServerSidePropsContext } from 'next/types'

/**
 * The internal imports
 */
import Layout from '@/lib/layouts/default'
import Page from '@/components/page'
import { wrapper } from '@/lib/store'
import {
  getAlgorithmMedalDataConfig,
  useGetAlgorithmMedalDataConfigQuery,
} from '@/lib/api/modules/enhanced/algorithm.enhanced'
import MedalDataConfigForm from '@/components/forms/medalDataConfig'
import type { MedalDataConfigPage } from '@/types'

const MedalDataConfig = ({ algorithmId }: MedalDataConfigPage) => {
  const { t } = useTranslation('medalDataConfig')

  const { data: algorithm, isSuccess: isAlgorithmSuccess } =
    useGetAlgorithmMedalDataConfigQuery({ id: algorithmId })

  if (isAlgorithmSuccess) {
    return (
      <Page title={algorithm.name}>
        <HStack justifyContent='space-between' mb={12}>
          <Heading as='h1'>{t('title')}</Heading>
        </HStack>
        <MedalDataConfigForm />
      </Page>
    )
  }

  return <Spinner size='xl' />
}

export default MedalDataConfig

MedalDataConfig.getLayout = function getLayout(page: ReactElement) {
  return <Layout menuType='algorithm'>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, query }: GetServerSidePropsContext) => {
      const { algorithmId } = query

      if (typeof locale === 'string' && typeof algorithmId === 'string') {
        const algorithmResponse = await store.dispatch(
          getAlgorithmMedalDataConfig.initiate({ id: algorithmId })
        )

        if (algorithmResponse.isSuccess) {
          // Translations
          const translations = await serverSideTranslations(locale, [
            'common',
            'submenu',
            'algorithms',
            'medalDataConfig',
            'validations',
          ])

          return {
            props: {
              algorithmId,
              locale,
              ...translations,
            },
          }
        } else {
          return {
            notFound: true,
          }
        }
      }

      return {
        redirect: {
          destination: '/500',
          permanent: false,
        },
      }
    }
)
