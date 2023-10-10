/**
 * The external imports
 */
import React, { ReactElement } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Heading, HStack } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import type { GetServerSidePropsContext } from 'next/types'

/**
 * The internal imports
 */
import Layout from '@/lib/layouts/default'
import Page from '@/components/page'
import { wrapper } from '@/lib/store'
import { getProject } from '@/lib/api/modules/enhanced/project.enhanced'
import type { ConsultationOrderPage } from '@/types'

import styles from '@/styles/consultationOrder.module.scss'

const Config = ({ algorithmId }: ConsultationOrderPage) => {
  const { t } = useTranslation('consultationOrder')

  return (
    <Page title={algorithm.name}>
      <HStack justifyContent='space-between' mb={12}>
        <Heading as='h1'>{t('title')}</Heading>
      </HStack>
    </Page>
  )
}

export default Config

Config.getLayout = function getLayout(page: ReactElement) {
  return <Layout menuType='algorithm'>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, query }: GetServerSidePropsContext) => {
      const { projectId, algorithmId } = query

      if (
        typeof locale === 'string' &&
        typeof projectId === 'string' &&
        typeof algorithmId === 'string'
      ) {
        const projectResponse = await store.dispatch(
          getProject.initiate({ id: projectId })
        )

        if (projectResponse.isSuccess) {
          // Translations
          const translations = await serverSideTranslations(locale, [
            'common',
            'submenu',
            'algorithms',
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
