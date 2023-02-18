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
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'

/**
 * The internal imports
 */
import { FormError, Page, ProjectForm } from '@/components'
import Layout from '@/lib/layouts/default'
import { wrapper } from '@/lib/store'
import { setSession } from '@/lib/store/session'
import { getLanguages } from '@/lib/services/modules/language'
import {
  editProject,
  useEditProjectQuery,
  useUpdateProjectMutation,
} from '@/lib/services/modules/project'
import { apiGraphql } from '@/lib/services/apiGraphql'
import { getUsers } from '@/lib/services/modules/user'
import getUserBySession from '@/lib/utils/getUserBySession'
import { useToast } from '@/lib/hooks'
import type { AllowedUser } from '@/types/user'
import type { Project, ProjectInputs } from '@/types/project'
import type { UserProject } from '@/types/userProject'
import type { StringIndexType } from '@/types/common'

/**
 * Type definitions
 */
type EditProjectProps = {
  projectId: number
  emergencyContentTranslations: StringIndexType
  studyDescriptionTranslations: StringIndexType
  previousAllowedUsers: AllowedUser[]
}

export default function EditProject({
  projectId,
  emergencyContentTranslations,
  studyDescriptionTranslations,
  previousAllowedUsers,
}: EditProjectProps) {
  const { t } = useTranslation('project')
  const router = useRouter()
  const { newToast } = useToast()
  const [allowedUsers, setAllowedUsers] = useState(previousAllowedUsers)

  const [updateProject, { isSuccess, isError, error }] =
    useUpdateProjectMutation()
  const { data: project = {} as Project } = useEditProjectQuery(projectId)

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
      id: project.id,
      name: project.name,
      description: project.description || '',
      consentManagement: project.consentManagement,
      trackReferral: project.trackReferral,
      villages: null,
      languageId: project.language.id,
      emergencyContentTranslations: emergencyContentTranslations,
      studyDescriptionTranslations: studyDescriptionTranslations,
    },
  })

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
          id: previousUser.id,
          userId: previousUser.id,
          isAdmin: previousUser.isAdmin,
          _destroy: true,
        }
      }
      // Existing and no change
      return {
        id: previousUser.id,
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

    updateProject({ ...data, userProjectsAttributes: cleanedAllowedUsers })
  }

  useEffect(() => {
    if (isSuccess) {
      newToast({
        message: t('notifications.updateSuccess', { ns: 'common' }),
        status: 'success',
      })
      router.push(`/projects/${project.id}`)
    }
  }, [isSuccess])

  return (
    <Page title={t('edit', { project: project.name })}>
      <Heading variant='h1' mb={10}>
        {t('edit', { project: project.name })}
      </Heading>
      <Box mt={6} textAlign='center'>
        {isError && (
          <Alert status='error' mb={4}>
            <AlertIcon />
            <AlertTitle>{t('checkForm', { ns: 'validations' })}</AlertTitle>
            <AlertDescription>
              {error && <FormError error={error} />}
            </AlertDescription>
          </Alert>
        )}
      </Box>
      <FormProvider {...methods}>
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
        const currentUser = getUserBySession(
          req as NextApiRequest,
          res as NextApiResponse
        )

        store.dispatch(setSession(currentUser))

        const projectResponse = await store.dispatch(
          editProject.initiate(Number(projectId))
        )

        // Only admin or project admin can access
        if (
          projectResponse.isSuccess &&
          (projectResponse.data.isCurrentUserAdmin ||
            currentUser.role === 'admin')
        ) {
          // Need to keep this and not use the languages in the constants.js because
          // the select in the project form needs to access the id for each language
          const languageResponse = await store.dispatch(getLanguages.initiate())
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
          destination: '/500',
          permanent: false,
        },
      }
    }
)

EditProject.getLayout = function getLayout(page: ReactElement) {
  return <Layout showSideBar={false}>{page}</Layout>
}
