/**
 * The external imports
 */
import { ReactElement } from 'react'
import { Heading, HStack, Box } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Link } from '@chakra-ui/next-js'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import { Page, ProjectList } from '@/components'
import Layout from '@/lib/layouts/default'
import { wrapper } from '@/lib/store'
import { getProjects } from '@/lib/api/modules'
import { apiGraphql } from '@/lib/api/apiGraphql'
import type { IsAdmin } from '@/types'

export default function Home({ isAdmin }: IsAdmin) {
  const { t } = useTranslation('home')

  return (
    <Page title={t('title')}>
      <Box mx={32}>
        <HStack justifyContent='space-between' mb={12}>
          <Heading variant='h1'>{t('title')}</Heading>
          {isAdmin && (
            <Link variant='outline' href='/projects/new' data-cy='new_project'>
              {t('new')}
            </Link>
          )}
        </HStack>
        <ProjectList isAdmin={isAdmin} />
      </Box>
    </Page>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout showSideBar={false}>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale }: GetServerSidePropsContext) => {
      if (typeof locale === 'string') {
        store.dispatch(getProjects.initiate())
        await Promise.all(
          store.dispatch(apiGraphql.util.getRunningQueriesThunk())
        )

        // Translations
        const translations = await serverSideTranslations(locale, [
          'home',
          'common',
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
