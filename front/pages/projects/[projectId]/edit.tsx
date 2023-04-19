/**
 * The external imports
 */
import { useState, useEffect, ReactElement } from 'react'
import {
  Heading,
  Alert,
  AlertIcon,
  Box,
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
import { FormProvider, ErrorMessage, Page, ProjectForm } from '@/components'
import Layout from '@/lib/layouts/default'
import { wrapper } from '@/lib/store'
import {
  editProject,
  useEditProjectQuery,
  useUpdateProjectMutation,
  getLanguages,
  getUsers,
} from '@/lib/api/modules'
import { apiGraphql } from '@/lib/api/apiGraphql'
import { useToast } from '@/lib/hooks'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { Role } from '@/lib/config/constants'
import type {
  AllowedUser,
  ProjectInputs,
  UserProject,
  StringIndexType,
  EditProjectPage,
} from '@/types'

export default function EditProject({
  projectId,
  emergencyContentTranslations,
  studyDescriptionTranslations,
  previousAllowedUsers,
}: EditProjectPage) {
  const { t } = useTranslation('project')
  const router = useRouter()
  const { newToast } = useToast()
  const [allowedUsers, setAllowedUsers] = useState(previousAllowedUsers)

  const [updateProject, { isSuccess: isSuccessUpdateProject, isError, error }] =
    useUpdateProjectMutation()
  const { data: project, isSuccess: isSuccessEditProject } =
    useEditProjectQuery(projectId)

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
      emergencyContentTranslations: emergencyContentTranslations,
      studyDescriptionTranslations: studyDescriptionTranslations,
    },
  })

  useEffect(() => {
    if (isSuccessEditProject) {
      methods.reset({
        name: project.name,
        description: project.description || '',
        consentManagement: project.consentManagement,
        trackReferral: project.trackReferral,
        languageId: project.language.id,
      })
    }
  }, [isSuccessEditProject])

  /**
   * Send values to data
   * @param {object} data
   */
  const submitForm: SubmitHandler<ProjectInputs> = data => {
    // Add _destroy
    let cleanedAllowedUsers: Partial<UserProject>[] = []
    cleanedAllowedUsers = previousAllowedUsers.map(previousUser => {
      const foundUser = allowedUsers.find(
        allowedUser => allowedUser.id === previousUser.id
      )

      if (!foundUser) {
        // Existing but removed
        return {
          id: previousUser.userProjectId,
          userId: previousUser.id,
          isAdmin: previousUser.isAdmin,
          _destroy: true,
        }
      }
      // Existing and no change
      return {
        id: previousUser.userProjectId,
        userId: previousUser.id,
        isAdmin: foundUser.isAdmin,
      }
    })

    // Added users
    allowedUsers.forEach(allowedUser => {
      const foundUser = cleanedAllowedUsers.find(
        caUser => caUser.userId === allowedUser.id
      )
      if (!foundUser) {
        cleanedAllowedUsers.push({
          userId: allowedUser.id,
          isAdmin: allowedUser.isAdmin,
        })
      }
    })

    updateProject({
      ...data,
      id: projectId,
      userProjectsAttributes: cleanedAllowedUsers,
    })
  }

  useEffect(() => {
    if (isSuccessUpdateProject) {
      newToast({
        message: t('notifications.updateSuccess', { ns: 'common' }),
        status: 'success',
      })
      router.push(`/projects/${projectId}`)
    }
  }, [isSuccessUpdateProject])

  return (
    <Page title={t('edit', { project: project?.name })}>
      <Heading variant='h1' mb={10}>
        {t('edit', { project: project?.name })}
      </Heading>
      <Box mt={6} textAlign='center'>
        {isError && (
          <Alert status='error' mb={4}>
            <AlertIcon />
            <AlertDescription>
              <ErrorMessage error={error} />
            </AlertDescription>
          </Alert>
        )}
      </Box>
      <FormProvider<ProjectInputs>
        methods={methods}
        isError={isError}
        error={error}
      >
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
    async ({ locale, req, res, query }: GetServerSidePropsContext) => {
      const { projectId } = query

      if (typeof locale === 'string') {
        const session = await getServerSession(req, res, authOptions)

        if (session) {
          const projectResponse = await store.dispatch(
            editProject.initiate(Number(projectId))
          )

          // Only admin or project admin can access
          if (
            projectResponse.isSuccess &&
            (projectResponse.data.isCurrentUserAdmin ||
              session.user.role === Role.admin)
          ) {
            // Need to keep this and not use the languages in the constants.js because
            // the select in the project form needs to access the id for each language
            const languageResponse = await store.dispatch(
              getLanguages.initiate()
            )
            const usersResponse = await store.dispatch(
              getUsers.initiate({ projectId: Number(projectId) })
            )
            await Promise.all(
              store.dispatch(apiGraphql.util.getRunningQueriesThunk())
            )

            // Generate allowedUsers
            const previousAllowedUsers: AllowedUser[] = []
            if (usersResponse.data && projectResponse.data) {
              usersResponse.data.edges.forEach(user => {
                const tempUser = projectResponse.data.userProjects.find(
                  userProject => userProject.userId === user.node.id
                )
                if (tempUser) {
                  previousAllowedUsers.push({
                    ...user.node,
                    userProjectId: tempUser.id,
                    isAdmin: tempUser.isAdmin,
                  })
                }
              })
            }

            // Generate all languages with needed languages
            const emergencyContentTranslations: StringIndexType = {}
            const studyDescriptionTranslations: StringIndexType = {}

            if (languageResponse.data) {
              languageResponse.data.forEach(element => {
                emergencyContentTranslations[element.code] =
                  projectResponse.data.emergencyContentTranslations[
                    element.code
                  ] || ''
                studyDescriptionTranslations[element.code] =
                  projectResponse.data.studyDescriptionTranslations[
                    element.code
                  ] || ''
              })
            }

            // Translations
            const translations = await serverSideTranslations(locale, [
              'project',
              'common',
              'validations',
            ])

            return {
              props: {
                ...translations,
                emergencyContentTranslations,
                studyDescriptionTranslations,
                previousAllowedUsers,
                projectId: projectId,
              },
            }
          }
        }

        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
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

EditProject.getLayout = function getLayout(page: ReactElement) {
  return <Layout showSideBar={false}>{page}</Layout>
}
