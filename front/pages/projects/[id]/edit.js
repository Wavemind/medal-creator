/**
 * The external imports
 */
import { useState, useEffect } from 'react'
import {
  Heading,
  Alert,
  AlertIcon,
  Box,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

/**
 * The internal imports
 */
import { Page, ProjectForm } from '/components'
import Layout from '/lib/layouts/default'
import { wrapper } from '/lib/store'
import { setSession } from '/lib/store/session'
import { getLanguages } from '/lib/services/modules/language'
import { editProject, useEditProjectQuery } from '/lib/services/modules/project'
import { apiGraphql } from '/lib/services/apiGraphql'
import { getUsers } from '/lib/services/modules/user'
import { useUpdateProjectMutation } from '/lib/services/modules/project'
import getUserBySession from '/lib/utils/getUserBySession'
import { useToast } from '/lib/hooks'
import { useRouter } from 'next/router'

export default function EditProject({
  id,
  emergencyContentTranslations,
  studyDescriptionTranslations,
  previousAllowedUsers,
}) {
  const { t } = useTranslation(['project', 'common', 'validations'])
  const router = useRouter()
  const { newToast } = useToast()
  const [allowedUsers, setAllowedUsers] = useState(previousAllowedUsers)

  const [updateProject, { isSuccess, isError, error, data }] = useUpdateProjectMutation()
  const { data: project } = useEditProjectQuery(id)

  /**
   * Setup form configuration
   */
  const methods = useForm({
    resolver: yupResolver(
      yup.object({
        name: yup.string().required(t('required', { ns: 'validations' })),
        languageId: yup.string().required(t('required', { ns: 'validations' })),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: {
      id: project.id,
      name: project.name,
      description: project.description || '',
      consentManagement: project.consentManagement,
      trackReferral: project.consentManagement,
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
  const submitForm = data => {
    // Add _destroy
    let cleanedAllowedUsers = []
    cleanedAllowedUsers = previousAllowedUsers.map(previousUser => {
      const foundUser = allowedUsers.find(
        allowedUser => allowedUser.id === previousUser.id
      )
      // TODO: CHECK IF CAN SIMPLIFY those 2 returns
      if (!foundUser) {
        // Existing but removed
        return {
          id: previousUser.userProjectId,
          userId: previousUser.id,
          isAdmin: previousUser.isAdmin, // CHECK IF NEEDED
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

    console.log({ ...data, userProjectsAttributes: cleanedAllowedUsers })

    updateProject({ ...data, userProjectsAttributes: cleanedAllowedUsers })
  }

  useEffect(() => {
    if (isSuccess) {
      newToast({
        message: t('notifications.createSuccess', { ns: 'common' }),
        status: 'success',
      })
      router.push(`/projects/${data.id}`)
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
              {typeof error.message === 'string'
                ? error.message.split(':')[0]
                : error.data.errors.join()}
            </AlertDescription>
          </Alert>
        )}
      </Box>
      <ProjectForm
        methods={methods}
        submit={submitForm}
        setAllowedUsers={setAllowedUsers}
        allowedUsers={allowedUsers}
      />
    </Page>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res, query }) => {
      const { id } = query
      const currentUser = getUserBySession(req, res)
      // TODO NEED TO KNOW IF USER HAVE ACCESS TO THIS PROJECT
      // Only admin user can access to this page
      if (currentUser.role !== 'admin') {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }

      await store.dispatch(setSession(currentUser))
      const languageResponse = await store.dispatch(getLanguages.initiate())
      const usersResponse = await store.dispatch(getUsers.initiate())
      const projectResponse = await store.dispatch(editProject.initiate(id))
      await Promise.all(
        store.dispatch(apiGraphql.util.getRunningQueriesThunk())
      )

      // Generate allowedUsers
      const previousAllowedUsers = []
      usersResponse.data.forEach(user => {
        const tempUser = projectResponse.data.userProjects.find(
          userProject => userProject.userId === user.id
        )
        if (tempUser) {
          previousAllowedUsers.push({
            ...user,
            userProjectId: tempUser.id,
            isAdmin: tempUser.isAdmin,
          })
        }
      })

      // Generate all languages with needed languages
      const emergencyContentTranslations = {}
      const studyDescriptionTranslations = {}

      languageResponse.data.forEach(element => {
        emergencyContentTranslations[element.code] =
          projectResponse.data.emergencyContentTranslations[element.code] || ''
        studyDescriptionTranslations[element.code] =
          projectResponse.data.studyDescriptionTranslations[element.code] || ''
      })

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
          id,
        },
      }
    }
)

EditProject.getLayout = function getLayout(page) {
  return <Layout showSideBar={false}>{page}</Layout>
}
