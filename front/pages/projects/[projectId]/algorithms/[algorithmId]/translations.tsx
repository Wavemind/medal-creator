/**
 * The external imports
 */
import React, { ReactElement, useEffect } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Box, Heading, HStack, Button, VStack } from '@chakra-ui/react'
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
import { wrapper } from '@/lib/store'
import {
  useGetAlgorithmOrderingQuery,
  getAlgorithmOrdering,
  useLazyExportDataQuery,
} from '@/lib/api/modules/enhanced/algorithm.enhanced'
import { getProject } from '@/lib/api/modules/enhanced/project.enhanced'
import type { TranslationsPage } from '@/types'
import FormProvider from '@/components/formProvider'

const Translations = ({ algorithmId }: TranslationsPage) => {
  const { t } = useTranslation('translations')

  const { data: algorithm, isSuccess: isAlgorithmSuccess } =
    useGetAlgorithmOrderingQuery({ id: algorithmId })

  const [exportData, { data: exportedData, isSuccess: isExportDataSuccess }] =
    useLazyExportDataQuery()

  const methods = useForm({
    resolver: yupResolver(
      yup.object({
        translations: yup
          .mixed<File>()
          .nullable()
          .test('is-json', t('onlyJSON', { ns: 'validations' }), value => {
            if (!value) {
              return true // Allow empty value (no file selected)
            }
            return value.type === 'application/json'
          }),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      translations: null,
    },
  })

  useEffect(() => {
    if (isExportDataSuccess) {
      console.log(exportedData)
    }
  }, [isExportDataSuccess])

  const downloadTranslations = () => {
    exportData({ id: algorithmId, exportType: 'translations' })
  }

  const generateTranslations = () => {
    console.log('generate them translations')
  }

  const submitForm = data => {
    console.log(data)
  }

  if (isAlgorithmSuccess) {
    return (
      <Page title={algorithm.name}>
        <HStack justifyContent='space-between' w='full' mb={5}>
          <Heading as='h1'>{t('title')}</Heading>
        </HStack>

        <VStack w='full' spacing={7}>
          <Box
            w='full'
            alignItems='flex-start'
            boxShadow='0px 0px 4px rgba(0, 0, 0, 0.15)'
            border={1}
            borderColor='sidebar'
            borderRadius='lg'
            px={4}
            pt={2}
            pb={5}
          >
            <Heading variant='subTitle' mb={6}>
              {t('export')}
            </Heading>
            <Button onClick={downloadTranslations}>{t('download')}</Button>
          </Box>
          <Box
            w='full'
            alignItems='flex-start'
            boxShadow='0px 0px 4px rgba(0, 0, 0, 0.15)'
            border={1}
            borderColor='sidebar'
            borderRadius='lg'
            px={4}
            pt={2}
            pb={5}
          >
            <Heading variant='subTitle' mb={6}>
              {t('upload')}
            </Heading>
            <FormProvider
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
                  // TODO : Check file types
                  acceptedFileTypes='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                  hint={t('hint')}
                />
                <Button type='submit' mt={6} onClick={generateTranslations}>
                  {t('generate')}
                </Button>
              </form>
            </FormProvider>
          </Box>
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
            'translations',
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
