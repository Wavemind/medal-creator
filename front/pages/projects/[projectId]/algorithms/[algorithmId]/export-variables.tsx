/**
 * The external imports
 */
import React, { ReactElement, useEffect } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Heading, HStack, Button } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import type { GetServerSidePropsContext } from 'next/types'

/**
 * The internal imports
 */
import Layout from '@/lib/layouts/default'
import Page from '@/components/page'
import Card from '@/components/card'
import { wrapper } from '@/lib/store'
import {
  useGetAlgorithmOrderingQuery,
  getAlgorithmOrdering,
  useLazyExportDataQuery,
} from '@/lib/api/modules/enhanced/algorithm.enhanced'
import { getProject } from '@/lib/api/modules/enhanced/project.enhanced'
import { downloadFile } from '@/lib/utils/media'
import type { TranslationsPage } from '@/types'

const Translations = ({ algorithmId }: TranslationsPage) => {
  const { t } = useTranslation('algorithms')

  const { data: algorithm, isSuccess: isAlgorithmSuccess } =
    useGetAlgorithmOrderingQuery({ id: algorithmId })

  const [
    exportData,
    {
      data: exportedData,
      isFetching: isExportDataFetching,
      isSuccess: isExportDataSuccess,
    },
  ] = useLazyExportDataQuery()

  useEffect(() => {
    if (isExportDataSuccess && exportedData?.url) {
      downloadFile(exportedData.url)
    }
  }, [isExportDataSuccess])

  const downloadTranslations = () => {
    exportData({
      id: algorithmId,
      exportType: 'variables',
    })
  }

  if (isAlgorithmSuccess) {
    return (
      <Page title={algorithm.name}>
        <HStack justifyContent='space-between' w='full' mb={5}>
          <Heading as='h1'>{t('export.variables.title')}</Heading>
        </HStack>

        <Card px={4} py={5}>
          <Button
            onClick={downloadTranslations}
            isLoading={isExportDataFetching}
          >
            {t('export.variables.export')}
          </Button>
        </Card>
      </Page>
    )
  }

  return null
}

export default Translations

Translations.getLayout = function getLayout(page: ReactElement) {
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
        const algorithmResponse = await store.dispatch(
          getAlgorithmOrdering.initiate({ id: algorithmId })
        )

        if (projectResponse.isSuccess && algorithmResponse.isSuccess) {
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
