/**
 * The external imports
 */
import { useState, useEffect, ReactElement } from 'react'
import {
  Heading,
  Alert,
  AlertIcon,
  Box,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { getServerSession } from 'next-auth'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import { ErrorMessage, Page, ProjectForm, FormProvider } from '@/components'
import Layout from '@/lib/layouts/default'
import { wrapper } from '@/lib/store'
import { apiGraphql } from '@/lib/services/apiGraphql'
import { useCreateProjectMutation, getLanguages } from '@/lib/services/modules'
import { useToast } from '@/lib/hooks'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { Role } from '@/lib/config/constants'
import type { StringIndexType, AllowedUser, ProjectInputs } from '@/types'

/**
 * Type definitions
 */
type NewProjectProps = {
  hashStoreLanguage: StringIndexType
}

export default function NewProject({ hashStoreLanguage }: NewProjectProps) {
  const { t } = useTranslation('project')
  const router = useRouter()
  const { newToast } = useToast()
  const [allowedUsers, setAllowedUsers] = useState<AllowedUser[]>([])

  const [createProject, { data, isSuccess, isError, error }] =
    useCreateProjectMutation()

  /**
   * Setup form configuration
   */
  const methods = useForm<ProjectInputs>({
    resolver: yupResolver(
      yup.object({
        name: yup.string().label(t('form.name')).required(),
        languageId: yup.string().label(t('form.languageId')).required(),
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

  useEffect(() => {
    if (isSuccess) {
      newToast({
        message: t('notifications.createSuccess', { ns: 'common' }),
        status: 'success',
      })
      router.push(`/projects/${data?.id}`)
    }
  }, [isSuccess])

  return (
    <Page title={t('new')}>
      <Heading variant='h1' mb={10}>
        {t('new')}
      </Heading>
      <Box mt={6} textAlign='center'>
        {isError && (
          <Alert status='error' mb={4}>
            <AlertIcon />
            <AlertTitle>{t('checkForm', { ns: 'validations' })}</AlertTitle>
            <AlertDescription>
              {error && <ErrorMessage error={error} />}
            </AlertDescription>
          </Alert>
        )}
      </Box>
      <FormProvider<ProjectInputs> methods={methods} isError={isError} error={error} >
        <form onSubmit={methods.handleSubmit(submitForm)}>
          <ProjectForm
            setAllowedUsers={setAllowedUsers}
            allowedUsers={allowedUsers}
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
          if (session.user.role !== Role.admin) {
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

          const hashStoreLanguage: StringIndexType = {}
          languageResponse.data?.forEach(element => {
            hashStoreLanguage[element.code] = ''
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
