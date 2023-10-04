/**
 * The external imports
 */
import { useState } from 'react'
import { Heading } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getServerSession } from 'next-auth'
import type { GetServerSidePropsContext } from 'next'
import type { ReactElement } from 'react'

/**
 * The internal imports
 */
import Page from '@/components/page'
import ProjectForm from '@/components/forms/project'
import FormProvider from '@/components/formProvider'
import Layout from '@/lib/layouts/default'
import { wrapper } from '@/lib/store'
import { apiGraphql } from '@/lib/api/apiGraphql'
import { useCreateProjectMutation } from '@/lib/api/modules/enhanced/project.enhanced'
import { getLanguages } from '@/lib/api/modules/enhanced/language.enhanced'
import { useAppRouter } from '@/lib/hooks'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import {
  AllowedUser,
  ProjectInputs,
  NewProjectPage,
  RoleEnum,
  Languages,
} from '@/types'

export default function NewProject({ hashStoreLanguage }: NewProjectPage) {
  const { t } = useTranslation('project')
  const router = useAppRouter()
  const [allowedUsers, setAllowedUsers] = useState<AllowedUser[]>([])

  const [createProject, { data, isSuccess, isError, error, isLoading }] =
    useCreateProjectMutation()

  /**
   * Setup form configuration
   */
  const methods = useForm<ProjectInputs>({
    resolver: yupResolver(
      yup.object({
        name: yup.string().label(t('form.name')).required(),
        consentManagement: yup.boolean().label(t('form.consentManagement')),
        trackReferral: yup.boolean().label(t('form.trackReferral')),
        description: yup.string().label(t('form.description')),
        languageId: yup.string().label(t('form.languageId')).required(),
        villages: yup
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
      name: '',
      description: '',
      consentManagement: false,
      trackReferral: false,
      villages: null,
      languageId: undefined,
      emergencyContentTranslations: hashStoreLanguage,
      studyDescriptionTranslations: hashStoreLanguage,
    },
  })

  /**
   * Send values to data
   * @param {object} data,
   */
  const submitForm: SubmitHandler<ProjectInputs> = data => {
    const cleanedAllowedUsers = allowedUsers.map(user => ({
      userId: user.id,
      isAdmin: user.isAdmin,
    }))
    createProject({ ...data, userProjectsAttributes: cleanedAllowedUsers })
  }

  return (
    <Page title={t('new')}>
      <Heading variant='h1' mb={10}>
        {t('new')}
      </Heading>
      <FormProvider<ProjectInputs>
        methods={methods}
        isError={isError}
        error={error}
        isSuccess={isSuccess}
        callbackAfterSuccess={() => router.push(`/projects/${data?.id}`)}
      >
        <form onSubmit={methods.handleSubmit(submitForm)}>
          <ProjectForm
            setAllowedUsers={setAllowedUsers}
            allowedUsers={allowedUsers}
            isLoading={isLoading}
          />
        </form>
      </FormProvider>
    </Page>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res }: GetServerSidePropsContext) => {
      if (typeof locale === 'string') {
        const session = await getServerSession(req, res, authOptions)

        if (session) {
          // Only admin user can access to this page
          if (session.user.role !== RoleEnum.Admin) {
            return {
              redirect: {
                destination: '/',
                permanent: false,
              },
            }
          }

          // Need to keep this and not use the languages in the constants.js because
          // the select in the project form needs to access the id for each language
          const languageResponse = await store.dispatch(getLanguages.initiate())
          await Promise.all(
            store.dispatch(apiGraphql.util.getRunningQueriesThunk())
          )

          const hashStoreLanguage: Languages = {}
          languageResponse.data?.forEach(element => {
            hashStoreLanguage[element.code as keyof Languages] = ''
          })

          // Translations
          const translations = await serverSideTranslations(locale, [
            'project',
            'common',
            'validations',
          ])

          return {
            props: {
              hashStoreLanguage,
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

NewProject.getLayout = function getLayout(page: ReactElement) {
  return <Layout showSideBar={false}>{page}</Layout>
}
