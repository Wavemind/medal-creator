/**
 * The external imports
 */
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { VStack, Button, Box, Heading, HStack, Text } from '@chakra-ui/react'

/**
 * The internal imports
 */
import Layout from '/lib/layouts/default'
import { Page, Input } from '/components'
import { wrapper } from '/lib/store'
import { setSession } from '/lib/store/session'
import { useToast } from '/lib/hooks'
import {
  getUser,
  useGetUserQuery,
  useUpdateUserMutation,
} from '/lib/services/modules/user'
import { apiGraphql } from '/lib/services/apiGraphql'
import getUserBySession from '/lib/utils/getUserBySession'

export default function Information({ userId }) {
  const { t } = useTranslation('account')
  const { newToast } = useToast()

  const { data } = useGetUserQuery(userId)

  const [updateUser, updateUserValues] = useUpdateUserMutation()

  /**
   * Setup form configuration
   */
  const methods = useForm({
    resolver: yupResolver(
      yup.object({
        firstName: yup.string().required(t('required', { ns: 'validations' })),
        lastName: yup.string().required(t('required', { ns: 'validations' })),
        email: yup
          .string()
          .email(t('email', { ns: 'validations' }))
          .required(t('required', { ns: 'validations' })),
      })
    ),
    reValidateMode: 'onSubmit',
    defaultValues: data,
  })

  useEffect(() => {
    if (updateUserValues.isSuccess) {
      newToast({
        message: t('notifications.updateSuccess'),
        status: 'success',
      })
    }
  }, [updateUserValues.isSuccess])

  return (
    <Page title={t('information.title')}>
      <Heading mb={10}>{t('information.header')}</Heading>
      <Box w='50%'>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(updateUser)}>
            <VStack align='left' spacing={12}>
              <Input
                label={t('information.firstName')}
                name='firstName'
                required
              />
              <Input
                label={t('information.lastName')}
                name='lastName'
                required
              />
              <Input label={t('information.email')} name='email' required />
              <Box mt={6} textAlign='center'>
                {updateUserValues.isError && (
                  <Text fontSize='m' color='red' data-cy='server_message'>
                    {typeof updateUserValues.error.error === 'string'
                      ? updateUserValues.error.error
                      : updateUserValues.error.message}
                  </Text>
                )}
              </Box>
              <HStack justifyContent='flex-end'>
                <Button type='submit' mt={6} isLoading={methods.isSubmitting}>
                  {t('save', { ns: 'common' })}
                </Button>
              </HStack>
            </VStack>
          </form>
        </FormProvider>
      </Box>
    </Page>
  )
}

Information.getLayout = function getLayout(page) {
  return (
    <Layout menuType='account' showSideBar={false}>
      {page}
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res }) => {
      const currentUser = getUserBySession(req, res)
      await store.dispatch(setSession(currentUser))
      store.dispatch(getUser.initiate(currentUser.userId))
      await Promise.all(
        store.dispatch(apiGraphql.util.getRunningQueriesThunk())
      )

      // Translations
      const translations = await serverSideTranslations(locale, [
        'common',
        'account',
        'submenu',
        'validations',
      ])

      return {
        props: {
          ...translations,
          userId: currentUser.userId,
        },
      }
    }
)
