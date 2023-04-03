/**
 * The external imports
 */
import { Heading, HStack } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import type { GetServerSidePropsContext } from 'next'
import type { ReactElement } from 'react'

/**
 * The internal imports
 */
import { Page } from '@/components'
import { wrapper } from '@/lib/store'
import Layout from '@/lib/layouts/default'
import type { LibraryPage } from '@/types'

export default function Library(): LibraryPage {
  const { t } = useTranslation('variables')

  return (
    <Page title={t('title')}>
      <HStack justifyContent='space-between' mb={12}>
        <Heading as='h1'>{t('heading')}</Heading>
      </HStack>
    </Page>
  )
}

Library.getLayout = function getLayout(page: ReactElement) {
  return <Layout menuType='library'>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale }: GetServerSidePropsContext) => {
      if (typeof locale === 'string') {
        // Translations
        const translations = await serverSideTranslations(locale, [
          'common',
          'datatable',
          'projects',
          'variables',
          'submenu',
        ])

        return {
          props: {
            ...translations,
          },
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
