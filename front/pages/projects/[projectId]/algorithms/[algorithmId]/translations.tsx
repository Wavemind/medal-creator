/**
 * The external imports
 */
import React, { ReactElement, useEffect } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Heading, HStack, Button, VStack } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import type { GetServerSidePropsContext } from 'next/types'

/**
 * The internal imports
 */
import Layout from '@/lib/layouts/default'
import Page from '@/components/page'
import FileUpload from '@/components/inputs/fileUpload'
import Card from '@/components/card'
import { wrapper } from '@/lib/store'
import {
  useGetAlgorithmOrderingQuery,
  getAlgorithmOrdering,
  useLazyExportDataQuery,
} from '@/lib/api/modules/enhanced/algorithm.enhanced'
import { getProject } from '@/lib/api/modules/enhanced/project.enhanced'
import FormProvider from '@/components/formProvider'
import { downloadFile } from '@/lib/utils/media'
import type { DataInputs, TranslationsPage } from '@/types'

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
    if (isExportDataSuccess && exportedData?.url) {
      downloadFile(exportedData.url)
    }
  }, [isExportDataSuccess])

  const downloadTranslations = () => {
    exportData({ id: algorithmId, exportType: 'translations' })
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
        <HStack justifyContent='space-between' w='full' mb={5}>
          <Heading as='h1'>{t('export.translations.title')}</Heading>
        </HStack>

        <VStack w='full' spacing={7}>
          <Card px={4} py={5}>
            <Heading variant='subTitle' mb={6}>
              {t('export.translations.export')}
            </Heading>
            <Button
              onClick={downloadTranslations}
              isLoading={isExportDataFetching}
            >
              {t('export.translations.download')}
            </Button>
          </Card>
          <Card px={4} py={5}>
            <Heading variant='subTitle' mb={6}>
              {t('export.translations.upload')}
            </Heading>
            <FormProvider<DataInputs>
              methods={methods}
              isError={false}
              error={{}}
              isSuccess={false}
              callbackAfterSuccess={() => console.log('yay')}
            >
              <form onSubmit={methods.handleSubmit(submitForm)}>
                <FileUpload
                  label={null}
                  name='translations'
                  acceptedFileTypes='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                  hint={t('export.translations.hint')}
                />
                <Button type='submit' mt={6} onClick={generateTranslations}>
                  {t('export.translations.generate')}
                </Button>
              </form>
            </FormProvider>
          </Card>
        </VStack>
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