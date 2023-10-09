/**
 * The external imports
 */
import React from 'react'
import { Heading, HStack } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import type { ReactElement } from 'react'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import Page from '@/components/page'
import { wrapper } from '@/lib/store'
import Layout from '@/lib/layouts/default'
import {
  getProject,
  useGetProjectQuery,
} from '@/lib/api/modules/enhanced/project.enhanced'
import type { LibraryPage } from '@/types'

export default function Publication({
  projectId,
  isAdminOrClinician,
}: LibraryPage) {
  const { t } = useTranslation('publication')

  const { data: project } = useGetProjectQuery({ id: projectId })

  return (
    <Page title={t('title')}>
      <HStack justifyContent='space-between' mb={12}>
        <Heading as='h1'>{t('heading')}</Heading>
      </HStack>
    </Page>
  )
}

Publication.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, query }: GetServerSidePropsContext) => {
      const { projectId } = query

      if (typeof locale === 'string' && typeof projectId === 'string') {
        const projectResponse = await store.dispatch(
          getProject.initiate({ id: projectId })
        )

        if (projectResponse.isSuccess) {
          // Translations
          const translations = await serverSideTranslations(locale, [
            'common',
            'datatable',
            'publication',
            'projects',
          ])

          return {
            props: {
              projectId,
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
