/**
 * The external imports
 */
import { Heading, HStack, Box } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Link } from '@chakra-ui/next-js'
import type { GetServerSidePropsContext } from 'next'
import type { ReactElement } from 'react'

/**
 * The internal imports
 */
import Page from '@/components/page'
import ProjectList from '@/components/projectList'
import Layout from '@/lib/layouts/default'
import { wrapper } from '@/lib/store'
import { getProjects } from '@/lib/api/modules/enhanced/project.enhanced'
import { apiGraphql } from '@/lib/api/apiGraphql'
import { IsAdmin, RoleEnum } from '@/types'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export default function Home({ isAdmin }: IsAdmin) {
  const { t } = useTranslation('home')

  return (
    <Page title={t('title')}>
      <Box mx={32}>
        <HStack justifyContent='space-between' mb={12}>
          <Heading variant='h1'>{t('title')}</Heading>
          {isAdmin && (
            <Link
              variant='outline'
              href='/projects/new'
              data-testid='new-project'
            >
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
    async ({ locale, req, res }: GetServerSidePropsContext) => {
      if (typeof locale === 'string') {
        const session = await getServerSession(req, res, authOptions)

        if (session) {
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
              isAdmin: session.user.role === RoleEnum.Admin,
              ...translations,
            },
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
