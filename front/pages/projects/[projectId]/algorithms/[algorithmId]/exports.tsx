/**
 * The external imports
 */
import React, { ReactElement, useEffect, useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Heading, HStack, Button, VStack, Box } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import type { GetServerSidePropsContext } from 'next/types'

/**
 * The internal imports
 */
import FileUpload from '@/components/inputs/fileUpload'
import FormProvider from '@/components/formProvider'
import Layout from '@/lib/layouts/default'
import Page from '@/components/page'
import Card from '@/components/card'
import { wrapper } from '@/lib/store'
import {
  useLazyExportDataQuery,
  getAlgorithm,
  useGetAlgorithmQuery,
} from '@/lib/api/modules/enhanced/algorithm.enhanced'
import { getProject } from '@/lib/api/modules/enhanced/project.enhanced'
import { downloadFile } from '@/lib/utils/media'
import type {
  DataInputs,
  ExportsPage,
  ExportType,
  LoadingStateProps,
} from '@/types'

const Exports = ({ algorithmId }: ExportsPage) => {
  const { t } = useTranslation('exports')
  const [loadingState, setLoadingState] = useState<LoadingStateProps>({
    exportType: null,
    isLoading: false,
  })

  const { data: algorithm, isSuccess: isAlgorithmSuccess } =
    useGetAlgorithmQuery({ id: algorithmId })

  const [
    exportData,
    {
      data: exportedData,
      isFetching: isExportDataFetching,
      isSuccess: isExportDataSuccess,
      isError: isExportDataError,
    },
  ] = useLazyExportDataQuery()

  const methods = useForm<DataInputs>({
    resolver: yupResolver(
      yup.object({
        translations: yup
          .mixed<File>()
          .nullable()
          .test('is-xlsx', t('onlyXLSX', { ns: 'validations' }), value => {
            if (!value) {
              return true // Allow empty value (no file selected)
            }
            return (
              value.type ===
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
          }),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      translations: null,
    },
  })

  useEffect(() => {
    if (isExportDataSuccess && exportedData?.url && !isExportDataFetching) {
      downloadFile(exportedData.url)
      setLoadingState({ exportType: null, isLoading: false })
    }
  }, [isExportDataSuccess, isExportDataFetching])

  useEffect(() => {
    if (isExportDataError) {
      setLoadingState({ exportType: null, isLoading: false })
    }
  }, [isExportDataError])

  const downloadTranslations = (exportType: ExportType) => {
    setLoadingState({ exportType, isLoading: true })
    exportData({ id: algorithmId, exportType })
  }

  const generateTranslations = () => {
    console.log('generate them translations')
  }

  const submitForm = (data: DataInputs) => {
    console.log(data)
  }

  if (isAlgorithmSuccess) {
    return (
      <Page title={algorithm.name}>
        <VStack spacing={12}>
          <Box w='full'>
            <HStack justifyContent='space-between' w='full' mb={5}>
              <Heading as='h1'>{t('translations.title')}</Heading>
            </HStack>

            <VStack w='full' spacing={7}>
              <Card px={4} py={5}>
                <Button
                  onClick={() => downloadTranslations('translations')}
                  isLoading={
                    loadingState.exportType === 'translations' &&
                    loadingState.isLoading
                  }
                >
                  {t('download', { ns: 'common' })}
                </Button>
              </Card>
              <Card px={4} py={5}>
                <Heading variant='subTitle' mb={6}>
                  {t('translations.upload')}
                </Heading>
                <FormProvider<DataInputs>
                  methods={methods}
                  isError={false}
                  error={{}}
                >
                  <form onSubmit={methods.handleSubmit(submitForm)}>
                    <FileUpload
                      name='translations'
                      acceptedFileTypes='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                      hint={t('translations.hint')}
                    />
                    <Button type='submit' mt={6} onClick={generateTranslations}>
                      {t('translations.generate')}
                    </Button>
                  </form>
                </FormProvider>
              </Card>
            </VStack>
          </Box>
          <Box w='full'>
            <HStack justifyContent='space-between' w='full' mb={5}>
              <Heading as='h1'>{t('variables.title')}</Heading>
            </HStack>

            <Card px={4} py={5}>
              <Button
                onClick={() => downloadTranslations('variables')}
                isLoading={
                  loadingState.exportType === 'variables' &&
                  loadingState.isLoading
                }
              >
                {t('download', { ns: 'common' })}
              </Button>
            </Card>
          </Box>
        </VStack>
      </Page>
    )
  }

  return null
}

export default Exports

Exports.getLayout = function getLayout(page: ReactElement) {
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
          getAlgorithm.initiate({ id: algorithmId })
        )

        if (projectResponse.isSuccess && algorithmResponse.isSuccess) {
          // Translations
          const translations = await serverSideTranslations(locale, [
            'common',
            'submenu',
            'exports',
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
