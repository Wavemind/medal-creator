/**
 * The external imports
 */
import { ReactElement } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Heading } from '@chakra-ui/react'
import { getServerSession } from 'next-auth'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import Layout from '@/lib/layouts/default'
import Page from '@/components/page'
import ProjectList from '@/components/projectList'
import { wrapper } from '@/lib/store'
import { getProjects } from '@/lib/api/modules/enhanced/project.enhanced'
import { apiGraphql } from '@/lib/api/apiGraphql'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { RoleEnum, type IsAdmin } from '@/types'

export default function Projects({ isAdmin }: IsAdmin) {
  const { t } = useTranslation('account')

  return (
    <Page title={t('projects.title')}>
      <Heading mb={10}>{t('projects.header')}</Heading>
      <ProjectList isAdmin={isAdmin} />
    </Page>
  )
}

Projects.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout menuType='account' showSideBar={false}>
      {page}
    </Layout>
  )
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
            'common',
            'account',
            'submenu',
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
