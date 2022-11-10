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
import { useCreateProjectMutation } from '/lib/services/modules/project'
import getUserBySession from '/lib/utils/getUserBySession'
import { useToast } from '/lib/hooks'
import { useRouter } from 'next/router'

export default function NewProject({ id, hashStoreLanguage }) {
  const { t } = useTranslation(['project', 'common', 'validations'])
  const router = useRouter()
  const { newToast } = useToast()
  const [allowedUsers, setAllowedUsers] = useState([])

  const [createProject, createProjectValues] = useCreateProjectMutation()
  const { data: project } = useEditProjectQuery()

  console.log(project)

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
      name: '',
      description: '',
      consentManagement: false,
      trackReferral: false,
      villages: null,
      languageId: '',
      emergencyContentTranslations: hashStoreLanguage,
      studyDescriptionTranslations: hashStoreLanguage,
    },
  })

  /**
   * Send values to data
   * @param {object} data,
   */
  const submitForm = data => {
    const cleanedAllowedUsers = allowedUsers.map(user => ({
      userId: user.id,
      isAdmin: user.isAdmin,
    }))
    createProject({ ...data, userProjectsAttributes: cleanedAllowedUsers })
  }

  useEffect(() => {
    if (createProjectValues.isSuccess) {
      newToast({
        message: t('notifications.createSuccess', { ns: 'common' }),
        status: 'success',
      })
      router.push(`/projects/${createProjectValues.data.id}`)
    }
  }, [createProjectValues.isSuccess])

  return (
    <Page title={t('title')}>
      <Heading variant='h1' mb={10}>
        {t('title')}
      </Heading>
      <Box mt={6} textAlign='center'>
        {createProjectValues.isError && (
          <Alert status='error' mb={4}>
            <AlertIcon />
            <AlertTitle>{t('checkForm', { ns: 'validations' })}</AlertTitle>
            <AlertDescription>
              {typeof createProjectValues.error.message === 'string'
                ? createProjectValues.error.message.split(':')[0]
                : createProjectValues.error.data.errors.join()}
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
      console.log(query)
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
      store.dispatch(getUsers.initiate())
      store.dispatch(editProject.initiate(id))
      await Promise.all(
        store.dispatch(apiGraphql.util.getRunningQueriesThunk())
      )

      const hashStoreLanguage = {}
      languageResponse.data.forEach(element => {
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
)

NewProject.getLayout = function getLayout(page) {
  return <Layout showSideBar={false}>{page}</Layout>
}
