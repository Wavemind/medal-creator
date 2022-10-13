/**
 * The external imports
 */
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { getCookie } from 'cookies-next'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { VStack, Button, Box, Heading, HStack } from '@chakra-ui/react'

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
  getRunningOperationPromises,
} from '/lib/services/modules/user'

export default function Information({ userId }) {
  const { t } = useTranslation('account')
  const { newToast } = useToast()

  const { data } = useGetUserQuery(userId)

  const [updateUser, updateUserValues] = useUpdateUserMutation()

  const methods = useForm({
    resolver: yupResolver(
      yup.object({
        firstName: yup
          .string()
          .nullable()
          .required(t('required', { ns: 'validations' })),
        lastName: yup
          .string()
          .nullable()
          .required(t('required', { ns: 'validations' })),
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
              <Input source='information' name='firstName' required />
              <Input source='information' name='lastName' required />
              <Input source='information' name='email' required />
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
  return <Layout menuType='account'>{page}</Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, req, res }) => {
      const userId = await JSON.parse(getCookie('session', { req, res })).userId
      await store.dispatch(
        setSession(JSON.parse(getCookie('session', { req, res })))
      )
      store.dispatch(getUser.initiate(userId))
      await Promise.all(getRunningOperationPromises())

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
          userId,
        },
      }
    }
)
