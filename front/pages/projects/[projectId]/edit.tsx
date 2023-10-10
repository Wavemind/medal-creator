/**
 * The external imports
 */
import { useState, useEffect, ReactElement } from 'react'
import { Heading } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getServerSession } from 'next-auth'
import type { GetServerSidePropsContext } from 'next'

/**
 * The internal imports
 */
import FormProvider from '@/components/formProvider'
import Page from '@/components/page'
import ProjectForm from '@/components/forms/project'
import Layout from '@/lib/layouts/default'
import { wrapper } from '@/lib/store'
import {
  editProject,
  useEditProjectQuery,
  useUpdateProjectMutation,
} from '@/lib/api/modules/enhanced/project.enhanced'
import { getLanguages } from '@/lib/api/modules/enhanced/language.enhanced'
import { getUsers } from '@/lib/api/modules/enhanced/user.enhanced'
import { apiGraphql } from '@/lib/api/apiGraphql'
import { useAppRouter } from '@/lib/hooks'
import ProjectService from '@/lib/services/project.service'
import { extractTranslation } from '@/lib/utils/string'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import {
  AllowedUser,
  ProjectInputs,
  UserProject,
  EditProjectPage,
  RoleEnum,
  Languages,
} from '@/types'

export default function EditProject({
  projectId,
  emergencyContentTranslations,
  studyDescriptionTranslations,
  previousAllowedUsers,
}: EditProjectPage) {
  const { t } = useTranslation('project')
  const router = useAppRouter()
  const [allowedUsers, setAllowedUsers] = useState(previousAllowedUsers)

  const [
    updateProject,
    { isSuccess: isSuccessUpdateProject, isError, error, isLoading },
  ] = useUpdateProjectMutation()
  const { data: project, isSuccess: isSuccessEditProject } =
    useEditProjectQuery({ id: projectId })

  /**
   * Setup form configuration
   */
  const methods = useForm<ProjectInputs>({
    resolver: yupResolver(ProjectService.getValidationSchema(t)),
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
      methods.reset(ProjectService.buildFormData(project))
    }
  }, [isSuccessEditProject, project])

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

  return (
    <Page title={t('edit', { project: project?.name })}>
      <Heading variant='h1' mb={10}>
        {t('edit', { project: project?.name })}
      </Heading>
      <FormProvider<ProjectInputs>
        methods={methods}
        isError={isError}
        error={error}
        isSuccess={isSuccessUpdateProject}
        callbackAfterSuccess={() => router.push(`/projects/${projectId}`)}
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
    async ({ locale, req, res, query }: GetServerSidePropsContext) => {
      const { projectId } = query

      if (typeof locale === 'string' && typeof projectId === 'string') {
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

          const projectResponse = await store.dispatch(
            editProject.initiate({ id: projectId })
          )

          // Only admin or project admin can access
          if (
            projectResponse.isSuccess &&
            (projectResponse.data.isCurrentUserAdmin ||
              session.user.role === RoleEnum.Admin)
          ) {
            // Need to keep this and not use the languages in the constants.js because
            // the select in the project form needs to access the id for each language
            const languageResponse = await store.dispatch(
              getLanguages.initiate()
            )
            const usersResponse = await store.dispatch(
              getUsers.initiate({ projectId: projectId })
            )
            await Promise.all(
              store.dispatch(apiGraphql.util.getRunningQueriesThunk())
            )

            // Generate allowedUsers
            const previousAllowedUsers: AllowedUser[] = []
            if (usersResponse.isSuccess && projectResponse.isSuccess) {
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
            } else {
              return {
                notFound: true,
              }
            }

            // Generate all languages with needed languages
            const emergencyContentTranslations: Languages = {}
            const studyDescriptionTranslations: Languages = {}

            if (languageResponse.data) {
              languageResponse.data.forEach(element => {
                emergencyContentTranslations[element.code as keyof Languages] =
                  extractTranslation(
                    projectResponse.data.emergencyContentTranslations,
                    element.code
                  )
                studyDescriptionTranslations[element.code as keyof Languages] =
                  extractTranslation(
                    projectResponse.data.studyDescriptionTranslations,
                    element.code
                  )
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
          notFound: true,
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
