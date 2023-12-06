/**
 * The external imports
 */
import React, { useCallback, useMemo } from 'react'
import { Text, Heading, VStack, Tr, Td, Box } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { getServerSession } from 'next-auth'
import type { ReactElement } from 'react'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import Page from '@/components/page'
import Card from '@/components/card'
import DataTable from '@/components/table/datatable'
import Publish from '@/components/publish'
import { wrapper } from '@/lib/store'
import Layout from '@/lib/layouts/default'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import {
  useLazyGetAlgorithmsQuery,
  getAlgorithms,
  useGetAlgorithmsQuery,
} from '@/lib/api/modules/enhanced/algorithm.enhanced'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import WebSocketProvider from '@/lib/providers/webSocket'
import { formatDate } from '@/lib/utils/date'
import { AlgorithmStatusEnum, type Algorithm, type RenderItemFn } from '@/types'

export default function Publication() {
  const { t } = useTranslation('publication')

  const {
    query: { projectId },
  } = useAppRouter()

  const { data: algorithms } = useGetAlgorithmsQuery({
    projectId,
    filters: {
      statuses: [AlgorithmStatusEnum.Draft, AlgorithmStatusEnum.Prod],
    },
  })

  /**
   * Finds the algorithm that is currently in production
   */
  const inProduction = useMemo(() => {
    if (algorithms) {
      return algorithms.edges.find(
        algorithm => algorithm.node.status === AlgorithmStatusEnum.Prod
      )
    }

    return null
  }, [algorithms])

  /**
   * Row definition for algorithms datatable
   */
  const algorithmRow = useCallback<RenderItemFn<Algorithm>>(
    row => (
      <Tr>
        <Td>{row.name}</Td>
        <Td>{row.publishedAt && formatDate(new Date(row.publishedAt))}</Td>
        <Td>{row.archivedAt && formatDate(new Date(row.archivedAt))}</Td>
      </Tr>
    ),
    [t]
  )

  return (
    <Page title={t('title')}>
      <WebSocketProvider channel='JobStatusChannel'>
        <Heading as='h1' mb={4}>
          {t('heading')}
        </Heading>

        <VStack w='full' spacing={7}>
          <Card px={5} py={6}>
            <VStack w='full' alignItems='flex-start' spacing={6}>
              <Box>
                <Text fontWeight='700' color='primary'>
                  {inProduction ? inProduction.node.name : t('description')}
                </Text>
                <Text fontSize='xs'>
                  {inProduction ? t('currentlyInProduction') : null}
                </Text>
              </Box>
              <Text fontSize='xs'>
                {t('lastGeneration', {
                  value:
                    inProduction && inProduction.node.jsonGeneratedAt
                      ? formatDate(new Date(inProduction.node.jsonGeneratedAt))
                      : t('none'),
                })}
              </Text>
            </VStack>
          </Card>
          <Publish />
        </VStack>

        <Text fontSize='lg' fontWeight='600' mt={5} mb={3}>
          {t('history')}
        </Text>

        <DataTable
          source='publications'
          apiQuery={useLazyGetAlgorithmsQuery}
          requestParams={{
            projectId,
            filters: { statuses: [AlgorithmStatusEnum.Archived] },
          }}
          renderItem={algorithmRow}
        />
      </WebSocketProvider>
    </Page>
  )
}

Publication.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res, query }: GetServerSidePropsContext) => {
      const { projectId } = query
      const session = await getServerSession(req, res, authOptions)

      if (
        typeof locale === 'string' &&
        typeof projectId === 'string' &&
        session
      ) {
        const algorithmsResponse = await store.dispatch(
          getAlgorithms.initiate({
            projectId,
            filters: {
              statuses: [AlgorithmStatusEnum.Draft, AlgorithmStatusEnum.Prod],
            },
          })
        )

        if (algorithmsResponse.isSuccess) {
          // Translations
          const translations = await serverSideTranslations(locale, [
            'common',
            'datatable',
            'projects',
            'publication',
          ])

          return {
            props: {
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
